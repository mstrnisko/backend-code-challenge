import { FastifyInstance } from 'fastify'
import { getPokemons } from './getPokemons'

export const pokemon = (fastify: FastifyInstance, _, done) => {
  fastify.get('/', getPokemons)
  done()
}
