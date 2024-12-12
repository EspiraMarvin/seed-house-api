import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetUserPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { GetUserData } from '../auth/decorator/get-user.decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      throw new error(error);
    }
  }

  @Get('me')
  getProfileDetails(@GetUserData('uuid') userId: string) {
    return this.usersService.getProfileDetails(userId);
  }

  @Post('reset-password')
  resetPassword(
    @Body(new ValidationPipe()) body: ResetUserPasswordDto,
    @GetUserData('uuid') userId: string,
  ) {
    return this.usersService.resetPassword(body, userId);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    try {
      return this.usersService.findOne(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    try {
      return this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    try {
      return this.usersService.remove(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
