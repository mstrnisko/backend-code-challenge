// eslint-disable-next-line simple-import-sort/imports
import 'dotenv/config'
import { buildApp } from './app'

void (async () => {
  const { fastify, orm } = await buildApp({
    logger: true,
  })

  const start = async () => {
    try {
      await fastify.ready()
      fastify.swagger()
      await fastify.listen({ port: 3000, host: '0.0.0.0' })
      console.log(`App is listening on: ${fastify.listeningOrigin}`)
      console.log(`Swagger is listening on: ${fastify.listeningOrigin}/docs`)
    } catch (err) {
      fastify.log.error(err)
      console.log('Closing db')
      await orm.close()
      process.exit(1)
    }
  }

  await start()
})()
