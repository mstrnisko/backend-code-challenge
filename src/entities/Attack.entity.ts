import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { PokemonEntity } from './Pokemon.entity'
import { ResistantEntity } from './Resistant.entity'

@Entity({ tableName: 'attack' })
export class AttackEntity {
  @PrimaryKey()
  name!: string

  @ManyToOne({ entity: () => ResistantEntity })
  type!: ResistantEntity

  @Property()
  damage!: number

  @ManyToMany({
    entity: () => PokemonEntity,
    mappedBy: 'fastAttacks',
  })
  pokemonsByFastAttacks: Collection<PokemonEntity> =
    new Collection<PokemonEntity>(this)

  @ManyToMany({
    entity: () => PokemonEntity,
    mappedBy: 'specialAttacks',
  })
  pokemonsBySpecialAttacks: Collection<PokemonEntity> =
    new Collection<PokemonEntity>(this)
}
