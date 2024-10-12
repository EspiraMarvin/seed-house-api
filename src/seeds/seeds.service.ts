import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SKU } from '@prisma/client';

@Injectable()
export class SeedsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSeedDto) {
    const seedExists = await this.prisma.seed.findFirst({
      where: {
        name: dto.name,
        type: dto.type,
      },
    });

    console.log('seed Exists', seedExists);

    if (seedExists) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Seed already exists`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newSeed = await this.prisma.seed.create({
      data: {
        name: dto.name,
        type: dto.type,
        description: dto.description,
        price: dto.price,
        sku: SKU[dto.sku],
      },
    });

    return newSeed;
  }

  async findAll() {
    return this.prisma.seed.findMany();
  }

  async findSeed(name, type) {
    const seed = await this.prisma.seed.findFirst({
      where: {
        AND: [{ name: name }, { type: type }],
      },
    });

    return seed;
  }

  async findSeedType(type) {
    const seed = await this.prisma.seed.findFirst({
      where: {
        AND: [{ type: type }],
      },
    });

    return seed;
  }

  // Get seeds based on their type
  async getAvailableSeedsByType(type) {
    return this.prisma.seed.findMany({
      where: {
        type, // Filter by the seed type
        stock: { gt: 0 }, // Only return seeds with stock > 0
      },
    });
  }

  async findOne(id: string) {
    const seed = await this.prisma.seed.findFirst({
      where: { uuid: id },
    });

    if (!seed) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'seed not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return seed;
  }

  async update(id: string, data) {
    const seed = await this.prisma.seed.findFirst({
      where: { uuid: id },
    });

    if (!seed) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'seed not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedSeed = this.prisma.seed.update({
      where: { uuid: id },
      data,
    });

    return updatedSeed;
  }

  async remove(id: string) {
    const seed = await this.prisma.seed.findFirst({
      where: { uuid: id },
    });

    if (!seed) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'seed not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return seed;
  }
}
