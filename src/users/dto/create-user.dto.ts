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
  @IsEmail()
  @MinLength(6)
  @IsNotEmpty()
  email: string;

  @MinLength(2)
  @IsNotEmpty()
  first_name: string;

  @MinLength(2)
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @MinLength(5)
  password: string;

  @IsOptional()
  @IsEnum(Role, {
    message: 'Role must be one of the following values: user or admin',
  })
  role: Role;
}
