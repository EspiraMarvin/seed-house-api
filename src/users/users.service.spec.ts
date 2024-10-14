import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(), // Mock Prisma findMany function
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ConfigService,
        {
          provide: PrismaService, // Provide the mock PrismaService
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should return an array of users', async () => {
  //   // const users = [
  //   //   { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  //   //   { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
  //   // ];
  //   jest.spyOn(service, 'findAll');
  //   service.findAll();
  //   expect(service.findAll).toHaveBeenCalled();
  // });

  // it('should find one user', async () => {
  //   jest.spyOn(service, 'findOne');
  //   service.findOne('123');
  //   expect(service.findOne).toHaveBeenCalled();
  // });
});
