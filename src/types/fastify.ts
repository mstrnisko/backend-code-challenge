import { EntityManager } from '@mikro-orm/postgresql'
import { FastifyRequest } from 'fastify'

export type FastifyRequestWithEntityManager = FastifyRequest & {
  em: EntityManager
}
