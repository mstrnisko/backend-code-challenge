import { buildApp } from 'app'

export const buildTest = async () => {
  const { fastify } = await buildApp({
    logger: true,
  })

  return fastify
}
