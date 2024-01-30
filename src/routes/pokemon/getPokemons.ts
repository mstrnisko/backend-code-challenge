import { FastifyRequestWithEntityManager } from '../../types/fastify'

export const getPokemons = (req: FastifyRequestWithEntityManager) => {
  console.log('req.em', req.em)
  return { 'dostal som': 200 }
}
