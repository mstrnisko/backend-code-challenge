import { Loaded } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import * as fastify from 'fastify'
import { UserEntity } from '../entities/User.entity'

declare module 'fastify' {
  export interface FastifyRequest extends fastify.FastifyRequest {
    em: EntityManager
    userAuth: Loaded<UserEntity> | null
  }
}
