import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core'
import { AttackEntity } from './Attack.entity'
import { BaseEntity } from './BaseEntity.entity'
import { ResistantEntity } from './Resistant.entity'

enum OtherPokemonClass {
  Legendary = 'LEGENDARY',
  Mythic = 'MYTHIC',
}

@Entity({ tableName: 'pokemon' })
export class PokemonEntity extends BaseEntity {
  // override id from BaseEntity to not have auto-increment on id
  // since ids are supplied
  @PrimaryKey({ autoincrement: false })
  id!: number

  @Property()
  name!: string

  @Property()
  classification!: string

  @Property()
  minWeight!: string

  @Property()
  maxWeight!: string

  @Property()
  minHeight!: string

  @Property()
  maxHeight!: string

  @Property({ type: types.float })
  fleeRate!: number

  @Property()
  evolutionRequirementAmount?: number

  @Property()
  evolutionRequirementName?: string

  @Property()
  maxCP!: number

  @Property()
  maxHP!: number

  @ManyToMany({
    entity: () => AttackEntity,
    owner: true,
  })
  fastAttacks: Collection<AttackEntity> = new Collection<AttackEntity>(this)

  @ManyToMany({
    entity: () => AttackEntity,
    owner: true,
  })
  specialAttacks: Collection<AttackEntity> = new Collection<AttackEntity>(this)

  @Property()
  commonCaptureArea?: string

  @Enum(() => OtherPokemonClass)
  otherPokemonClass?: OtherPokemonClass

  @ManyToMany({
    entity: () => ResistantEntity,
    owner: true,
  })
  types: Collection<ResistantEntity> = new Collection<ResistantEntity>(this)

  @ManyToMany({
    entity: () => ResistantEntity,
    owner: true,
  })
  resistantTypes: Collection<ResistantEntity> = new Collection<ResistantEntity>(
    this
  )

  @ManyToMany({
    entity: () => ResistantEntity,
    owner: true,
  })
  weaknessesTypes: Collection<ResistantEntity> =
    new Collection<ResistantEntity>(this)

  @ManyToMany({
    entity: () => PokemonEntity,
  })
  evolutions: Collection<PokemonEntity> = new Collection<PokemonEntity>(this)

  @ManyToMany({
    entity: () => PokemonEntity,
  })
  previousEvolutions: Collection<PokemonEntity> = new Collection<PokemonEntity>(
    this
  )
}
