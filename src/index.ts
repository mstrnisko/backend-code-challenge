import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { EntityManager, MikroORM } from '@mikro-orm/postgresql'
import Fastify from 'fastify'
import mikroOrmConfig from './mikro-orm.config'
import { routes } from './routes/routes'

void (async () => {
  const fastify = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>()

  const orm = await MikroORM.init(mikroOrmConfig)
  const em = orm.em as EntityManager

  void fastify.register(routes)

  fastify.addHook('onRequest', (request, _, done) => {
    // adds forked EM to every request in fastify
    request.em = em.fork()
    done()
  })

  fastify.addHook('onClose', async () => {
    console.log('Closing db')
    await orm.close()
  })

  const start = async () => {
    try {
      await fastify.listen({ port: 3000 })
    } catch (err) {
      fastify.log.error(err)
      console.log('closing db')
      await orm.close()
      process.exit(1)
    }
  }

  await start()
})()
