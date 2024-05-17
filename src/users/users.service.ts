import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/auth/dto/userDto';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {}
  private readonly users = [
    {
      userId: 1,
      email: 'john@email.com',
      username: 'john',
      password: 'password',
      roles: ['USER'],
    },
    {
      userId: 2,
      email: 'admin@email.com',
      username: 'admin',
      password: 'password',
      roles: ['ADMIN', 'USER'],
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      throw new Error('User is not defined');
    }
    return user;
  }

  async isAdmin(user: UserDto): Promise<User | undefined> {
    const userData = await this.findOne(user.email);
    const adminRole = this.configService.get<string>('ADMIN');
    const isAdmin = userData.roles.includes(adminRole);

    return isAdmin;
  }
}
