import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../users/user.schema';
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from 'src/common/config/env.config';
import { AuthService } from './services/auth.service';
import { AuthResolver } from './auth.resolver';
import { PasswordService } from './services/password.service';
import { EmailModule } from 'src/common/providers/email/email.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
    JwtModule.register({
      secret: envConfig().jwt.jwtSecret,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EmailModule,
    UserModule,
  ],
  providers: [
    AuthService,
    PasswordService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    AuthResolver,
  ],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
