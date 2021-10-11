import { ProductDto } from './product.dto';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto implements Partial<ProductDto> {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  amountAvailable?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  cost?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  productName?: string;
}
