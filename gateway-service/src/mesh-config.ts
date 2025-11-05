import { defineConfig, loadGraphQLHTTPSubgraph } from '@graphql-mesh/compose-cli';
const yogaEndpoint = process.env.YOGA_SERVICE_URL || 'http://localhost:4000/graphql';


export const composeConfig = defineConfig({
    subgraphs: [
      {
        sourceHandler: loadGraphQLHTTPSubgraph('Countries', {
          //Example graphql endpoint can be other CMS with GraphQL API
          endpoint: 'https://countries.trevorblades.com/graphql'
        })
      },
      {
        sourceHandler: loadGraphQLHTTPSubgraph('Yoga', {
          endpoint: yogaEndpoint
        })
      }
    ]
  });