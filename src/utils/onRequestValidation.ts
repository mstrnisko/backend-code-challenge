import { Loaded } from '@mikro-orm/core'
import { Type } from '@sinclair/typebox'
import { UserEntity } from '../entities/User.entity'

class AuthError extends Error {
  constructor(message?: string) {
    super(message || 'Unauthorized')
    this.name = 'AuthError'
    // ignoring since statusCode will get populated to response anyway
    // @ts-ignore
    this.statusCode = 401
  }
}

export const onRequestValidation = (
  request: { userAuth: Loaded<UserEntity> | null },
  _: unknown,
  done: () => void
) => {
  // This hook should always be executed after the shared `onRequest` hooks
  if (!request.userAuth) {
    throw new AuthError()
  }
  done()
}

export const TypeOnRequestValidation = () => ({
  401: {
    statusCode: Type.Number(),
    error: Type.String(),
    message: Type.String(),
  },
})
