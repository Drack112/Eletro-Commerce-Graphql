import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { AuthService } from './services/auth.service';
import { UserService } from '../users/user.service';
import { RegisterUserInput } from './dto/register-user.input';
import { TokenResponse } from './dto/token-response.object-type';
import { AuthToken, AuthTokenResponse } from './dto/auth-token.object-types';
import { HttpContext, UserFromRequest } from 'src/common/types/http.types';
import { BadRequestException } from '@nestjs/common';
import { User } from '../users/user.schema';
import { LoginUserInput } from './dto/login-user.input';
import { UserResponse } from './dto/user-response.object-types';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => TokenResponse)
  public async register(@Args('input') input: RegisterUserInput) {
    const token = await this.authService.register(input);
    return { token };
  }

  @Mutation(() => AuthTokenResponse)
  public async activate(
    @Args('token') token: string,
    @Context() { req }: HttpContext,
  ) {
    const user: User = await this.authService.activateAccount(token);
    if (!user) throw new BadRequestException('Token is not valid');

    req.user = user;
    const authToken: AuthToken = await this.authService.generateAuthToken({
      user,
    });
    req.session.authToken = authToken;
    return { authToken, user };
  }

  @Mutation(() => AuthTokenResponse)
  public async login(
    @Args('input') input: LoginUserInput,
    @Context() { req }: HttpContext,
  ) {
    const user = await this.authService.validateUser(input);
    if (!user) throw new BadRequestException('Invalid credentials');

    const authToken = await this.authService.generateAuthToken({ user });

    await this.authService.resetCurrentHashedRefreshToken(
      user._id,
      authToken.refreshToken,
    );

    req.user = user;
    req.session.authToken = authToken;
    return { authToken, user };
  }

  @Query(() => UserResponse)
  public async me(@Context() { req }: HttpContext) {
    const accessToken = req.session?.authToken?.accessToken;
    if (!accessToken) return { user: null };

    const userJwt: UserFromRequest =
      await this.authService.getUserFromToken(accessToken);
    if (!userJwt) return { user: null };

    const realUser: User = await this.userService.findById(userJwt._id);
    if (!realUser) return { user: null };
    return { user: realUser };
  }
}
