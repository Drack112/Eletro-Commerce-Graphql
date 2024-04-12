import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';

import { sessionConfig } from './common/config/session.config';
import { envConfig } from './common/config/env.config';
import { AllExceptionsFilter } from './common/exceptions-filters/all-exceptions.filter';
import { AppModule } from './app.module';

import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as session from 'express-session';
import * as passport from 'passport';

import helmet from 'helmet';
import RateLimit from 'express-rate-limit';

async function bootstrap() {
  const env = envConfig();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      env.mode === 'development'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['error', 'warn'],
  });
  const port = env.port;

  // Handle errors
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      validationError: {
        target: false,
      },
    }),
  );

  // Custom exceptions filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Allow inject dependency injection in  validator
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

  if (env.mode === 'production') {
    app.set('trust proxy', 1); // trust first cookie
    app
      .use(compression())
      .use(helmet())
      .use(
        RateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100, // limit each IP to 100 requests per windowMs
        }),
      );

    // Enable cors middleware
    app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', env.clientUrl); // update to match the domain you will make the request from
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
      );
      res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,PATCH,DELETE, OPTIONS',
      );
      res.header('Access-Control-Allow-Credentials', true);
      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      }
      next();
    });

    // Disable console.log() in production
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.log = function () {};
  }

  // Session
  const sessionOptions = sessionConfig();
  app.use(session(sessionOptions));

  // Init passport
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port, () => {
    console.log(`Server is running at ${env.serverUrl}/graphql`);
  });
}
bootstrap();
