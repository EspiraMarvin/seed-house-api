import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetUserData } from '../auth/decorator/get-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
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
