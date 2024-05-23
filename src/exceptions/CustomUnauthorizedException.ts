import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomUnauthorizedException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'You are not authorized',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
