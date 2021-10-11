import { OrderChange } from './order-change.model';
import { Coins } from '../users/dto/deposit-coin.dto';

describe('Order Change', () => {
  test('one coin exactly', () => {
    const change = new OrderChange(30, 10);

    expect(change.toPay).toEqual(0);
    expect(change.paid).toEqual(20);
    expect(change.changeCoins).toEqual({
      100: 0,
      50: 0,
      20: 1,
      10: 0,
      5: 0,
    } as Coins);
  });

  test('multiple coins exactly', () => {
    const change = new OrderChange(250, 10);

    expect(change.toPay).toEqual(0);
    expect(change.paid).toEqual(240);
    expect(change.changeCoins).toEqual({
      100: 2,
      50: 0,
      20: 2,
      10: 0,
      5: 0,
    } as Coins);
  });

  test('with remainder', () => {
    const change = new OrderChange(21, 10);

    expect(change.toPay).toEqual(1);
    expect(change.paid).toEqual(10);
    expect(change.changeCoins).toEqual({
      100: 0,
      50: 0,
      20: 0,
      10: 1,
      5: 0,
    } as Coins);
  });
});
