import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { UserDto } from './dto/userDto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: UserDto = await this.usersService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getUserData(user: UserDto) {
    const userData: UserDto = await this.usersService.findOne(user.email);

    if (!userData) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return userData;
  }

  async generateJwtAccessToken(user: UserDto) {
    const payload = { user, sub: user.userId };
    const token = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('SECRET_TOKEN_ACCESS'),
      expiresIn: 180,
      // getting error on using number from env
      // expiresIn: this.configService.get<string>(
      //   'TOKEN_VALIDITY_DURATION_ACCESS',
      // ),
    });
    return token;
  }

  async generateRefreshToken(user: UserDto) {
    const payload = { user, sub: user.userId };

    const token = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('SECRET_TOKEN_REFRESH'),
      expiresIn: '24h',
      // getting error on using value from env
      // expiresIn: this.configService.get<string>(
      //   'TOKEN_VALIDITY_DURATION_REFRESH',
      // ),
    });

    return token;
  }

  async getInfoFromIncomingRefreshToken(token) {
    const decodedInfo = await this.jwtService.verify(token, {
      secret: this.configService.get<string>('SECRET_TOKEN_REFRESH'),
    });
    return decodedInfo;
  }
}
