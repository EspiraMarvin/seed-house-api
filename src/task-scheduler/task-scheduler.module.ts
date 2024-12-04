import { Module } from '@nestjs/common';
import { TaskSchedulerController } from './task-scheduler.controller';
import { TaskSchedulerService } from './task-scheduler.service';
import { OrderService } from '../order/order.service';

@Module({
  controllers: [TaskSchedulerController],
  providers: [TaskSchedulerService, OrderService],
})
export class TaskSchedulerModule {}
