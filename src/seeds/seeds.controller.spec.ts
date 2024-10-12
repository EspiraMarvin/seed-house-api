import { Test, TestingModule } from '@nestjs/testing';
import { SeedsController } from './seeds.controller';
import { SeedsService } from './seeds.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('SeedsController', () => {
  let controller: SeedsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedsController],
      providers: [SeedsService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<SeedsController>(SeedsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
