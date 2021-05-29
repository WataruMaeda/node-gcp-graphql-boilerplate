import fs from 'fs'
import { join } from 'path'
import Users from './store'

export const schema = [
  fs.readFileSync(join(__dirname, 'schema.graphql'), 'utf-8'),
]

export const resolvers = {
  Query: {
    demo: (root, args) => Users.getDemo(),
    me: (root, args, context) => Users.getMe(context),
  },

  Mutation: {
    updateMe: (root, { input }, context) => Users.updateMe(input, context),
    createUser: (root, { input }, context) => Users.createUser(input, context),
  },
}
