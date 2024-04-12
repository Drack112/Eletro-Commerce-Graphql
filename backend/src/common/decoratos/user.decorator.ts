import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserFromRequest } from '../types/http.types';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    let request;

    switch (context.getType() as string) {
      case 'http':
        request = context.switchToHttp().getRequest;
        break;
      case 'graphql':
        request = GqlExecutionContext.create(context).getContext().req;
        break;
      case 'rpc':
        throw new HttpException(
          'Not implemented',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      default:
        throw new HttpException(
          'Not implemented',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    const user: UserFromRequest = request?.user;
    return user;
  },
);
