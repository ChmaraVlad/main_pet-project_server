import { Controller, Request, Post, UseGuards, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

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
  async login(@Request() req, @Res() res: Response) {
    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user. Later, we'll replace this with code to create and return a JWT instead
    const accessToken = await this.authService.generateJwtAccessToken(req.user);
    const refreshToken = await this.authService.generateRefreshToken(req.user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 2 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log('--------', res.getHeaders());
    const user = await this.authService.getUserData(req.user);
    console.log('🚀 ~ AuthController ~ login ~ user:', user);
    res.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-token')
  async regenerateTokens(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user. Later, we'll replace this with code to create and return a JWT instead
    const accessToken = await this.authService.generateJwtAccessToken(req.user);
    const refreshToken = await this.authService.generateRefreshToken(req.user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 2 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send({ msg: 'success' });
  }
}
