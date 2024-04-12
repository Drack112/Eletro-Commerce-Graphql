import * as session from 'express-session';
import { envConfig } from './env.config';

export const SESSION_AUTH_KEY = 'SESSION_AUTH';

export function sessionConfig(): session.SessionOptions {
  const env = envConfig();
  const __prod__ = env.mode === 'production';

  return {
    name: SESSION_AUTH_KEY,
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    proxy: false,
    cookie: {
      httpOnly: true,
      secure: __prod__,
      maxAge: env.jwt.jwtRefreshExpiredTime,
      sameSite: __prod__ ? 'none' : 'lax',
      domain: __prod__ ? '' : undefined,
    },
  };
}
