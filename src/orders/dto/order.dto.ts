import { Coins } from '../../users/dto/deposit-coin.dto';

export class OrderDto {
  total: number;
  purchased: OrderPurchasedDto;
  change: OrderChangeDto;
}

export class OrderPurchasedDto {
  productId: number;
  quantity: number;
}

export class OrderChangeDto {
  total: number;
  coins: Coins;
}
