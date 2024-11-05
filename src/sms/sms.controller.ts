import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send-sms')
  sendSms(@Body() message: string) {
    try {
      return this.smsService.sendMessage(message);
    } catch (error) {
      throw new error(error);
    }
  }
}
