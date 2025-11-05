import { createYoga } from 'graphql-yoga'
import { schema } from './schema'

const yoga = createYoga({
  schema,
  graphiql: true,
  landingPage: false,
})

const server = Bun.serve({
  port: process.env.PORT || 4000,
  fetch: yoga,
})

console.info(`🚀 Server is running on ${server.url}`)
console.info(`📊 GraphiQL available at ${server.url}graphql`)