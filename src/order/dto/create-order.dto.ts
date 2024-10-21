import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  seed_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsArray()
  seeds: { seed_id: string; quantity: number }[];
}
