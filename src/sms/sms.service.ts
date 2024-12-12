import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AfricasTalking from 'africastalking';

@Injectable()
export class SmsService {
  constructor(private readonly configService: ConfigService) {}

  async formatDate(date) {
    //  dd/mm/yyyy format
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  validateNumber = async (recipient: string) => {
    // Check if the first character is '0'
    if (recipient.startsWith('0')) {
      // Remove the first character and prepend +254
      recipient = '+254' + recipient.slice(1);
    }

    // If the number starts with +2540, remove the extra 0
    if (recipient.startsWith('+2540')) {
      recipient = '+254' + recipient.slice(5);
    }

    // If the number does not start with +, append + to it
    if (!recipient.startsWith('+')) {
      recipient = '+' + recipient;
    }

    // If number is valid return it as-is

    return recipient;
  };

  async sendMessage(body) {
    const credentials = {
      apiKey: this.configService.get<string>('AFRICASTALKING_API_KEY'),
      username: this.configService.get<string>('AFRICASTALKING_USERNAME'),
    };

    // const timeStamp = formatDate(new Date());
    const smsInstance = AfricasTalking(credentials);
    try {
      const number = await this.validateNumber(body.recipient);
      const result = await smsInstance.SMS.send({
        to: `${number}`,
        message: `${body.message}`,
        from: `${this.configService.get<string>('AFRICASTALKING_SHORT_CODE')}`,
      });
      return result;
    } catch (ex) {
      console.error(ex);
    }
  }
}
