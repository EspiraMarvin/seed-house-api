import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OrderService } from '../order/order.service';

@Injectable()
export class TaskSchedulerService {
  constructor(private orderService: OrderService) {}
  private readonly logger = new Logger(TaskSchedulerService.name);

  @Cron('0 7 * * *') // Cron syntax for 7:00 AM every day
  async sendSeedCollectionReminders() {
    const orders = await this.orderService.getOrdersForTomorrow();
    console.log('ORDERSSS', orders);

    // for (const order of orders) {
    //   const message = `Hello ${order.first_name}, this is a reminder that your order will be ready for collection tomorrow.`;
    //   await this.smsService.sendSms(order.phoneNumber, message);
    //   console.log(
    // `Reminder sent to ${order.customerName} at ${order.phoneNumber}`,
    //   );
    // }
    console.log(
      'sendSeedCollectionReminders RUN will when the second is 45 seconds',
    );
  }
}
