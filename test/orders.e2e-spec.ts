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
import { OrderDto } from '../src/orders/dto/order.dto';
import { UserDto } from '../src/core/dto/user.dto';
import { ExtractJwt } from 'passport-jwt';
import fromAuthHeaderWithScheme = ExtractJwt.fromAuthHeaderWithScheme;

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
  let connection: Connection;

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

  let productIds: Record<ProductName, number>;
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
    productIds = {} as Record<ProductName, number>;
    for (const dto of productDtos) {
      productIds[dto.productName as ProductName] = await createProduct(
        app,
        seller.token,
        dto,
      ).then((it) => it.id);
    }
  });

  describe('Ordering from the vending machine', () => {
    it('lets a buyer make a purchase', async () => {
      const order = await purchase({
        productId: productIds.Snickers,
        quantity: 1,
      });

      expect(order).toHaveProperty('total', 30);
      expect(order).toHaveProperty('purchased.id', productIds.Snickers);
      expect(order).toHaveProperty('purchased.quantity', 1);
      expect(order).toHaveProperty('change.total', 20);
      expect(order).toHaveProperty('change.coins', {
        100: 0,
        50: 0,
        20: 1,
        10: 0,
        5: 0,
      });
    });
    it('updates the deposit amount', async () => {
      await purchase({
        productId: productIds.Snickers,
        quantity: 1,
      });
      expect(await getMe()).toHaveProperty('deposit', 0);
    });
    it('leaves change that cannot be paid in coins as deposit', async () => {
      await connection
        .getRepository(User)
        .update({ username: buyerUsername }, { deposit: 31 });
      await purchase({
        productId: productIds.Snickers,
        quantity: 1,
      });
      expect(await getMe()).toHaveProperty('deposit', 1);
    });
  });

  function purchase(dto: CreateOrderDto): Promise<OrderDto> {
    return request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(201)
      .then((res) => res.body);
  }

  function getMe(): Promise<UserDto> {
    return request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => res.body);
  }
});
