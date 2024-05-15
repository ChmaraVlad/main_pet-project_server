import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessJwtAuthGuard } from 'src/auth/access-token-jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private authService: AuthService) {}

  @UseGuards(AccessJwtAuthGuard)
  @Get('/info')
  async user(@Request() req, @Res({ passthrough: true }) res: Response) {
    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user. Later, we'll replace this with code to create and return a JWT instead

    return { user: req.user };
  }
}
