import { createYoga } from 'graphql-yoga'
import { createSchema } from 'graphql-yoga'
import { EnvelopArmor } from '@escape.tech/graphql-armor';
import { env } from './config/env';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';
import { BFFDataSource } from './datasources/bff.datasource';
import { formatError } from './utils/errors';
import { logger } from './utils/logger';
import { GraphQLContext } from './types/context';

// Security configuration
const armor = new EnvelopArmor({
  maxDepth: {n: 6},
  costLimit: {maxCost: 5000},
})

const protectedYoga = armor.protect();

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga<GraphQLContext>({
  schema,
  context: async ({ request }) => {
    // Extract auth token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const authToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader || undefined;

    logger.debug({ hasAuth: !!authToken }, 'Creating GraphQL context');

    return {
      request,
      authToken,
      dataSources: {
        bffDataSource: new BFFDataSource(env.REST_API_URL, authToken),
      },
    };
  },
  maskedErrors: env.NODE_ENV === 'production',

  plugins: [
    ...protectedYoga.plugins
  ],
  graphiql: true,
  landingPage: false,
  logging: {
    debug: (...args) => logger.debug(args),
    info: (...args) => logger.info(args),
    warn: (...args) => logger.warn(args),
    error: (...args) => logger.error(args),
  },
})

const server = Bun.serve({
  port: process.env.PORT || 4000,
  fetch: (req) => yoga.fetch(req),
})

logger.info(`🚀 Server is running on ${server.url}`)
logger.info(`📊 GraphiQL available at ${server.url}graphql`)