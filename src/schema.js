import fs from 'fs'
import { makeExecutableSchema } from 'graphql-tools'
import GraphQLJSON from 'graphql-type-json'
import {
  schema as inputsSchema,
  resolvers as inputsResolvers,
} from 'graphql-input-types'
import * as firebase from 'firebase-admin'
import { join } from 'path'
import _ from 'lodash'

import log from './utils/log'
import { authenticated, admin } from './utils/directives'
import { schema as usersSchema, resolvers as usersResolvers } from './users'

const rootSchema = [fs.readFileSync(join(__dirname, 'schema.graphql'), 'utf-8')]

const rootResolvers = {
  Query: {},
  Mutation: {},
  JSON: GraphQLJSON,
}

export const typeDefs = [...rootSchema, ...inputsSchema, ...usersSchema]
export const resolvers = _.merge(rootResolvers, inputsResolvers, usersResolvers)

export const schemaDirectives = {
  authenticated,
  admin,
}

export const context = async ({ req }) => {
  const defaultContext = { req }

  try {
    const header = req.headers.authorization
    if (!header) return defaultContext

    const token = header.split(' ')[1]
    // If the provided ID token has the correct format, is not expired, and is
    // properly signed, the method returns the decoded ID token
    const decodedToken = await firebase.auth().verifyIdToken(token)

    return {
      ...defaultContext,
      user: decodedToken,
      req,
    }
  } catch (err) {
    log.warn(err)
    return defaultContext
  }
}

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default executableSchema
