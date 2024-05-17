import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // In our use case with passport-local, there are no configuration options, so our constructor simply calls super(), without an options object.
    // We can pass an options object in the call to super() to customize the behavior of the passport strategy.
    // In this example, the passport-local strategy by default expects properties called username and password in the request body.
    // Pass an options object to specify different property names, for example: super({ usernameField: 'email' })
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: any, email: string, password: string): Promise<any> {
    // Typically, the only significant difference in the validate() method for each strategy is how you determine if a user exists and is valid.
    // For example, in a JWT strategy, depending on requirements, we may evaluate whether the userId carried in the decoded token matches
    // a record in our user database, or matches a list of revoked tokens.
    try {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      console.log('🚀 ~ LocalStrategy ~ validate ~ error:', error);
    }
  }
}
