import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './__support__/create-testing.app';
import { CreateProductDto } from '../src/products/dto/create-product.dto';
import { Connection, In } from 'typeorm';
import { User, UserRole } from '../src/core/user.entity';
import { registerUser } from './__support__/register-user';

const buyerUsername = 'Products Controller (e2e) buyer';
const password = 'test1234!@£';

describe('Products Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
    await app
      .get(Connection)
      .getRepository(User)
      .delete({
        username: In([buyerUsername]),
      });
  });

  afterEach(async () => {
    await app.close();
  });

  let buyer: { id: number; token: string };

  beforeEach(async () => {
    buyer = await registerUser(app, {
      username: buyerUsername,
      password,
      role: UserRole.buyer,
    });
  });

  describe('CRUD for products', () => {
    describe('CREATE', () => {
      const createProductDto: CreateProductDto = {};
      it('does not allow buyers to create a product', async () => {
        const response = await request(app.getHttpServer())
          .post('/products')
          .set('Authorization', `Bearer ${buyer.token}`)
          .send(createProductDto);

        expect(response.status).toEqual(403);
      });
    });
  });
});
