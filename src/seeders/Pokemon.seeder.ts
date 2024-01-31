import { EntityManager } from '@mikro-orm/postgresql'
import { Seeder } from '@mikro-orm/seeder'
import * as R from 'ramda'
import { AttackEntity } from '../entities/Attack.entity'
import { PokemonEntity } from '../entities/Pokemon.entity'
import { ResistantEntity } from '../entities/Resistant.entity'
import pokemons from './pokemons.json'

export class PokemonSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // this whole seeder could be broken into smaller pieces like Attack and
    // Resistant, but for the sake of the demo, I think this is enough
    const formattedData = pokemons.reduce(
      // false error, however, I don't really think it's relevant for this demo
      (acc, currVal) => {
        const resistants = [
          ...acc.resistants,
          ...currVal.types,
          ...currVal.resistant,
          ...currVal.weaknesses,
        ]
        const attacks = [
          ...acc.attacks,
          ...currVal.attacks.fast,
          ...currVal.attacks.special,
        ]
        const newPokemon = {
          id: Number(currVal.id),
          name: currVal.name,
          classification: currVal.classification,
          minWeight: currVal.weight.minimum,
          maxWeight: currVal.weight.maximum,
          minHeight: currVal.height.minimum,
          maxHeight: currVal.height.maximum,
          fleeRate: currVal.fleeRate,
          ...(currVal.evolutionRequirements?.amount &&
            currVal.evolutionRequirements?.name && {
              evolutionRequirementAmount: currVal.evolutionRequirements?.amount,
              evolutionRequirementName: currVal.evolutionRequirements?.name,
            }),
          maxCP: currVal.maxCP,
          maxHP: currVal.maxHP,
          ...(currVal.attacks.fast && {
            fastAttacks: currVal.attacks.fast.map(
              (fastAttack) => fastAttack.name
            ),
          }),
          ...(currVal.attacks.special && {
            specialAttacks: currVal.attacks.special.map(
              (specialAttack) => specialAttack.name
            ),
          }),
          ...(currVal['Common Capture Area'] && {
            commonCaptureArea: Object.keys(currVal).find(
              (key) =>
                currVal[key as keyof typeof currVal] === 'Common Capture Area'
            ),
          }),
          ...(currVal['Pokémon Class'] && {
            otherPokemonClass: Object.keys(currVal).find(
              (key) => currVal[key as keyof typeof currVal] === 'Pokémon Class'
            ),
          }),
          types: currVal.types,
          resistantTypes: currVal.resistant,
          weaknessesTypes: currVal.weaknesses,
          ...(currVal.evolutions &&
            currVal.evolutions.length > 0 && {
              evolutions: currVal.evolutions.map((evolution) => evolution.id),
            }),
          ...(currVal['Previous evolution(s)'] &&
            currVal['Previous evolution(s)'].length > 0 && {
              previousEvolutions: currVal['Previous evolution(s)'].map(
                (evolution) => evolution.id
              ),
            }),
        }
        const data = [...acc.data, newPokemon]
        return { resistants, attacks, data }
      },
      {
        resistants: [] as string[],
        attacks: [] as {
          name: string
          type: string
          damage: number
        }[],
        data: [] as (Omit<
          PokemonEntity,
          | 'evolutions'
          | 'previousEvolutions'
          | 'createdAt'
          | 'updatedAt'
          | 'favouritedBy'
          | 'fastAttacks'
          | 'specialAttacks'
          | 'otherPokemonClass'
          | 'types'
          | 'resistantTypes'
          | 'weaknessesTypes'
        > & {
          types: string[]
          resistantTypes: string[]
          weaknessesTypes: string[]
          otherPokemonClass?: string
          fastAttacks: string[]
          specialAttacks: string[]
          evolutions?: number[]
          previousEvolutions?: number[]
        })[],
      }
    )
    const uniqueResistants = [...new Set(formattedData.resistants)]
    const uniqueAttacks = R.uniqBy((val) => val.name, formattedData.attacks)
    uniqueResistants.forEach((uniqueResistant) => {
      const newEntity = em.create(ResistantEntity, { name: uniqueResistant })
      em.persist(newEntity)
    })
    uniqueAttacks.forEach(({ name, type, damage }) => {
      const newEntity = em.create(AttackEntity, {
        name,
        // should first query from db to fix this TS error, but this works
        // anyway thanks to the `name` being PK, so just type-forcing ths
        type: type as unknown as ResistantEntity,
        damage,
      })
      em.persist(newEntity)
    })
    formattedData.data.forEach((pokemon) => {
      const newEntity = em.create(
        PokemonEntity,
        R.omit(
          ['evolutions', 'previousEvolutions'],
          pokemon
        ) as unknown as PokemonEntity
      )
      em.persist(newEntity)
    })
    formattedData.data.forEach((pokemon) => {
      // make evolutions and previousEvolutions relations in EM
      if (pokemon.evolutions || pokemon.previousEvolutions) {
        const ref = em.getReference(PokemonEntity, pokemon.id)
        if (pokemon.evolutions) {
          pokemon.evolutions.forEach((evolutionId) => {
            ref.evolutions.add(em.getReference(PokemonEntity, evolutionId))
          })
        }
        if (pokemon.previousEvolutions) {
          pokemon.previousEvolutions.forEach((evolutionId) => {
            ref.previousEvolutions.add(
              em.getReference(PokemonEntity, evolutionId)
            )
          })
        }
      }
    })
    await em.flush()
  }
}
