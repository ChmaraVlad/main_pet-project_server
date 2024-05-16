import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    // This strategy requires some initialization, so we do that by passing in an options object in the super() call
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const refreshToken = request?.cookies['refresh_token'];
          if (!refreshToken) {
            return null;
          }
          return refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secretRefreshToken'),
    });
  }

  // Passport first verifies the JWT's signature and decodes the JSON. It then invokes our validate() method
  // passing the decoded JSON as its single parameter. Based on the way JWT signing works,
  // we're guaranteed that we're receiving a valid token that we have previously signed and issued to a valid user.
  async validate(payload) {
    const user = { id: payload.sub, email: payload.email };
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
