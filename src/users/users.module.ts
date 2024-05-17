import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [UsersService, ConfigModule],
  exports: [UsersService],
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule), ConfigModule],
})
export class UsersModule {}
