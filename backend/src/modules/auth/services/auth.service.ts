import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, emailRegex } from 'src/modules/users/user.schema';
import { LoginUserInput } from '../dto/login-user.input';
import { PasswordService } from './password.service';
import { RegisterUserInput } from '../dto/register-user.input';
import { PayloadUserForJwtToken } from '../../../common/types/http.types';
import { envConfig } from 'src/common/config/env.config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/common/providers/email/email.service';
import { AuthToken } from '../dto/auth-token.object-types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private passwordService: PasswordService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(input: LoginUserInput): Promise<User> {
    const { usernameOrEmail, password } = input;

    const isEmail = emailRegex.test(usernameOrEmail);

    let user: User | null;

    if (isEmail) {
      user = await this.userModel
        .findOne({ email: usernameOrEmail })
        .select('+password')
        .lean();
    } else {
      user = await this.userModel
        .findOne({ username: usernameOrEmail })
        .select('+password')
        .lean();
    }

    if (!user) return null;

    const isMatch = await this.passwordService.verify(user.password, password);
    if (!isMatch) return null;
    return user;
  }

  public async register(input: RegisterUserInput): Promise<string> {
    const payload: PayloadUserForJwtToken = {
      user: { ...input },
    };

    const expiredTime = envConfig().jwt.jwtExpiredTime;
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: expiredTime,
    });

    await this.emailService.sendEmailConfirmation(input.email, token);

    return token;
  }

  public async activateAccount(token: string): Promise<User> {
    if (!token) return null;
    const decoded = await this.jwtService.verifyAsync(token);

    if (!decoded || !decoded?.user) return null;
    const dataRegister = decoded.user;

    const newUser = await this.userModel.create(dataRegister);
    await this.emailService.sendWelcome(newUser.email);
    return newUser;
  }

  public async generateAuthToken(
    payload: PayloadUserForJwtToken,
  ): Promise<AuthToken> {
    const envJwt = envConfig().jwt;
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: envJwt.jwtExpiredTime,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: envJwt.jwtRefreshExpiredTime,
    });

    const authToken = {
      accessToken,
      refreshToken,
    };

    return authToken;
  }

  public async resetCurrentHashedRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<User> {
    const currentHashedRefreshToken =
      await this.passwordService.hash(refreshToken);
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          currentHashedRefreshToken,
        },
        { new: true },
      )
      .lean();

    return user;
  }

  public async getUserFromToken(token: string): Promise<User | null> {
    if (!token) return null;
    const decoded = await this.jwtService.verifyAsync(token);

    const { user } = decoded;
    const realUser = await this.userModel.findOne({ email: user.email }).lean();
    if (!realUser) return null;

    return realUser;
  }
}
