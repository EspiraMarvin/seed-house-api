import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const verifiedTokenRes = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // const user = await
      const user = await this.prisma.user.findFirst({
        where: {
          id: verifiedTokenRes.sub,
        },
      });
      if (!user)
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
