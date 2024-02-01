import { TSchema, Type } from '@sinclair/typebox'
import { OtherPokemonClass } from '../entities/Pokemon.entity'

export const TypeNullable = <T extends TSchema>(schema: T) =>
  Type.Union([schema, Type.Null()])

export const TypeResistant = () =>
  Type.Object({
    name: Type.String(),
  })

export const TypePokemon = () =>
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
    types: Type.Array(TypeResistant()),
    resistantTypes: Type.Array(TypeResistant()),
    weaknessesTypes: Type.Array(TypeResistant()),
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
