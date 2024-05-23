import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

// exceptions
import { CustomNotFoundException } from 'src/exceptions/CustomNotFoundException';
import { CustomInternalServerErrorException } from 'src/exceptions/CustomInternalServerErrorException';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.['access_token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_TOKEN'),
    });
  }

  // Passport first verifies the JWT's signature and decodes the JSON. It then invokes our validate() method
  // passing the decoded JSON as its single parameter. Based on the way JWT signing works,
  // we're guaranteed that we're receiving a valid token that we have previously signed and issued to a valid user.
  async validate(payload) {
    try {
      if (!payload.user) {
        throw new CustomNotFoundException();
      }

      return {
        user: payload.user,
      };
    } catch (error) {
      console.log('🚀 ~ validate ~ error:', error);
      throw new CustomInternalServerErrorException();
    }
  }
}
