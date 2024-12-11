import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SmsService } from '../sms/sms.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, SmsService],
})
export class UsersModule {}
