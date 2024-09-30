import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
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
  @IsNotEmpty()
  password: string;
}
