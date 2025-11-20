import { GraphQLContext } from '../types/context';

export const bffResolvers = {
    Query: {
        rekoOffer: async (_: unknown, { process_type }: { process_type: string }, { dataSources }: GraphQLContext ) => {
            return  dataSources.bffDataSource.getRekoOffer(process_type);
        }
    }
}