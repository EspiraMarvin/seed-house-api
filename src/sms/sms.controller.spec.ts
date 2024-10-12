import { Test, TestingModule } from '@nestjs/testing';
import { SmsController } from './sms.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from './sms.service';
import { ConfigService } from '@nestjs/config';

describe('SmsController', () => {
  let controller: SmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmsController],
      providers: [SmsService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<SmsController>(SmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
