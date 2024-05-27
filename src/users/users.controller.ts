import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

// guards
import { AccessJwtAuthGuard } from 'src/auth/guards/access-token-jwt-auth.guard';

// services
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';

// exceptions
import { CustomInternalServerErrorException } from 'src/exceptions/CustomInternalServerErrorException';
import { CustomUnauthorizedException } from 'src/exceptions/CustomUnauthorizedException';
import { CreateUserDto } from './dto/CreateUserDto';
import { CustomBadRequestException } from 'src/exceptions/CustomBadRequestException';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private authService: AuthService,
    private usersServices: UsersService,
  ) {}

  @UseGuards(AccessJwtAuthGuard)
  @Get('/info')
  async user(@Request() req) {
    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user. Later, we'll replace this with code to create and return a JWT instead
    try {
      const user = await this.usersServices.findOne(req.user.email);
      if (user) {
        return { user };
      } else {
        throw new CustomBadRequestException('User is not defined');
      }
    } catch (error) {
      console.log('🚀 ~ UserController ~ user ~ error:', error);
      throw new CustomInternalServerErrorException();
    }
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('/admin')
  async admin(@Request() req) {
    try {
      // Passport automatically creates a user object, based on the value we return from the validate() method,
      // and assigns it to the Request object as req.user. Later, we'll replace this with code to create and return a JWT instead
      const isAdmin = await this.usersServices.isAdmin(req.user);

      if (isAdmin) {
        return { user: req.user };
      }

      throw new CustomUnauthorizedException("You don't have Admin permissions");
    } catch (error) {
      console.log('🚀 ~ UserController ~ admin ~ error:', error);
      throw new CustomInternalServerErrorException();
    }
  }

  @Post('/create')
  @ApiBody({ type: [CreateUserDto] })
  async createUser(@Body() createUserDto: CreateUserDto) {
    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user. Later, we'll replace this with code to create and return a JWT instead
    try {
      const user = await this.usersServices.createNewUser(createUserDto);
      return { user };
    } catch (error) {
      console.log('🚀 ~ UserController ~ user ~ error:', error);
      throw new CustomInternalServerErrorException();
    }
  }
}
