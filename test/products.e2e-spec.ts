import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './__support__/create-testing.app';
import { CreateProductDto } from '../src/products/dto/create-product.dto';
import { UpdateProductDto } from '../src/products/dto/update-product.dto';
import { ProductDto } from '../src/products/dto/product.dto';
import { Connection, In } from 'typeorm';
import { User } from '../src/core/user.entity';
import { registerUser } from './__support__/register-user';
import { UserRole } from '../src/core/dto/user-role.enum';

const buyerUsername = 'Products Controller (e2e) buyer';
const sellerUsername = 'Products Controller (e2e) seller';
const otherSellerUsername = 'Products Controller (e2e) other seller';
const password = 'test1234!@£';
const existingProductDto: CreateProductDto = {
  productName: 'A product that exists',
  amountAvailable: 100,
  cost: 500,
};
const createProductDto: CreateProductDto = {
  productName: 'A new product',
  amountAvailable: 1,
  cost: 100,
};
const updateProductDto: UpdateProductDto = {
  productName: 'An updated product',
};

describe('Products Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
    await app
      .get(Connection)
      .getRepository(User)
      .delete({
        username: In([buyerUsername, sellerUsername, otherSellerUsername]),
      });
  });

  afterEach(async () => {
    await app.close();
  });

  let existingProductId: number;
  let buyer: { id: number; token: string };
  let seller: { id: number; token: string };
  let otherSeller: { id: number; token: string };

  beforeEach(async () => {
    buyer = await registerUser(app, {
      username: buyerUsername,
      password,
      role: UserRole.buyer,
    });
    seller = await registerUser(app, {
      username: sellerUsername,
      password,
      role: UserRole.seller,
    });
    otherSeller = await registerUser(app, {
      username: otherSellerUsername,
      password,
      role: UserRole.seller,
    });
    existingProductId = await createProduct(existingProductDto).then(
      (it) => it.id,
    );
  });

  describe('CRUD for products', () => {
    describe('CREATE', () => {
      it('does not allow buyers to create a product', async () => {
        const response = await request(app.getHttpServer())
          .post('/products')
          .set('Authorization', `Bearer ${buyer.token}`)
          .send(createProductDto);

        expect(response.status).toEqual(403);
      });
      it('allows a seller to create a product', async () => {
        const response = await request(app.getHttpServer())
          .post('/products')
          .set('Authorization', `Bearer ${seller.token}`)
          .send(createProductDto);

        expect(response.status).toEqual(201);
      });
    });
    describe('READ', () => {
      it('a buyer can view a created product', async () => {
        const response = await request(app.getHttpServer())
          .get(`/products/${existingProductId}`)
          .set('Authorization', `Bearer ${buyer.token}`);

        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty(
          'productName',
          existingProductDto.productName,
        );
      });
    });
    describe('UPDATE', () => {
      it('does not allow buyers to update products', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/products/${existingProductId}`)
          .set('Authorization', `Bearer ${buyer.token}`)
          .send(updateProductDto);

        expect(response.status).toEqual(403);
      });
      it('lets a seller update their own product', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/products/${existingProductId}`)
          .set('Authorization', `Bearer ${seller.token}`)
          .send(updateProductDto);

        expect(response.status).toEqual(200);

        expect(
          await request(app.getHttpServer())
            .get(`/products/${existingProductId}`)
            .then((res) => res.body),
        ).toHaveProperty('productName', updateProductDto.productName);
      });
      it("blocks a seller from updating another seller's product", async () => {
        const response = await request(app.getHttpServer())
          .patch(`/products/${existingProductId}`)
          .set('Authorization', `Bearer ${otherSeller.token}`)
          .send(updateProductDto);

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual(
          'A seller can only modify their own products',
        );
      });
    });
    describe('DELETE', () => {
      it('allows a seller to delete their own product', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/products/${existingProductId}`)
          .set('Authorization', `Bearer ${seller.token}`);

        expect(response.status).toEqual(200);

        expect(
          await request(app.getHttpServer())
            .get(`/products/${existingProductId}`)
            .set('Authorization', `Bearer ${seller.token}`)
            .then((it) => it.status),
        ).toEqual(404);
      });
      it("forbids a seller to delete another seller's product", async () => {
        const response = await request(app.getHttpServer())
          .patch(`/products/${existingProductId}`)
          .set('Authorization', `Bearer ${otherSeller.token}`);

        expect(response.status).toEqual(403);
      });
    });
  });
  function createProduct(dto: CreateProductDto): Promise<ProductDto> {
    return request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${seller.token}`)
      .send(dto)
      .expect(201)
      .then(({ body }) => body);
  }
});
