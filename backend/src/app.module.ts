import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { join } from 'path';

import { envConfig } from './common/config/env.config';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: envConfig().mongoDBUrl,
        dbName: 'e-commerce',
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      playground: false,
      csrfPrevention: false,

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
    }),
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
