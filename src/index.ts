import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { EntityManager, MikroORM } from '@mikro-orm/postgresql'
import Fastify from 'fastify'
import { UserEntity } from './entities/User.entity'
import mikroOrmConfig from './mikro-orm.config'
import { pokemon } from './routes/pokemon/pokemon'

void (async () => {
  const fastify = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>()

  const orm = await MikroORM.init(mikroOrmConfig)
  const em = orm.em as EntityManager

  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Brainsoft BE code challange',
        version: '1.0.0',
      },
    },
    transform: ({ schema, url }) => {
      console.log('schema', schema)
      return { schema, url }
    },
  })
  await fastify.register(fastifySwaggerUi, {
    prefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
    },
  })

  await fastify.register(pokemon, { prefix: 'pokemon' })

  fastify.addHook('onRequest', async (request) => {
    // adds forked EM to every request in fastify
    request.em = em.fork()
    // Checks if request contains auth token, if yes, add user to
    // context/request for access in routes.
    // Ideally, there should be a proper auth in place, like firebase or some
    // other kind of checker for the user token, but right now for the demo
    // showcase, I think it's enough to query the user based on authToken
    // from headers right away
    const { 'x-auth-token': authToken } = request.headers
    const userFromDb = authToken
      ? await request.em.findOne(UserEntity, { authToken })
      : null
    request.userAuth = userFromDb
  })

  fastify.addHook('onClose', async () => {
    console.log('Closing db')
    await orm.close()
  })

  const start = async () => {
    try {
      await fastify.ready()
      fastify.swagger()
      await fastify.listen({ port: 3000 })
    } catch (err) {
      fastify.log.error(err)
      console.log('Closing db')
      await orm.close()
      process.exit(1)
    }
  }

  await start()
})()
