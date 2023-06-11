/* eslint-disable prettier/prettier */
import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Logger,
} from "@nestjs/common";
import { catchError, Observable, tap, throwError } from "rxjs";

export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { url, method, body } = context.switchToHttp().getRequest();

    const now = +new Date();

    return next.handle().pipe(
      catchError((error) => {
        const { status, message } = error;

        const statusBeginsWithFourOrFive = ["4", "5"].includes(`${status}`[0]);

        if (statusBeginsWithFourOrFive) {
          const delay = Date.now() - now;

          this.logger.log(
            `[${method}], status:${status}, URL:${url}, message:${message}, body:${JSON.stringify(
              body
            )} delay:${delay}ms`
          );

          return throwError(() => error);
        }
      })
    );
  }
  // }
}
