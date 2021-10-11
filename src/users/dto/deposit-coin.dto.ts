import { IsIn } from 'class-validator';

export const CoinValues = [100, 50, 20, 10, 5] as const;
export type CoinValue = typeof CoinValues[number];

export class DepositCoinDto {
  @IsIn(CoinValues)
  coinValue: CoinValue;
}
