import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/users/user.schema';

@ObjectType()
export class MessageError {
  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => MessageError, { nullable: true })
  error: MessageError;
}
