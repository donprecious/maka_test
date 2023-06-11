import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { AppClientException, AppServerException } from './app.exceptions';

type Exceptions = HttpException | AppClientException | AppServerException;

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: Exceptions, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const mapped = this.mapExceptionToHttpError(exception);
      return super.catch(mapped, host);
    }
    return super.catch(exception, host);
  }

  private mapExceptionToHttpError(exception: Exceptions) {
    if (
      exception instanceof AppClientException ||
      exception instanceof AppServerException
    ) {
      this.logException(exception);

      return new BadRequestException(
        { code: exception.code, message: exception.message },
        exception.message,
      );
    } else {
      return exception;
    }
  }

  private logException(exception: Exceptions) {
    if (
      (exception instanceof HttpException && exception.getStatus() < 500) ||
      exception instanceof AppClientException
    ) {
      this.logger.error(
        `ClientException: ${exception?.constructor?.name}\n${JSON.stringify({
          exception,
        })}`,
      );
    } else {
      this.logger.error(
        `ServerException: ${exception?.constructor?.name}\n${JSON.stringify({
          exception,
          stack: exception.stack,
        })}`,
      );
    }
  }
}
