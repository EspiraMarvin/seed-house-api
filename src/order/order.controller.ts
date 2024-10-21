import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetUserData } from '../auth/decorator/get-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
// import { AdminGuard } from '../auth/guards/admin.guard';

// @UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto, @GetUserData('uuid') userId: string) {
    try {
      return this.orderService.create(dto, userId);
    } catch (error) {
      throw new error(error);
    }
  }

  @Get()
  findAll() {
    try {
      return this.orderService.findAll();
    } catch (error) {
      throw new error(error);
    }
  }

  /** GET /orders/users/:id: Returns the orders for the specified user */
  // @UseGuards(AdminGuard) /** admin role */
  @Get('users/:id')
  findUserOrders(
    @Param('id') userId: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      // Convert date strings to Date objects if provided
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      return this.orderService.findUserOrders(userId, status, start, end);
    } catch (error) {
      throw new error(error);
    }
  }

  /** GET /orders/user/: Returns the orders for the loggedin user */
  @UseGuards(AuthGuard)
  @Get('my-orders')
  findLoggedInUserOrders(
    @GetUserData('uuid') userId: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      // Convert date strings to Date objects if provided
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      return this.orderService.findUserOrders(userId, status, start, end);
    } catch (error) {
      throw new error(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.orderService.findOne(id);
    } catch (error) {
      throw new error(error);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    try {
      return this.orderService.update(id, updateOrderDto);
    } catch (error) {
      throw new error(error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.orderService.remove(id);
    } catch (error) {
      throw new error(error);
    }
  }
}
