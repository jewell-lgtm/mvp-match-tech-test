import { ProductDto } from './product.dto';
import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto implements Omit<ProductDto, 'id' | 'sellerId'> {
  @IsInt()
  @Min(0)
  amountAvailable: number;
  @IsInt()
  @Min(1)
  cost: number;
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  productName: string;
}
