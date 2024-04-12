import { Request, Response } from 'express';
import { RoleType, User } from 'src/modules/users/user.schema';

export interface HttpContext {
  req: Request;
  res: Response;
}

export interface UserFromRequest extends Partial<User> {
  _id?: string;
  role?: RoleType;
  email?: string;
  username?: string;
  password?: string;
  avatar?: string;
}

export interface PayloadUserForJwtToken {
  user: UserFromRequest;
}
