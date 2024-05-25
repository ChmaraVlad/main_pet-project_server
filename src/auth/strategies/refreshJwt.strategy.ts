import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

// exceptions
import { CustomInternalServerErrorException } from 'src/exceptions/CustomInternalServerErrorException';
import { CustomUnauthorizedException } from 'src/exceptions/CustomUnauthorizedException';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    // This strategy requires some initialization, so we do that by passing in an options object in the super() call
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.['refresh_token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_TOKEN_REFRESH'),
      passReqToCallback: true,
    });
  }

  // Passport first verifies the JWT's signature and decodes the JSON. It then invokes our validate() method
  // passing the decoded JSON as its single parameter. Based on the way JWT signing works,
  // we're guaranteed that we're receiving a valid token that we have previously signed and issued to a valid user.
  async validate(req: Request, payload: any) {
    try {
      if (!payload.user) {
        throw new CustomUnauthorizedException(
          'Strategy Refresh Jwt Use is not found',
        );
      }
      const user = { ...payload.user };

      return { user };
    } catch (error) {
      console.log('🚀 ~ validate ~ error:', error);
      throw new CustomInternalServerErrorException();
    }
  }
}
