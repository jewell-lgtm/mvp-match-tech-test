import { Coins, CoinValues } from '../users/dto/deposit-coin.dto';
import { OrderChangeDto } from './dto/order.dto';

export class OrderChange {
  changeCoins: Coins;
  toPay: number;
  paid: number;

  constructor(deposit: number, orderTotal: number) {
    this.changeCoins = {} as Coins;
    this.toPay = deposit - orderTotal;
    this.paid = 0;
    for (const coin of CoinValues) {
      const countPaidCoins = Math.floor(this.toPay / coin);

      this.changeCoins[coin] = countPaidCoins;
      this.paid += countPaidCoins * coin;

      this.toPay = this.toPay % coin;
    }
  }

  toDto(): OrderChangeDto {
    return {
      total: this.paid,
      coins: this.changeCoins,
    };
  }
}
