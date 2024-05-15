import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { UserDto } from './dto/userDto';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
      user: {
        email: user.email,
        username: user.username,
      },
    };
  }

  async generateJwtAccessToken(user: UserDto) {
    const payload = { email: user.email, sub: user.userId };
    const token = await this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
    });
    return token;
  }

  async generateRefreshToken(user: UserDto) {
    const payload = { email: user.email, sub: user.userId };
    const token = await this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
    });
    return token;
  }

  async getInfoFromIncomingRefreshToken(token) {
    const decodedInfo = await this.jwtService.verify(token, {
      secret: jwtConstants.refreshSecret,
    });
    return decodedInfo;
  }

  // To keep our services cleanly modularized, we'll handle generating the JWT in the authService
  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user.userId };
    const accessToken = await this.jwtService.sign(payload);
    return {
      accessToken,
      user: {
        email: user.email,
        username: user.username,
      },
    };
  }
}
