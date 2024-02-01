import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { FastifyPluginAsync } from 'fastify'
import { PokemonEntity } from '../../entities/Pokemon.entity'
import { ResistantEntity } from '../../entities/Resistant.entity'
import { TypePokemon, TypeResistant } from '../../types/helpers'
import {
  onRequestValidation,
  TypeOnRequestValidation,
} from '../../utils/onRequestValidation'

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
            favourite: Type.Boolean(),
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
      const {
        query: { limit, offset, type, name, favourite },
        userAuth,
      } = request
      const { em } = request
      let pokemonIds: number[] = []
      if (userAuth && favourite) {
        await userAuth.favouritePokemons.init()
        pokemonIds = userAuth.favouritePokemons.getIdentifiers()
      }
      const queriedPokemons = await em.findAll(PokemonEntity, {
        ...(limit && { limit }),
        ...(offset && { offset }),
        ...((type || name || pokemonIds.length > 0) && {
          where: {
            ...(pokemonIds.length > 0 && {
              id: {
                $in: pokemonIds,
              },
            }),
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
      const queriedResistants = await em.findAll(ResistantEntity, {
        orderBy: {
          name: 'asc',
        },
      })
      return { data: queriedResistants }
    }
  )

  app.patch(
    '/favourite/:id',
    {
      onRequest: onRequestValidation,
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        response: {
          200: {
            success: Type.Boolean(),
          },
          ...TypeOnRequestValidation(),
        },
      },
    },
    async (request) => {
      const {
        em,
        userAuth,
        params: { id },
      } = request
      const pokemonToSetAsFavourite = await em.findOneOrFail(PokemonEntity, {
        id,
      })
      await userAuth!.favouritePokemons.init()
      if (
        !userAuth!.favouritePokemons.find(
          (innerPokemon) => innerPokemon.id === id
        )
      ) {
        userAuth!.favouritePokemons.add(pokemonToSetAsFavourite)
        await em.persistAndFlush(userAuth!)
      }

      return { success: true }
    }
  )

  app.delete(
    '/favourite/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        response: {
          200: {
            success: Type.Boolean(),
          },
          ...TypeOnRequestValidation(),
        },
      },
    },
    async (request) => {
      const {
        em,
        userAuth,
        params: { id },
      } = request
      const pokemonToRemove = await em.findOneOrFail(PokemonEntity, {
        id,
      })
      await userAuth!.favouritePokemons.init()
      if (
        userAuth!.favouritePokemons.find(
          (innerPokemon) => innerPokemon.id === id
        )
      ) {
        userAuth!.favouritePokemons.remove(pokemonToRemove)
        await em.persistAndFlush(userAuth!)
      }

      return { success: true }
    }
  )
}
