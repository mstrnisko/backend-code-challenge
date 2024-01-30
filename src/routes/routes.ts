import { FastifyPluginAsync } from 'fastify'
import { pokemon } from './pokemon/pokemon'

export const routes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/healthcheck', async () => ({ status: 'works' }))
  // this could be broken into additional/smaller files, but
  // for the sake of the demo, it's enough - unnecessary boilerplate
  void fastify.register(pokemon, { prefix: 'pokemon' })
}
