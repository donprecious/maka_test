import { ResultType } from "@/common/model/response.model";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    this.handleCatch(exception, host);
    // super.catch(exception, host);
  }

  handleCatch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error = exception as Error;
    const response = ResultType.Failed<unknown>(null, "", error.message);

    httpAdapter.reply(ctx.getResponse(), response, httpStatus);
  }
}
