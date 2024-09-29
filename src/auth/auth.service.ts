import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {}

  async signToken(
    id: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: id, email };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: '10m',
    });

    return {
      access_token: token,
    };
  }
}
