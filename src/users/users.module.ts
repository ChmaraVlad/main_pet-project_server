import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [UsersService, DatabaseService],
  exports: [UsersService],
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule), DatabaseModule],
})
export class UsersModule {}
