import { INestApplication } from '@nestjs/common';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import * as request from 'supertest';

export function registerUser(
  app: INestApplication,
  dto: CreateUserDto,
): Promise<{ id: number; token: string }> {
  return request(app.getHttpServer())
    .post('/users')
    .set('Accept', 'application/json')
    .send(dto)
    .then(({ body: { id, token } }) => ({ id, token }));
}
