import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';

@Controller('seeds')
export class SeedsController {
  constructor(private readonly seedsService: SeedsService) {}

  @Post()
  create(@Body(new ValidationPipe()) createSeedDto: CreateSeedDto) {
    try {
      return this.seedsService.create(createSeedDto);
    } catch (error) {
      throw new error(error);
    }
  }

  /** all seeds */
  @Get()
  findAll() {
    try {
      return this.seedsService.findAll();
    } catch (error) {
      throw new Error(error);
    }
  }

  /** all seeds in stock */
  @Get('in-stock')
  findAllInStock() {
    try {
      return this.seedsService.findAllInStock();
    } catch (error) {
      throw new Error(error);
    }
  }

  /** all seeds out of stock */
  @Get('out-of-stock')
  findAllOutOfStock() {
    try {
      return this.seedsService.findAllOutOfStock();
    } catch (error) {
      throw new Error(error);
    }
  }

  // GET http://localhost:4000/seeds/find?name=seedA&type=in-house
  @Get('by-name-and-type')
  findSeedByNameAndType(
    @Query('name') name: string,
    @Query('type') type: string,
  ) {
    try {
      return this.seedsService.findSeedByNameAndType(name, type);
    } catch (error) {
      throw new Error(error);
    }
  }

  // GET http://localhost:4000/seeds/find?name=seedA&type=in-house
  @Get('available-by-name-and-type')
  findAvaibleSeedByNameAndType(
    @Query('name') name: string,
    @Query('type') type: string,
  ) {
    try {
      return this.seedsService.findSeedByNameAndType(name, type);
    } catch (error) {
      throw new Error(error);
    }
  }

  // GET http://localhost:4000/seeds/find?type=in-house
  @Get('by-type')
  findSeedByType(@Query('type') type: string) {
    try {
      return this.seedsService.findSeedByType(type);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('available-by-type')
  findAvailableSeedsByType(@Query('type') type: string) {
    try {
      return this.seedsService.findAvailableSeedsByType(type);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.seedsService.findOne(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  /** seeds/id/stock */
  @Patch(':id/stock')
  updateSeedStock(@Param('id') id: string, @Body() newStock: number) {
    try {
      return this.seedsService.updateSeedStock(id, newStock);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeedDto: UpdateSeedDto) {
    try {
      return this.seedsService.update(id, updateSeedDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.seedsService.remove(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
