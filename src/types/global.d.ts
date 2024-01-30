import { EntityManager } from '@mikro-orm/postgresql'
import * as fastify from 'fastify'

declare module 'fastify' {
  export interface FastifyRequest extends fastify.FastifyRequest {
    em: EntityManager
  }
}
