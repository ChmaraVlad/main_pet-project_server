import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule)],
})
export class UsersModule {}
