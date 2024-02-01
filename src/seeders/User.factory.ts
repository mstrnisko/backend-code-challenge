import { faker } from '@faker-js/faker'
import { Factory } from '@mikro-orm/seeder'
import { UserEntity } from '../entities/User.entity'

export class UserFactory extends Factory<UserEntity> {
  model = UserEntity

  definition(): Partial<UserEntity> {
    return {
      authToken: faker.string.uuid(),
    }
  }
}
