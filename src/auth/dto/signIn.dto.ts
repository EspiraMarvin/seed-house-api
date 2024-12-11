import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
