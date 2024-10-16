import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: string) {
    // find seed
    const seed = await this.prisma.seed.findUnique({
      where: { uuid: dto.seed_id },
    });

    console.log('SEED FOUND', seed);

    if (!seed || seed.stock < dto.quantity) {
      throw new Error('Insufficient stock');
    }

    const totalAmount = seed.price * dto.quantity;
    console.log('TOTAL AMOUNT', totalAmount);

    const data = {
      user_id: userId,
      seed_id: dto.seed_id,
      quantity: dto.quantity,
      total_amount: totalAmount,
      status: 'pending',
    };
    console.log('ORDER', data);

    // Create order
    // const order = await this.prisma.order.create({
    //   data: {
    //     user_id: userId,
    //     seed_id: dto['seed_id'],
    //     quantity: dto['quantity'],
    //     total_amount: totalAmount,
    //     status: 'pending',
    //   },
    // });
    // console.log('ORDER CREATED', order);

    // Deduct stock
    await this.prisma.seed.update({
      where: { uuid: dto.seed_id },
      data: { stock: { decrement: dto.quantity } },
    });

    // return 'This action adds a new order';
    // return order;
  }

  async placeMultipleOrders(
    seeds: { seedId: string; quantity: number }[],
    userId: string,
  ) {
    // Array to keep track of the total cost and the seed stock updates
    let totalAmount = 0;

     // Loop over each seed order and validate stock
     for (const { seedId, quantity } of seeds) {
      const seed = await this.prisma.seed.findUnique({ where: { uuid: seedId } });

      if (!seed) {
        throw new Error(`Seed with ID ${seedId} not found`);
      }

      if (seed.stock < quantity) {
        throw new Error(
          `Insufficient stock for seed ${seed.name}, available: ${seed.stock}, requested: ${quantity}`
        );
      }

         // Calculate total amount for this seed type and add to overall total
         totalAmount += seed.price * quantity;

         // Deduct stock for this seed
         await this.prisma.seed.update({
           where: { uuid: seedId },
           data: { stock: { decrement: quantity } },
         });
  }

  // async completeTransaction(orderId: string) {
  //   const order = await this.prisma.order.findUnique({
  //     where: { uuid: orderId },
  //   });
  //   if (!order) {
  //     throw new Error('Order not found');
  //   }

  //   // Create a transaction for the order
  //   const transaction = await this.prisma.transaction.create({
  //     data: {
  //       order_id: orderId,
  //       amount: order.totalAmount,
  //       status: 'completed',
  //     },
  //   });

  //   // Update the order status to completed
  //   await this.prisma.order.update({
  //     where: { uuid: orderId },
  //     data: { status: 'completed' },
  //   });

  //   return transaction;
  // }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: { seed: true, transaction: true },
    });
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
