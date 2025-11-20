import { BFFDataSource } from "../datasources/bff.datasource";

export interface GraphQLContext {
    dataSources: {
        bffDataSource: BFFDataSource;
    };
    authToken?: string;
    request: Request;
}