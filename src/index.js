import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import morgan from 'morgan'
import { typeDefs, resolvers, schemaDirectives, context } from './schema'
import config from './config'
import './firebase.js'

// create Express server
const app = express()
app.use(express.json())
app.use(cors())
app.enable('trust proxy')

// enable logging
app.use(morgan('combined'))

// create healthcheck
app.get('/', async (req, res) => {
  res.send('true')
})

// create GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  context,
})
server.applyMiddleware({ app })

app.listen(config.port, () => {
  console.log(`[API] 🚀 api started at port: ${config.port}`)
})
