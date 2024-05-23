import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomInternalServerErrorException extends HttpException {
  constructor(message?: string) {
    super(message || 'Interval server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
