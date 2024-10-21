import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('complete')
  completeTransaction(@Body() orderId: string) {
    try {
      return this.transactionService.completeTransaction(orderId);
    } catch (error) {
      throw new error(error);
    }
  }

  @Get('orders/:id')
  findOrderTransactions(
    @Param('id') orderId: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      // Convert date strings to Date objects if provided
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      return this.transactionService.findOrderTransactions(
        orderId,
        status,
        start,
        end,
      );
    } catch (error) {
      throw new error(error);
    }
  }

  @Get()
  findAll() {
    try {
      return this.transactionService.findAll();
    } catch (error) {
      throw new error(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.transactionService.findOne(id);
    } catch (error) {
      throw new error(error);
    }
  }
}
