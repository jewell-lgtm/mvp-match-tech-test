import { IsIn } from 'class-validator';

type CoinValue = 5 | 10 | 20 | 50 | 100;

export class DepositCoinDto {
  @IsIn([5, 10, 20, 50, 100])
  coinValue: CoinValue;
}
