import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /** complete transaction */
  async completeTransaction(body: string) {
    const order = await this.prisma.order.findUnique({
      where: { uuid: body['order_id'] },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Create a transaction for the order
    const transaction = await this.prisma.transaction.create({
      data: {
        order_id: body['order_id'],
        amount: order.total_amount,
        status: 'completed',
      },
    });

    // Update the order status to completed and
    // the collection date to the current time transaction is completed, this is open for change later
    await this.prisma.order.update({
      where: { uuid: body['order_id'] },
      data: { status: 'completed', collection_date: new Date(Date.now()) },
    });

    return transaction;
  }

  async findOrderTransactions(
    orderId: string,
    status?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const orders = await this.prisma.transaction.findMany({
      where: {
        order_id: orderId,
        status: status,
        created_at: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      },
      include: { order: true },
    });

    return orders;
  }

  async findAll() {
    return this.prisma.transaction.findMany();
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { uuid: id },
    });

    if (!transaction) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'order not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return transaction;
  }
}
