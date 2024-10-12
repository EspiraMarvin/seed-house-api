import { Test, TestingModule } from '@nestjs/testing';
import { SeedsService } from './seeds.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('SeedsService', () => {
  let service: SeedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedsService, PrismaService, ConfigService],
    }).compile();

    service = module.get<SeedsService>(SeedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
