import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core'
import { BaseEntity } from './BaseEntity.entity'
import { PokemonEntity } from './Pokemon.entity'

@Entity({ tableName: 'user' })
export class UserEntity extends BaseEntity {
  @Property()
  authToken!: string

  @ManyToMany({
    entity: () => PokemonEntity,
    owner: true,
  })
  favouritePokemons: Collection<PokemonEntity> = new Collection<PokemonEntity>(
    this
  )
}
