import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  // With @UseGuards(AuthGuard('local')) we are using an AuthGuard that @nestjs/passportautomatically provisioned for us
  // when we extended the passport-local strategy. Let's break that down. Our Passport local strategy has a default name of 'local'.
  // We reference that name in the @UseGuards() decorator to associate it with code supplied by the passport-local package.
  // This is used to disambiguate which strategy to invoke in case we have multiple Passport strategies in our app
  // (each of which may provision a strategy-specific AuthGuard). While we only have one such strategy so far,
  // we'll shortly add a second, so this is needed for disambiguation.
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user. Later, we'll replace this with code to create and return a JWT instead
    return this.authService.login(req.user);
  }
}
