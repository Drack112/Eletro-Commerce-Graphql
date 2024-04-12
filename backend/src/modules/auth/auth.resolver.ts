import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { AuthService } from './services/auth.service';
import { UserService } from '../users/user.service';
import { RegisterUserInput } from './dto/register-user.input';
import { TokenResponse } from './dto/token-response.object-type';
import { AuthToken, AuthTokenResponse } from './dto/auth-token.object-types';
import { HttpContext, UserFromRequest } from 'src/common/types/http.types';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { User } from '../users/user.schema';
import { LoginUserInput } from './dto/login-user.input';
import { UserResponse } from './dto/user-response.object-types';
import { JwtGuard } from './guards/jwt.guard';
import { SESSION_AUTH_KEY } from 'src/common/config/session.config';
import { UpdateProfileInput } from './dto/update-profile.input';
import { CurrentUser } from 'src/common/decoratos/user.decorator';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ChangePasswordInput } from './dto/change-password.input';

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

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard)
  public async logout(@Context() { req }: HttpContext) {
    try {
      req.res?.clearCookie(SESSION_AUTH_KEY);
      req.session?.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtGuard)
  @Mutation(() => UserResponse)
  public async updateProfile(
    @Args('input')
    input: UpdateProfileInput,
    @CurrentUser()
    user: User,
  ) {
    const updated = await this.authService.updateProfile(user._id, input);
    return { user: updated };
  }

  @Mutation(() => TokenResponse)
  public async forgotPassword(@Args('email') email: string) {
    const token = await this.authService.forgotPassword(email);
    return { token };
  }

  @Mutation(() => UserResponse)
  public async resetPassword(
    @Args('input') input: ResetPasswordInput,
    @Context() { req }: HttpContext,
  ) {
    try {
      const user: User = await this.authService.resetPassword(input);

      // Logout after change password
      req.res?.clearCookie(SESSION_AUTH_KEY);
      req.session?.destroy();
      return { user };
    } catch (error) {
      return { user: null, error: { message: error.message } };
    }
  }

  @Mutation(() => UserResponse)
  @UseGuards(JwtGuard)
  public async changePassword(
    @Args('input') input: ChangePasswordInput,
    @Context() { req }: HttpContext,
  ) {
    try {
      const userJwt: UserFromRequest = req.user;
      const user: User = await this.authService.changePassword(
        userJwt?._id,
        input,
      );
      req.res?.clearCookie(SESSION_AUTH_KEY);
      req.session?.destroy();
      return { user };
    } catch (error) {
      return { user: null, error: { message: error.message } };
    }
  }
}
