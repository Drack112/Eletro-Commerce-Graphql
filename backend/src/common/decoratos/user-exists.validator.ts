import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { User, emailRegex } from 'src/modules/users/user.schema';
import { UserService } from 'src/modules/users/user.service';

@ValidatorConstraint({ name: 'user', async: true })
@Injectable()
export class UserExitsValidator implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  public async validate(
    usernameOrEmail: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args: ValidationArguments,
  ): Promise<boolean> {
    const isEmail = emailRegex.test(usernameOrEmail);
    let user: User | null;
    if (isEmail) {
      user = await this.userService.findOne({ email: usernameOrEmail });
    } else {
      user = await this.userService.findOne({ username: usernameOrEmail });
    }
    if (!user) return true;
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'User with $property $value already exists';
  }
}
