import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @MinLength(2)
  @IsNotEmpty()
  first_name: string;

  @MinLength(2)
  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @IsEmail()
  @MinLength(6)
  email: string;

  @IsOptional()
  password: string;

  @IsEnum(Role, {
    message: 'Role must be one of the following values: user or admin',
  })
  @Transform(({ value }) => value.toLowerCase())
  role: Role;
}
