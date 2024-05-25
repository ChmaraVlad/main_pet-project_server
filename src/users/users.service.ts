import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CustomBadRequestException } from 'src/exceptions/CustomBadRequestException';
import { CustomUnauthorizedException } from 'src/exceptions/CustomUnauthorizedException';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) {}

  async findOne(email: User['email']): Promise<User> {
    const user = await this.database.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return user;
    }
    throw new CustomBadRequestException('User is not defined');
  }

  addRoleToUserData(role = 'user', userData) {
    let copiedData;
    if (Array.isArray(userData.roles)) {
      copiedData = {
        roles: [...userData.roles],
        ...userData,
      };
      return copiedData;
    }
    copiedData = {
      roles: [role],
      ...userData,
    };

    return copiedData;
  }

  async createNewUser(userData): Promise<User> {
    if (!userData) {
      throw new CustomBadRequestException();
    }
    if (!userData.roles) {
      const data = this.addRoleToUserData('user', userData);

      const user = await this.database.user.create({
        data: {
          ...data,
        },
      });

      if (!user) {
        throw new CustomBadRequestException('User was not created ');
      }
      return user;
    }

    const user = await this.database.user.create({
      data: {
        ...userData,
      },
    });

    if (!user) {
      throw new CustomBadRequestException('User is not defined');
    }
    return user;
  }

  async isAdmin(user: User): Promise<User | undefined> {
    const userData = await this.findOne(user.email);
    const isAdmin = userData.roles.includes('admin');

    if (isAdmin) {
      return userData;
    }

    throw new CustomUnauthorizedException('You are not admin');
  }
}
