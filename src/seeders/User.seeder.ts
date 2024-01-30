import { EntityManager } from '@mikro-orm/postgresql'
import { Seeder } from '@mikro-orm/seeder'
import { UserEntity } from '../entities/User.entity'
import { UserFactory } from './User.factory'

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = new UserFactory(em).make(2)
    users.forEach((user) => {
      const newEntity = em.create(UserEntity, user)
      em.persist(newEntity)
    })
    await em.flush()
  }
}
