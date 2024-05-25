import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomInternalServerErrorException } from 'src/exceptions/CustomInternalServerErrorException';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.log('🚀 ~ DatabaseService ~ onModuleInit ~ error:', error);
      throw new CustomInternalServerErrorException(
        'Error connection to databse',
      );
    }
  }
}
