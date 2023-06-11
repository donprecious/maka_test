import { HttpStatus } from '@nestjs/common';

export class AppClientException extends Error {
  readonly code: string | HttpStatus;
  constructor(code: string | HttpStatus, message: string) {
    super(message);
    this.name = 'AppClientException';
    this.code = code;
  }
}

export class AppServerException extends Error {
  readonly code: string | HttpStatus;
  constructor(code: string | HttpStatus, message: string) {
    super(message);
    this.name = 'AppServerException';
    this.code = code;
  }
}
