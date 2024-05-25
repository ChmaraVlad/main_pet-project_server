import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomBadRequestException extends HttpException {
  constructor(message?: string) {
    super(message || 'Bad request', HttpStatus.BAD_REQUEST);
  }
}
