import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// guards
import { AccessJwtAuthGuard } from 'src/auth/guards/access-token-jwt-auth.guard';

// services
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';

// exceptions
import { CustomInternalServerErrorException } from 'src/exceptions/CustomInternalServerErrorException';
import { CustomUnauthorizedException } from 'src/exceptions/CustomUnauthorizedException';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private authService: AuthService,
    private usersServices: UsersService,
  ) {}

  @UseGuards(AccessJwtAuthGuard)
  @Get('/info')
  async user(@Request() req, @Res({ passthrough: true }) res) {
    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user. Later, we'll replace this with code to create and return a JWT instead
    try {
      if (req.user) {
        res.send({ user: req.user });
      }
      throw new CustomInternalServerErrorException();
    } catch (error) {
      console.log('🚀 ~ UserController ~ user ~ error:', error);
      throw new CustomInternalServerErrorException();
    }
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('/admin')
  async admin(@Request() req, @Res({ passthrough: true }) res) {
    try {
      // Passport automatically creates a user object, based on the value we return from the validate() method,
      // and assigns it to the Request object as req.user. Later, we'll replace this with code to create and return a JWT instead
      const isAdmin = await this.usersServices.isAdmin(req.user);

      if (!isAdmin) {
        throw new CustomUnauthorizedException(
          "You don't have Admin permissions",
        );
      }

      res.send({ user: req.user });
    } catch (error) {
      console.log('🚀 ~ UserController ~ admin ~ error:', error);
      throw new CustomInternalServerErrorException();
    }
  }
}
