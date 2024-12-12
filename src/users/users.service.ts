import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
  ) {}

  async create(dto: CreateUserDto): Promise<any> {
    const userExists = await this.prisma.user.findFirst({
      where: { phone_number: dto.phone_number },
    });

    if (userExists) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `User with phone number already exists`,
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
        phone_number: dto.phone_number,
        email: dto.email,
        role: Role[dto.role.toUpperCase()],
        password: hashedPassword,
      },
    });

    this.smsService.sendMessage({
      message: `An Account has been setup for you, with ${randomPwd} as password, login to reset the password & start shopping our seeds catalogue.`,
      recipient: newUser.phone_number,
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
    return deletePwdFromResponse(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });
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

    // prevent updating password
    if (data.password) {
      delete data.password;
    }

    const updatedUser = await this.prisma.user.update({
      where: { uuid: id }, // Update based on user uuid
      data, // fields to patch
    });
    return deletePwdFromResponse(updatedUser);
  }

  /**
   * reset new loggedin user password
   */
  async resetPassword(body, id: string) {
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

    // compare password
    const pwdMatches = await compare(
      body.old_password.toString(),
      user.password,
    );

    if (!pwdMatches) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Old password is incorrect',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(body.new_password.toString(), 10);
    const data = { password: hashedPassword };

    const updatedUserWithPwd = await this.prisma.user.update({
      where: { uuid: id }, // Update based on user uuid
      data, // fields to patch
    });

    return deletePwdFromResponse(updatedUserWithPwd);
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
