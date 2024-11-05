import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AfricasTalking from 'africastalking';

@Injectable()
export class SmsService {
  constructor(private readonly configService: ConfigService) {}

  async sendMessage(body) {
    console.log('SEND MESSAGE MESSAGE', body);
    const credentials = {
      apiKey: this.configService.get<string>('AFRICASTALKING_API_KEY'),
      username: this.configService.get<string>('AFRICASTALKING_USERNAME'),
    };

    const timeStamp = new Date();
    const smsInstance = AfricasTalking(credentials);
    console.log('smsm InarND3', smsInstance);
    try {
      const result = await smsInstance.SMS.send({
        to: '+254791425789',
        message: `${body.message}, at ${timeStamp}`,
        from: `${this.configService.get<string>('AFRICASTALKING_SHORT_CODE')}`,
      });
      console.log('SEND SMS RESULT', result);
    } catch (ex) {
      console.error(ex);
    }
  }
}
