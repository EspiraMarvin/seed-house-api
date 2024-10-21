import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SKU, SEEDTYPE } from '@prisma/client';

@Injectable()
export class SeedsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSeedDto) {
    const seedExists = await this.prisma.seed.findFirst({
      where: {
        name: dto.name,
        type: SEEDTYPE[dto.type.toUpperCase()],
      },
    });

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
        type: SEEDTYPE[dto.type.toUpperCase()],
        description: dto.description,
        price: dto.price,
        sku: SKU[dto.sku.toUpperCase()],
      },
    });

    return newSeed;
  }

  /**
   *
   * @returns all seeds in stock
   */
  async findAll() {
    return this.prisma.seed.findMany();
  }

  /**
   *
   * @returns all seeds in stock
   */
  async findAllInStock() {
    return this.prisma.seed.findMany({
      where: {
        stock: { gt: 0 },
      },
    });
  }

  /**
   *
   * @returns all seeds out of stock
   */
  async findAllOutOfStock() {
    return this.prisma.seed.findMany({
      where: {
        AND: [{ stock: 0 }],
      },
    });
  }

  /**
   * returns seed by name and type
   * @param name
   * @param type
   * @returns
   */
  async findSeedByNameAndType(name, type) {
    const seed = await this.prisma.seed.findFirst({
      where: {
        AND: [{ name: name }, { type: type }],
      },
    });

    return seed;
  }

  /**
   * returns available seed by name and type
   * @param name
   * @param type
   * @returns
   */
  async findAvailableSeedByNameAndType(name, type) {
    const seed = await this.prisma.seed.findFirst({
      where: {
        stock: { gt: 0 }, // Only return seeds with stock > 0
        AND: [{ name: name }, { type: type }],
      },
    });

    return seed;
  }

  /**
   * returns seed by type
   * @param type
   * @returns
   */
  async findSeedByType(type) {
    const seed = await this.prisma.seed.findFirst({
      where: {
        AND: [{ type: type }],
      },
    });

    return seed;
  }

  // Get available seeds based on their type
  async findAvailableSeedsByType(type) {
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

  // Update seed stock
  async updateSeedStock(seedId: string, newStock: number) {
    return this.prisma.seed.update({
      where: { uuid: seedId },
      data: { stock: newStock['stock'] },
    });
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
