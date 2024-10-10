import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum SKU {
  KGS = 'kgs',
  GMS = 'gms',
}

export class CreateSeedDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string; // either inhouse or out-sourced

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsEnum(SKU, {
    message: 'SKU must be one of the following values: kgs, gms',
  })
  sku: SKU;
}
