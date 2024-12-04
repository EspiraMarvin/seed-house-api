import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  deletePwdFromResponse,
  generateRandomPassword,
} from '../utils/helpers';
import { Role } from '@prisma/client';

/*
type UserWithoutPassword = Omit<User, 'password'>;

interface UserResponse {
  user: UserWithoutPassword;
  password: string;
}
interface UserCreated {
  message: string;
  data: UserResponse;
}
*/

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<any> {
    const userExists = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `User with ${dto.email} email already exists`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    /** randomly generated user password */
    const randomPwd = generateRandomPassword();
    console.log('randomPwd', randomPwd);

    // hash password
    const hashedPassword = await hash(randomPwd.toString(), 10);
    const newUser = await this.prisma.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        phone_number: dto.phone_number,
        role: Role[dto.role.toUpperCase()],
        password: hashedPassword,
      },
    });

    const deletedUserPwd = deletePwdFromResponse(newUser);

    //TODO: SEND NEWLY CREATED USERS EMAIL/SMS  TO RESET PWDS
    // return res;
    return {
      message: 'User created',
      data: { user: deletedUserPwd, password: randomPwd },
    };
  }

  async getProfileDetails(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { uuid: id },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => deletePwdFromResponse(user));
  }

  // find one by uuid
  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { uuid: id },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return deletePwdFromResponse(user);
  }

  async update(id: string, data) {
    const user = await this.prisma.user.findFirst({
      where: { uuid: id },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (data.role) {
      data.role = Role[data.role.toUpperCase()];
    }

    const updatedUser = this.prisma.user.update({
      where: { uuid: id }, // Update based on user ID
      data, // Fields to update
    });

    return deletePwdFromResponse(updatedUser);
  }

  /**
   * delete
   * @param id
   */
  async remove(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { uuid: id },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const deleteUser = await this.prisma.user.delete({
      where: { uuid: id },
    });

    return deletePwdFromResponse(deleteUser);
  }
}
