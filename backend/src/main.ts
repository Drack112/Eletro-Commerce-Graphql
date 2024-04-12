import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { envConfig } from './common/config/env.config';
import { AllExceptionsFilter } from './common/exceptions-filters/all-exceptions.filter';
import { sessionConfig } from './common/config/session.config';

import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as mongoose from 'mongoose';
import * as passport from 'passport';

async function bootstrap() {
  const env = envConfig();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      env.mode === 'development'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['error', 'warn'],
  });

  const port = env.port;

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      validationError: {
        target: true,
      },
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser(env.cookieSecret));
  app.enableCors({
    origin: env.clientUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  if (env.mode === 'development') {
    mongoose.set('debug', true);
  }

  const sessionOptions = sessionConfig();
  app.use(session(sessionOptions));

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port, () => {
    console.log(`Server is running at ${env.serverUrl}/graphql`);
  });
}
bootstrap();
