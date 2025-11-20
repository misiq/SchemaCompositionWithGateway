import { createFilterTransform, createPrefixTransform, defineConfig, loadGraphQLHTTPSubgraph } from '@graphql-mesh/compose-cli';
const yogaEndpoint = process.env.YOGA_SERVICE_URL || 'http://localhost:4000/graphql';


if (!process.env.CMS_GRAPHQL_URL) {
    throw new Error('CMS_GRAPHQL_URL environment variable is not set');
}

export const composeConfig = defineConfig({
    subgraphs: [
      {
        sourceHandler: loadGraphQLHTTPSubgraph('CMS', {
          //Example graphql endpoint can be other CMS with GraphQL API
          endpoint: process.env.CMS_GRAPHQL_URL
        }),
        transforms: [
          createFilterTransform({
              rootFieldFilter(typeName, fieldName) {
                  if ( fieldName === 'dthStbs') {
                      return true;
                  }
                  return false;
              },
          }),createPrefixTransform({
            value: 'WP_',
            includeRootOperations: true
          })
        ]
      },
      {
        sourceHandler: loadGraphQLHTTPSubgraph('Yoga', {
          endpoint: yogaEndpoint,
          operationHeaders: {
            Authorization: "{context.headers['authorization']}"
          }
        }),
        transforms: [
            createPrefixTransform({
                value: 'BFF_',
                includeRootOperations: true
            })
        ]
      }
    ]
  });