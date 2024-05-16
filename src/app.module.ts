import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'config/authConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
