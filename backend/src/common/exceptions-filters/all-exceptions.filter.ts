import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    switch (host.getType() as string) {
      case 'http':
        super.catch(exception, host);
        return;
      case 'graphql':
        if (!exception.type) {
          exception.type = exception.constructor?.name || exception.message;
        }
        if (!exception.code) {
          exception.code = exception.status;
        }
        return exception;
      default:
        super.catch(exception, host);
        return;
    }
  }
}
