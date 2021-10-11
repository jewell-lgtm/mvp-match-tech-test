import { ProductDto } from './product.dto';
import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto implements Omit<ProductDto, 'id' | 'sellerId'> {
  @ApiProperty()
  @IsInt()
  @Min(0)
  amountAvailable: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  cost: number;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  productName: string;
}
