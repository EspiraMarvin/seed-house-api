import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import { compare, hash } from 'bcryptjs';
import { Role, User } from '@prisma/client';
import { deletePwdFromResponse } from '../utils/helpers';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * sigin in user
   * @param dto
   * @returns
   */
  async signIn(dto: SignInDto): Promise<any> {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user doesnt exists throw exception
    if (!user) throw new UnauthorizedException('Credentials Incorrect');

    // compare password
    const pwdMatches = await compare(
      dto.password ? dto.password.toString() : '',
      user.password,
    );

    if (!pwdMatches) {
      throw new UnauthorizedException('Credentials Incorrect');
    }

    return this.signToken(user.uuid.toString(), user.email, user.role);
  }

  /**
   * sign in token
   * @param id
   * @param email
   * @returns
   */
  async signToken(
    id: string,
    email: string,
    role: Role,
  ): Promise<{ access_token: string }> {
    const payload = { sub: id, email };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: '59m',
    });

    const data = {
      access_token: token,
      email: email,
      role: role,
      uuid: id,
    };

    return data;
  }

  async signUp(dto: SignUpDto): Promise<User> {
    // check if user exists
    const exists = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (exists)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `User already exists`,
        },
        HttpStatus.BAD_REQUEST,
      );

    // generate the password hash
    const hashedPassword = await hash(dto.password.toString(), 10);
    dto.password = hashedPassword;

    const newUser = await this.prisma.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        role: Role[dto.role.toUpperCase()],
        password: dto.password,
      },
    });

    return deletePwdFromResponse(newUser);
  }

  /** update password */
  // async updatePassword(email, dto) {
  //   const exists = await this.prisma.user.findFirst({
  //     where: {
  //       email: dto.email,
  //     },
  //   });
  // }
}
