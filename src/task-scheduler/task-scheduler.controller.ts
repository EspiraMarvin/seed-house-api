import { Controller } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';

@Controller('task-scheduler')
export class TaskSchedulerController {
  constructor(private readonly taskSchedulerService: TaskSchedulerService) {}

  sendSms() {
    try {
      return this.taskSchedulerService.sendSeedCollectionReminders();
    } catch (error) {
      throw new error(error);
    }
  }
}
