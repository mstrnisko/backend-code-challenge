import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
} from '@mikro-orm/core'
import { AttackEntity } from './Attack.entity'
import { PokemonEntity } from './Pokemon.entity'

@Entity({ tableName: 'resistant' })
export class ResistantEntity {
  @PrimaryKey()
  name!: string

  @OneToMany({
    entity: () => AttackEntity,
    mappedBy: 'type',
  })
  attacks: Collection<AttackEntity> = new Collection<AttackEntity>(this)

  @ManyToMany({
    entity: () => PokemonEntity,
    mappedBy: 'types',
  })
  pokemonsByTypes: Collection<PokemonEntity> = new Collection<PokemonEntity>(
    this
  )

  @ManyToMany({
    entity: () => PokemonEntity,
    mappedBy: 'resistantTypes',
  })
  pokemonsByResistantTypes: Collection<PokemonEntity> =
    new Collection<PokemonEntity>(this)

  @ManyToMany({
    entity: () => PokemonEntity,
    mappedBy: 'weaknessesTypes',
  })
  pokemonsByWeaknessesTypes: Collection<PokemonEntity> =
    new Collection<PokemonEntity>(this)
}
