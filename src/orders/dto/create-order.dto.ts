import { IsInt, IsPositive, Max, Min } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number;
}
