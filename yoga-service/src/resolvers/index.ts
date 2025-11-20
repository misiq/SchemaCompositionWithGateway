import { bffResolvers } from './bff.resolver';  

export const resolvers = {
    Query: {
        ...bffResolvers.Query
    }
}