import { Controller, Request, Post, UseGuards, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

// guards
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-token-jwt-auth.guard';

// exceptions custom
import { CustomInternalServerErrorException } from 'src/exceptions/CustomInternalServerErrorException';
import { CustomUnauthorizedException } from 'src/exceptions/CustomUnauthorizedException';

@ApiTags('Авторизация')
@Controller('/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // With @UseGuards(AuthGuard('local')) we are using an AuthGuard that @nestjs/passportautomatically provisioned for us
  // when we extended the passport-local strategy. Let's break that down. Our Passport local strategy has a default name of 'local'.
  // We reference that name in the @UseGuards() decorator to associate it with code supplied by the passport-local package.
  // This is used to disambiguate which strategy to invoke in case we have multiple Passport strategies in our app
  // (each of which may provision a strategy-specific AuthGuard). While we only have one such strategy so far,
  // we'll shortly add a second, so this is needed for disambiguation.
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    try {
      // Passport automatically creates a user object, based on the value we return from the validate() method,
      // and assigns it to the Request object as req.user. Later, we'll replace this with code to create and return a JWT instead
      const accessToken = await this.authService.generateJwtAccessToken(
        req.user,
      );
      const refreshToken = await this.authService.generateRefreshToken(
        req.user,
      );

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 5 * 60 * 1000, //5min
      });
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, //24hr
      });
      const user = await this.authService.getUserData(req.user);
      const { password, ...dataWithoutPassword } = user;

      res.send({ user: dataWithoutPassword });
    } catch (error) {
      console.log('🚀 ~ AuthController ~ login ~ error:', error);
      throw new CustomInternalServerErrorException();
    }
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Get('/refresh')
  async regenerateTokens(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const incomingRefreshToken = req.cookies['refresh_token'];
      if (!incomingRefreshToken) {
        throw new CustomUnauthorizedException(
          'Controller Incoming RefreshToken is not found',
        );
      }

      const decodedToken =
        await this.authService.getInfoFromIncomingRefreshToken(
          incomingRefreshToken,
        );
      if (decodedToken) {
        const accessToken = await this.authService.generateJwtAccessToken(
          decodedToken.user,
        );
        const refreshToken = await this.authService.generateRefreshToken(
          decodedToken.user,
        );

        res.cookie('access_token', accessToken, {
          httpOnly: true,
          maxAge: 10 * 1000,
        });
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        // Passport automatically creates a user object, based on the value we return from the validate() method,
        // and assigns it to the Request object as req.user. Later, we'll replace this with code to create and return a JWT instead
        res.send({ user: decodedToken.user });
      }
    } catch (error) {
      console.log('🚀 ~ AuthController ~ error:', error);
      throw new CustomInternalServerErrorException();
    }
  }
}
