import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { UserExitsValidator } from 'src/common/decoratos/user-exists.validator';

@InputType()
export class UpdateProfileInput {
  @IsOptional()
  @Matches(/[a-zA-Z0-9_-]{2,30}/)
  @Validate(UserExitsValidator)
  @Field(() => String, { nullable: true })
  username?: string;

  @IsOptional()
  @IsEmail()
  @Validate(UserExitsValidator)
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  fullName?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  avatar?: string;
}
