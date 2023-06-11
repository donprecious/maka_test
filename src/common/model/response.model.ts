export class BaseResponseType {
  status = "";
  success = false;
  message = "";
}

export class Ok<Type> extends BaseResponseType {
  data?: Type;
}

export class BadRequest extends BaseResponseType {
  error?: [] | string;
  errorCode?: string;
}

export class NotFound extends BaseResponseType {
  error?: [] | string;
  errorCode?: string;
}

export class ResultType<T> implements BaseResponseType, Ok<T>, BadRequest {
  data?: T;
  status = "";
  success = false;
  message = "";
  error?: [] | string;
  errorCode?: string = "";

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  static Ok<T>(
    data: T,
    message = "success",
    status = "success"
  ): ResultType<T> {
    return {
      data: data,
      message: message,
      status: status,
      success: true,
    } as ResultType<T>;
  }
  static Failed<T>(
    error: [] | string,
    errorCode = "ERROR",
    message = "failed",
    status = "failed"
  ): ResultType<T> {
    return {
      error: error,
      message: message,
      status: status,
      success: false,
      errorCode: errorCode,
    } as ResultType<T>;
  }
}
