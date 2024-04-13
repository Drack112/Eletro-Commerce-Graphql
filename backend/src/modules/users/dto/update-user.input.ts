import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { RoleType } from '../user.schema';
import { UpdateProfileInput } from 'src/modules/auth/dto/update-profile.input';

@InputType()
export class UpdateUserInput extends UpdateProfileInput {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  role?: RoleType;
}
