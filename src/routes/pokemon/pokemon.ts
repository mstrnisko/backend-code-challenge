import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { FastifyPluginAsync } from 'fastify'
import { PokemonEntity } from '../../entities/Pokemon.entity'
import { TypePokemon, TypeResistant } from '../../types/helpers'
import { ResistantEntity } from '../../entities/Resistant.entity'

export const pokemon: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>()
  app.get(
    '/',
    {
      schema: {
        querystring: Type.Partial(
          Type.Object({
            limit: Type.Number(),
            offset: Type.Number(),
            type: Type.String(),
            name: Type.String(),
          })
        ),
        response: {
          200: {
            data: Type.Array(TypePokemon()),
          },
        },
      },
    },
    async (request) => {
      const { limit, offset, type, name } = request.query
      const { em } = request
      const queriedPokemons = await em.findAll(PokemonEntity, {
        ...(limit && { limit }),
        ...(offset && { offset }),
        where: {
          types: {
            $some: {
              name: ['Poison'],
            },
          },
        },
        ...((type || name) && {
          where: {
            ...(type && {
              types: {
                $some: {
                  name: type,
                },
              },
            }),
            // current logic supports partial results, e.g. if searching for "saur",
            // you get Ivysaur, Bulbasaur, etc.
            ...(name && {
              name: {
                $ilike: `%${name}%`,
              },
            }),
          },
        }),
        orderBy: {
          id: 'asc',
        },
        populateOrderBy: {
          evolutions: {
            id: 'asc',
          },
          previousEvolutions: {
            id: 'asc',
          },
        },
        populate: [
          'fastAttacks',
          'specialAttacks',
          'types',
          'resistantTypes',
          'weaknessesTypes',
          'evolutions',
          'previousEvolutions',
        ],
      })
      // TODO: filter by favourite
      // TODO: maybe implement cursor based pagination? dunno how much time
      //  I want to spend on this
      // TODO: join other properties, like types, evolutions, etc.
      return { data: queriedPokemons }
    }
  )

  app.get(
    '/id/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        response: {
          200: {
            data: TypePokemon(),
          },
        },
      },
    },
    async (request) => {
      const {
        em,
        params: { id: pokemonId },
      } = request
      // it could be a good idea to use findOneOrFail
      const queriedPokemon = await em.findOne(
        PokemonEntity,
        {
          id: Number(pokemonId),
        },
        {
          populate: [
            'fastAttacks',
            'specialAttacks',
            'types',
            'resistantTypes',
            'weaknessesTypes',
            'evolutions',
            'previousEvolutions',
          ],
        }
      )
      return { data: queriedPokemon }
    }
  )

  app.get(
    '/name/:name',
    {
      schema: {
        params: Type.Object({
          name: Type.String(),
        }),
        response: {
          200: {
            data: TypePokemon(),
          },
        },
      },
    },
    async (request) => {
      const {
        em,
        params: { name },
      } = request
      // it could be a good idea to use findOneOrFail
      const queriedPokemon = await em.findOne(
        PokemonEntity,
        {
          name: {
            // using $ilike here just to have it case-insensitive
            $ilike: name,
          },
        },
        {
          populate: [
            'fastAttacks',
            'specialAttacks',
            'types',
            'resistantTypes',
            'weaknessesTypes',
            'evolutions',
            'previousEvolutions',
          ],
        }
      )
      return { data: queriedPokemon }
    }
  )

  app.get(
    '/types',
    {
      schema: {
        response: {
          200: {
            data: Type.Array(TypeResistant()),
          },
        },
      },
    },
    async (request) => {
      const { em } = request
      // it could be a good idea to use findOneOrFail
      const queriedResistants = await em.findAll(ResistantEntity)
      console.log('queriedResistants', queriedResistants)
      return { data: queriedResistants }
    }
  )
}
