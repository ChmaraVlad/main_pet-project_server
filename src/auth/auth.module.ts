import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AccessJwtStrategy } from './strategies/accessJwt.strategy';
import { RefreshJwtStrategy } from './strategies/refreshJwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    // getting troubles with such configuration
    // JwtModule.registerAsync({
    //   imports: [],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('SECRET_TOKEN'),
    //     signOptions: {
    //       expiresIn: 60,
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AccessJwtStrategy,
    RefreshJwtStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
