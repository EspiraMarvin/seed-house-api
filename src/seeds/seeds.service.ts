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
        germination_period: dto.germination_period,
        price: dto.price,
        stock: dto.stock,
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
    return this.prisma.seed.findMany({
      orderBy: { created_at: 'desc' },
    });
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
      orderBy: { created_at: 'desc' },
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
      orderBy: { created_at: 'desc' },
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
    const seed = await this.prisma.seed.findUnique({
      where: { uuid: seedId },
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

    // get previous stock
    const previousStock = seed.stock;
    // Calculate the difference in stock added
    const stockDifference = newStock['stock'] - previousStock;

    const lastStockHistory = await this.prisma.seedStockHistory.findFirst({
      where: { seed_id: seedId },
      orderBy: { created_at: 'desc' },
    });
    // Calculate the cumulative total stock added
    const totalStockAdded =
      (lastStockHistory?.total_stock_added || 0) + Math.max(0, stockDifference);

    // Update the stock in the Seed table
    const updatedSeed = await this.prisma.seed.update({
      where: { uuid: seedId },
      data: { stock: newStock['stock'] },
    });

    // Create an entry in the SeedStockHistory table to keep track
    await this.prisma.seedStockHistory.create({
      data: {
        seed_id: seedId,
        previous_stock: previousStock,
        new_stock: newStock['stock'],
        stock_difference: Number(stockDifference),
        total_stock_added: totalStockAdded,
      },
    });

    return updatedSeed;
  }

  //  list seed stock history
  async listSeedStockHistory() {
    const stockHistory = await this.prisma.seedStockHistory.findMany({
      include: {
        seed: true,
      },
    });
    return stockHistory;
  }

  // update seed details
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
