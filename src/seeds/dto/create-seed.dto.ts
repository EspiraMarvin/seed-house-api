import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum SKU {
  KG = 'kg',
  GM = 'g',
}

export enum SEEDTYPE {
  IN_HOUSE = 'in_house',
  OUT_SOURCED = 'out_sourced',
}

export class CreateSeedDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsEnum(SEEDTYPE, {
    message:
      'Seed Type must be one of the following values: in_house, out_sourced',
  })
  @Transform(({ value }) => value.toLowerCase())
  type: SEEDTYPE;

  @IsEnum(SKU, {
    message: 'SKU must be one of the following values: kg, g',
  })
  @Transform(({ value }) => value.toLowerCase())
  sku: SKU;
}
