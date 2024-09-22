import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** sign in */
  @HttpCode(HttpStatus.OK)
  @Post('siginin')
  signin(@Body() body: SignInDto) {
    try {
      return this.authService.signIn(body.email, body.password);
    } catch (err) {
      throw new Error(err);
    }
  }
}
