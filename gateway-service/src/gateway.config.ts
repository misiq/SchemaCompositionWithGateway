import {composeConfig} from './mesh-config';
import { defineConfig } from '@graphql-hive/gateway'
import { getComposedSchemaFromConfig } from '@graphql-mesh/compose-cli';
import { DefaultLogger } from '@graphql-mesh/utils';

export const gatewayConfig = async () => {
    const logger = new DefaultLogger('Gateway');
    const supergraphSdl = await getComposedSchemaFromConfig(composeConfig, logger);
    return  defineConfig({
        supergraph: () => supergraphSdl,
    });

}


