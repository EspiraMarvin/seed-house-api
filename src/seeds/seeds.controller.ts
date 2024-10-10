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

  @Get()
  findAll() {
    try {
      return this.seedsService.findAll();
    } catch (error) {
      throw new Error(error);
    }
  }

  // GET http://localhost:4000/seeds/find?name=seedA&type=in-house
  @Get()
  findSeed(@Query('name') name: string, @Query('type') type: string) {
    try {
      return this.seedsService.findSeed(name, type);
    } catch (error) {
      throw new Error(error);
    }
  }

  // GET http://localhost:4000/seeds/find?type=in-house
  @Get()
  findSeedType(@Query('type') type: string) {
    try {
      return this.seedsService.findSeedType(type);
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
