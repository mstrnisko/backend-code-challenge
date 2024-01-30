import { FastifyPluginAsync } from 'fastify'
import { pokemon } from './pokemon/pokemon'

export const routes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/healthcheck', async () => ({ status: 'works' }))
  void fastify.register(pokemon, { prefix: 'pokemon' })
  void fastify.register()
}
