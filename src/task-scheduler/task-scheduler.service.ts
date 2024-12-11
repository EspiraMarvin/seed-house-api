import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OrderService } from '../order/order.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class TaskSchedulerService {
  constructor(
    private orderService: OrderService,
    private smsService: SmsService,
  ) {}
  private readonly logger = new Logger(TaskSchedulerService.name);

  @Cron('0 7 * * *') // Cron job to run at 7:00 AM every day
  async sendSeedCollectionReminders() {
    const orders = await this.orderService.getOrdersForTomorrow();
    for (const order of orders) {
      const message = `Hello ${order.user.first_name}, this is a reminder that your order will be ready for collection tomorrow.`;
      await this.smsService.sendMessage({ messsage: message });
    }
  }
}
