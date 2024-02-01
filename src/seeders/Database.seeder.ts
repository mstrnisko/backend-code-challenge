import { EntityManager } from '@mikro-orm/postgresql'
import { Seeder } from '@mikro-orm/seeder'
import { PokemonSeeder } from './Pokemon.seeder'
import { UserSeeder } from './User.seeder'

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [PokemonSeeder, UserSeeder])
  }
}
