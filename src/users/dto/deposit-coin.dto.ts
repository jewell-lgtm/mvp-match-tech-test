import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const CoinValues = [100, 50, 20, 10, 5] as const;
export type CoinValue = typeof CoinValues[number];
export class Coins {
  100: number;
  50: number;
  20: number;
  10: number;
  5: number;
}

export class DepositCoinDto {
  @ApiProperty()
  @IsIn(CoinValues)
  coinValue: CoinValue;
}
