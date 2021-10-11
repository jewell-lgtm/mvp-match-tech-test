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
import { ProductDto } from '../src/products/dto/product.dto';

const buyerUsername = 'Orders Controller (e2e) buyer';
const sellerUsername = 'Orders Controller (e2e) seller';

const password = 'test1234!@£';
type ProductName = 'Peanuts' | 'Snickers' | 'Mars' | 'Dom Perignon';

const productDtos: CreateProductDto[] = [
  { productName: 'Peanuts', amountAvailable: 100, cost: 1 },
  {
    productName: 'Snickers',
    amountAvailable: 1,
    cost: 10,
  },
  {
    productName: 'Mars',
    amountAvailable: 10,
    cost: 31,
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
        productId: productIds.Peanuts,
        quantity: 10,
      });

      expect(order).toHaveProperty('total', 10);
      expect(order).toHaveProperty('purchased.productId', productIds.Peanuts);
      expect(order).toHaveProperty('purchased.quantity', 10);
      expect(order).toHaveProperty('change.total', 40);
      expect(order).toHaveProperty('change.coins', {
        100: 0,
        50: 0,
        20: 2,
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

    it('updates the available amount', async () => {
      await purchase({
        productId: productIds.Snickers,
        quantity: 1,
      });
      expect(await getProduct(productIds.Snickers)).toHaveProperty(
        'amountAvailable',
        0,
      );
    });
    it('leaves change that cannot be paid in coins as deposit', async () => {
      const r = await purchase({
        productId: productIds.Mars,
        quantity: 1,
      });
      expect(r.change.total).toEqual(15);
      expect(await getMe()).toHaveProperty('deposit', 4);
    });
    it("it doesn't let you order more than your balance", async () => {
      const buyChampagne: CreateOrderDto = {
        productId: productIds['Dom Perignon'],
        quantity: 10,
      };
      const r = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(buyChampagne);
      expect(r.status).toEqual(400);
      expect(r.body.message).toEqual('Please insert more coins');
    });
    it("doesn't let you buy more than are available", async () => {
      const buyMany: CreateOrderDto = {
        productId: productIds.Snickers,
        quantity: 2,
      };
      const r = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(buyMany);
      expect(r.status).toEqual(400);
      expect(r.body.message).toEqual(
        'Not enough Snickers available, please select something else',
      );
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

  function getProduct(id: number): Promise<ProductDto> {
    return request(app.getHttpServer())
      .get(`/products/${id}`)
      .expect(200)
      .then((res) => res.body);
  }
});
