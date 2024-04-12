import { GqlModuleOptions } from '@nestjs/graphql';
import { join } from 'path';

export const graphqlConfig = (): GqlModuleOptions => {
  return {
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    buildSchemaOptions: {
      numberScalarMode: 'integer',
    },

    context: ({ req, connection }) => {
      if (!connection) {
        // Http request
        return {
          token: undefined as string | undefined,
          req: req as Request,
        };
      } else {
        // USE THIS TO PROVIDE THE RIGHT CONTEXT FOR I18N
        return {
          token: undefined as string | undefined,
          req: connection.context as Request,
        };
      }
    },
  };
};
