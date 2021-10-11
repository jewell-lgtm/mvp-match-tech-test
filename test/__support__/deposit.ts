import { INestApplication } from '@nestjs/common';
import {
  CoinValue,
  DepositCoinDto,
} from '../../src/users/dto/deposit-coin.dto';
import * as request from 'supertest';

export async function deposit(
  app: INestApplication,
  token: string,
  coinValue: CoinValue,
) {
  return request(app.getHttpServer())
    .post('/users/me/deposit')
    .set('Authorization', `Bearer ${token}`)
    .send({ coinValue } as DepositCoinDto)
    .expect(201);
}
