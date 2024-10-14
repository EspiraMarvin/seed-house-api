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
        email: body.email,
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

  // /**
  //  * update password
  //  */
  // @Patch(':email')
  // update(
  //   @Param('email') id: string,
  //   @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  // ) {
  //   try {
  //     return this.authService.updatePassword(id, updateUserDto);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
}
