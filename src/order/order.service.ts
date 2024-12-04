import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @param dto
   * @param userId
   * sample client request
  {
    "userId": 1,
    "seeds": [
      { "seed_id": '1, "quantity": 5 },  // Seed A
      { "seed_id": '2', "quantity": 6 },  // Seed B
      { "seed_id": '3', "quantity": 10 }  // Seed C
    ]
  }
   */
  async create(dto: CreateOrderDto, userId: string) {
    const seeds = Array.isArray(dto.seeds) ? dto.seeds : [dto.seeds];
    await this.placeOrders(seeds, userId);
  }

  /**
   *
   * @param dto place order
   * @param userId
   */
  async placeOrders(seeds, userId) {
    for (const { seed_id, quantity } of seeds) {
      // Array to keep track of the total cost and the seed stock updates
      let totalAmount = 0;

      const seed = await this.prisma.seed.findUnique({
        where: { uuid: seed_id },
      });

      if (!seed) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Seed with ID ${seed_id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
        // throw new Error(`Seed with ID ${seed_id} not found`);
      }

      /**
       * validate stock
       */
      if (seed.stock < quantity) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Insufficient stock for seed ${seed.name}, available: ${seed.stock}, requested: ${quantity}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Calculate total amount for this seed type and add to overall total
      totalAmount += seed.price * quantity;

      // Deduct stock for this seed
      await this.prisma.seed.update({
        where: { uuid: seed_id },
        data: { stock: { decrement: quantity } },
      });

      // Create a new order for the user
      const order = await this.prisma.order.create({
        data: {
          user_id: userId,
          seed_id: seed.uuid,
          quantity: quantity,
          total_amount: totalAmount,
          status: 'pending',
        },
      });
      return order;
    }
  }

  async findUserOrders(
    userId: string,
    status?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        user_id: userId,
        status: status,
        created_at: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      },
      include: { seed: true, transaction: true },
    });

    return orders;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            uuid: true,
            email: true,
            first_name: true,
            last_name: true,
            phone_number: true,
            role: true,
            is_active: true,
          },
        },
        seed: true,
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { uuid: id },
    });

    if (!order) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'order not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return order;
  }

  async update(id: string, data: UpdateOrderDto) {
    const order = await this.prisma.order.findFirst({
      where: { uuid: id },
    });

    if (!order) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'order not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedOrder = this.prisma.order.update({
      where: { uuid: id },
      data,
    });

    return updatedOrder;
  }

  async remove(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { uuid: id },
    });

    if (!order) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'order not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return order;
  }

  /**
   * gets orders for tomorrow
   * @returns
   */
  async getOrdersForTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));
    // this.prisma.transaction.create;
    // get oders for tomorrow
    // const orders = await this.prisma.order.findMany({
    //   collection_date: '',
    // });
    return this.prisma.order.findMany({
      where: {
        collection_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        user: true,
      },
    });
  }
}
