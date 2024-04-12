import { Logger } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { envConfig } from 'src/common/config/env.config';

export const createConnection = async (): Promise<Connection> => {
  const env = envConfig();

  const mongoClient = await mongoose.connect(env.mongoDBUrl, {
    autoIndex: false,
  });

  Logger.log('Database connected');
  return mongoClient.connection;
};
