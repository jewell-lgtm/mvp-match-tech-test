import { Coins } from '../../users/dto/deposit-coin.dto';

export class OrderDto {
  total: number;
  purchased: OrderPurchasedDto;
  change: OrderChangeDto;
}

export class OrderPurchasedDto {
  id: number;
  quantity: number;
}

export class OrderChangeDto {
  total: number;
  coins: Coins;
}
