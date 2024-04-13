import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/modules/users/user.schema';

export const Roles = (...roles: Array<RoleType>) => SetMetadata('roles', roles);
