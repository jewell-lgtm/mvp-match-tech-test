import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './__support__/create-testing.app';
import { CreateProductDto } from '../src/products/dto/create-product.dto';
import { Connection, In } from 'typeorm';
import { User } from '../src/core/user.entity';
import { registerUser } from './__support__/register-user';
import { UserRole } from '../src/core/dto/user-role.enum';
import { createProduct } from './__support__/create-product';
import { CreateOrderDto } from '../src/orders/dto/create-order.dto';
import { deposit } from './__support__/deposit';

const buyerUsername = 'Orders Controller (e2e) buyer';
const sellerUsername = 'Orders Controller (e2e) seller';

const password = 'test1234!@£';
type ProductName = 'Snickers' | 'Mars' | 'Dom Perignon';

const productDtos: CreateProductDto[] = [
  {
    productName: 'Snickers',
    amountAvailable: 1,
    cost: 30,
  },
  {
    productName: 'Mars',
    amountAvailable: 10,
    cost: 62,
  },
  {
    productName: 'Dom Perignon',
    amountAvailable: 10,
    cost: 1024,
  },
];

describe('Orders Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
    await app
      .get(Connection)
      .getRepository(User)
      .delete({
        username: In([buyerUsername, sellerUsername]),
      });
  });

  afterEach(async () => {
    await app.close();
  });

  let productIds: Map<ProductName, number>;
  let token: string;

  beforeEach(async () => {
    token = await registerUser(app, {
      username: buyerUsername,
      password,
      role: UserRole.buyer,
    }).then((it) => it.token);

    await deposit(app, token, 50);

    const seller = await registerUser(app, {
      username: sellerUsername,
      password,
      role: UserRole.seller,
    });
    productIds = new Map();
    for (const dto of productDtos) {
      const id = await createProduct(app, seller.token, dto).then(
        (it) => it.id,
      );
      productIds.set(dto.productName as ProductName, id);
    }
  });

  describe('Ordering from the vending machine', () => {
    it('lets a buyer make a purchase', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: productIds.get('Snickers'),
          quantity: 1,
        } as CreateOrderDto);

      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty('total', 30);
      expect(response.body).toHaveProperty(
        'purchased.id',
        productIds.get('Snickers'),
      );
      expect(response.body).toHaveProperty('purchased.quantity', 1);
      expect(response.body).toHaveProperty('change.total', 20);
      expect(response.body).toHaveProperty('change.coins', {
        100: 0,
        50: 0,
        20: 1,
        10: 0,
        5: 0,
      });
    });
  });
});
