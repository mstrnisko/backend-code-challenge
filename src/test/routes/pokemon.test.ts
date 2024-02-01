import { expect } from '@jest/globals'
import { buildTest } from '../buildTest'

// To showcase the testing, I will be doing following:
// - 2 tests for getting the pokemons + 1 test for getting them with filters
// - 1 test for listing the types of pokemons
// - 1 test for setting the favourite pokemon for a user + 1 test for getting
//    the favourite pokemons of a user
// - 1 test for testing the auth validation error if requesting without auth
// Of course there could be more test, but I think for the demo, it's enough
describe('pokemon endpoints', () => {
  let fastifyApp: Awaited<ReturnType<typeof buildTest>>

  beforeAll(async () => {
    fastifyApp = await buildTest()
  })

  afterAll(async () => {
    await fastifyApp.close()
  })

  describe('get pokemons', () => {
    it('should return first 5 pokemons in correct order', async () => {
      const response = await fastifyApp.inject({
        url: '/pokemon?limit=5&offset=0',
      })
      const data: { data: any[] } = response.json()
      expect(response.statusCode).toEqual(200)
      expect(data.data.length).toBe(5)
      expect(data).toEqual({
        data: Array(5)
          .fill(null)
          // no need to test for other properties, since this is just a demo showcase
          .map((_, index) => expect.objectContaining({ id: index + 1 })),
      })
    })

    it('should return another 5 pokemons in correct order', async () => {
      const response = await fastifyApp.inject({
        url: '/pokemon?limit=5&offset=5',
      })
      const data: { data: any[] } = response.json()
      expect(response.statusCode).toEqual(200)
      expect(data.data.length).toBe(5)
      expect(data).toEqual({
        data: Array(5)
          .fill(null)
          // no need to test for other properties, since this is just a demo showcase
          .map((_, index) => expect.objectContaining({ id: index + 6 })),
      })
    })

    it('should return first 5 pokemons in correct order with search and types applied', async () => {
      const response = await fastifyApp.inject({
        url: '/pokemon?limit=5&name=king&type=Water',
      })
      const data: { data: any[] } = response.json()
      expect(response.statusCode).toEqual(200)
      expect(data.data.length).toBe(2)
      expect(data).toEqual({
        data: [
          expect.objectContaining({ name: 'Kingler' }),
          expect.objectContaining({ name: 'Seaking' }),
        ],
      })
    })
  })

  describe('get types', () => {
    it('should get all pokemon types', async () => {
      const response = await fastifyApp.inject({ url: '/pokemon/types' })
      const data: { data: any[] } = response.json()
      expect(data.data.length).toBe(18)
      // I could probably check for all pokemon types, but this is enough
      expect(data.data[0]).toEqual({ name: 'Bug' })
      expect(data.data[1]).toEqual({ name: 'Dark' })
      expect(data.data[17]).toEqual({ name: 'Water' })
    })
  })

  describe('user auth with pokemons', () => {
    it(`should set user's favourite pokemon and fetch him from get pokemons`, async () => {
      const response = await fastifyApp.inject({
        url: '/pokemon/favourite/5',
        method: 'PATCH',
        headers: {
          'x-auth-token': 'first-token',
        },
      })
      const data: { success?: boolean } = response.json()
      expect(data.success).toBe(true)
      expect(response.statusCode).toBe(200)
      const pokemonResponse = await fastifyApp.inject({
        url: '/pokemon?favourite=true',
        headers: {
          'x-auth-token': 'first-token',
        },
      })
      const pokemonData: { data: any[] } = pokemonResponse.json()
      expect(pokemonData.data.length).toBe(1)
      expect(pokemonData.data[0]).toEqual(expect.objectContaining({ id: 5 }))
    })

    it('should fail with unauthorized error when setting favourite pokemon', async () => {
      const response = await fastifyApp.inject({
        url: '/pokemon/favourite/5',
        method: 'PATCH',
      })
      const data: { statusCode: number; error: string; message: string } =
        response.json()
      expect(response.statusCode).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })
})
