/* eslint-disable func-names */
import {
  SchemaDirectiveVisitor,
  AuthenticationError,
} from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'

class AuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    // eslint-disable-next-line no-param-reassign
    field.resolve = async function (...args) {
      // eslint-disable-line
      const [, , context] = args
      if (!context.user) throw new AuthenticationError('Not authenticated')

      const result = await resolve.apply(this, args)

      return result
    }
  }
}

// TODO: change to dynamic role specification
class AdminDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    // eslint-disable-next-line no-param-reassign
    field.resolve = async function (...args) {
      // eslint-disable-line
      const [, , context] = args
      if (!context.user) throw new AuthenticationError('Not authenticated')

      // const user = await Auth0.getUser(context.user.id)
      // if (!['OWNER', 'ADMIN'].includes(user.role))
      //   throw new AuthenticationError('Not admin')
      const result = await resolve.apply(this, args)

      return result
    }
  }
}

export const authenticated = AuthenticatedDirective
export const admin = AdminDirective

export default {}
