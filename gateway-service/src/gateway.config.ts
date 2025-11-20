import {composeConfig} from './mesh-config';
import { defineConfig } from '@graphql-hive/gateway'
import { getComposedSchemaFromConfig } from '@graphql-mesh/compose-cli';
import { DefaultLogger } from '@graphql-mesh/utils';

import localforage from 'localforage';
import { createGatewayRuntime } from '@graphql-hive/gateway';
import { useResponseCache } from '@graphql-yoga/plugin-response-cache';


const cache = localforage.createInstance({
    name: 'hive-cache'
  });

export const gatewayConfig = async () => {
    const logger = new DefaultLogger('Gateway');
    const supergraphSdl = await getComposedSchemaFromConfig(composeConfig, logger);
    return  defineConfig({
          upstreamRetry: {
            maxRetries: 5,
          },
        supergraph: () => supergraphSdl,
    });

}


