import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateRandomPassword } from 'src/utils/helpers';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const randomPwd = generateRandomPassword();
    const newUser = await this.prisma.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        password: randomPwd,
      },
    });

    //TODO: SEND NEWLY CREATED USERS EMAIL/SMS  TO RESET PWDS
    return newUser;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, data: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...data, // Patch only the provided fields
        },
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Record with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
