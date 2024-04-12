import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/users/user.schema';

@ObjectType()
export class AuthToken {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}

@ObjectType()
export class AuthTokenResponse {
  @Field(() => AuthToken, { nullable: true })
  authToken?: AuthToken;

  @Field(() => User, { nullable: true })
  user?: User;
}
