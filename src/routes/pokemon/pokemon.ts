import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { OtherPokemonClass, PokemonEntity } from '../../entities/Pokemon.entity'
import { TypeNullable } from '../../types/helpers'

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
            types: Type.Array(Type.String(), { default: [] }),
            name: Type.String(),
          })
        ),
        response: {
          200: {
            data: Type.Array(
              Type.Object({
                id: Type.Number(),
                name: Type.String(),
                classification: Type.String(),
                minWeight: Type.String(),
                maxHeight: Type.String(),
                fleeRate: Type.Number(),
                evolutionRequirementAmount: TypeNullable(Type.Number()),
                evolutionRequirementName: TypeNullable(Type.String()),
                maxCP: Type.Number(),
                maxHP: Type.Number(),
                fastAttacks: Type.Array(
                  Type.Object({
                    name: Type.String(),
                    type: Type.String(),
                    damage: Type.Number(),
                  })
                ),
                specialAttacks: Type.Array(
                  Type.Object({
                    name: Type.String(),
                    type: Type.String(),
                    damage: Type.Number(),
                  })
                ),
                commonCaptureArea: TypeNullable(Type.String()),
                otherPokemonClass: TypeNullable(Type.Enum(OtherPokemonClass)),
                types: Type.Array(
                  Type.Object({
                    name: Type.String(),
                  })
                ),
                resistantTypes: Type.Array(
                  Type.Object({
                    name: Type.String(),
                  })
                ),
                weaknessesTypes: Type.Array(
                  Type.Object({
                    name: Type.String(),
                  })
                ),
                evolutions: Type.Array(
                  Type.Object({
                    name: Type.String(),
                    id: Type.Number(),
                  })
                ),
                previousEvolutions: Type.Array(
                  Type.Object({
                    name: Type.String(),
                    id: Type.Number(),
                  })
                ),
              })
            ),
          },
        },
      },
    },
    async (request: FastifyRequest) => {
      const { limit, offset, types, name } = request.query
      const { em } = request
      const queriedPokemons = await em.findAll(PokemonEntity, {
        ...(limit && { limit }),
        ...(offset && { offset }),
        ...(((Array.isArray(types) && types.length > 0) || name) && {
          where: {
            // current logic forces $in behaviour, so if we have ['Bug', 'Flying']
            // in array, it will find any match with at least one matched property
            ...(Array.isArray(types) &&
              types.length > 0 && {
                types,
              }),
            // current logic supports partial results, e.g. if searching for "saur",
            // you get Ivysaur, Bulbasaur, etc.
            ...(name && {
              name: {
                $ilike: `%${name as string}%`,
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
}
