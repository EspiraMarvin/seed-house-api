import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SmsService } from '../sms/sms.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import { compare, hash } from 'bcryptjs';
import { Role, User } from '@prisma/client';
import {
  deletePwdFromResponse,
  generateRandomPassword,
} from '../utils/helpers';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private smsService: SmsService,
  ) {}

  /**
   * sigin in user
   * @param dto
   * @returns
   */
  async signIn(dto: SignInDto): Promise<any> {
    // find user by phone_number
    const user = await this.prisma.user.findUnique({
      where: {
        phone_number: dto.phone_number,
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

    const full_name = `${user.first_name} ${user.last_name}`;

    return this.signToken(
      user.uuid.toString(),
      user.phone_number,
      full_name,
      user.role,
    );
  }

  /**
   * sign in token
   * @param id
   * @param email
   * @returns
   */
  async signToken(
    id: string,
    phone_number: string,
    full_name: string,
    role: Role,
  ): Promise<{ access_token: string }> {
    const payload = { sub: id, phone_number };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: '59m',
    });

    const data = {
      access_token: token,
      phone_number: phone_number,
      user_name: full_name,
      role: role,
      uuid: id,
    };

    return data;
  }

  async signUp(dto: SignUpDto): Promise<User> {
    // check if user exists
    const exists = await this.prisma.user.findFirst({
      where: {
        phone_number: dto.phone_number,
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

    return deletePwdFromResponse(newUser);
  }

  /**
   * forgot password
   **/
  async forgotPassword(recipient) {
    //TODO: generate OTP
    const randomNum = Math.random() * 9000;
    const formattedRandomNum = Math.floor(randomNum);
    console.log(formattedRandomNum);
    //TODO: send the OTP to phone number, if OTP is okay, generate for them a password to use to reset

    // TIME TRADEOFF: just sent random password to reset password
    // security risk when updating password directly from here
    // find user by phone_number
    const user = await this.prisma.user.findUnique({
      where: {
        phone_number: recipient.phone_number,
      },
    });

    // if user doesnt exists throw exception
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Invalid phone number given',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    /** randomly generated user password */
    const randomPwd = generateRandomPassword();

    const hashedPassword = await hash(randomPwd.toString(), 10);
    const data = { password: hashedPassword };

    await this.prisma.user.update({
      where: { uuid: user.uuid }, // Update based on user uuid
      data, // fields to patch
    });

    const res = this.smsService.sendMessage({
      message: `Forgot password request was triggered, use this password ${randomPwd} to login and reset your password.`,
      recipient: recipient.phone_number,
    });

    if (res) return { message: 'Forgot password complete' };
  }
}
