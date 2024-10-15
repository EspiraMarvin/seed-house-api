import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  seed_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
