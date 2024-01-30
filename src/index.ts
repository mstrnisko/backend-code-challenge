import { EntityManager, MikroORM } from '@mikro-orm/postgresql'
import Fastify from 'fastify'
import mikroOrmConfig from './mikro-orm.config'
import { pokemon } from './routes/pokemon/pokemon'

void (async () => {
  const fastify = Fastify({
    logger: true,
  })

  const orm = await MikroORM.init(mikroOrmConfig)
  const em = orm.em as EntityManager

  await fastify.register(pokemon, { prefix: 'pokemon' })

  fastify.get('/healtheck', async () => {
    return { status: '200' }
  })

  fastify.addHook('onRequest', (request, reply, done) => {
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
