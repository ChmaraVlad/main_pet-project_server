import { Injectable } from '@nestjs/common';
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
    return {
      user,
    };
  }

  async generateJwtAccessToken(user: UserDto) {
    const payload = { email: user.email, sub: user.userId };
    const token = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('SECRET_TOKEN'),
    });
    return token;
  }

  async generateRefreshToken(user: UserDto) {
    const payload = { email: user.email, sub: user.userId };
    const token = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('SECRET_TOKEN'),
    });
    return token;
  }

  async getInfoFromIncomingRefreshToken(token) {
    const decodedInfo = await this.jwtService.verify(token, {
      secret: this.configService.get<string>('SECRET_TOKEN'),
    });
    return decodedInfo;
  }
}
