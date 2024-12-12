import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** sign in */
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() body: SignInDto) {
    try {
      return this.authService.signIn({
        phone_number: body.phone_number,
        password: body.password,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * sign up
   */
  @Post('signup') //status code 201
  signup(@Body(new ValidationPipe()) dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  /**
   * forgot password, sent OTP to number, confirm OTP and send new password to use and reset
   */
  @Post('forgot-password')
  update(@Body() recipient: { phone_number: string }) {
    try {
      return this.authService.forgotPassword(recipient);
    } catch (error) {
      throw new Error(error);
    }
  }
}
