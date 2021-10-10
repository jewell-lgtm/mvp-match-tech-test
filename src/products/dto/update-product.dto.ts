import { ProductDto } from './product.dto';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProductDto implements Partial<ProductDto> {
  @IsOptional()
  @IsInt()
  @Min(0)
  amountAvailable?: number;
  @IsOptional()
  @IsInt()
  @Min(1)
  cost?: number;
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  productName?: string;
}
