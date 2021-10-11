import { INestApplication } from '@nestjs/common';
import { CreateProductDto } from '../../src/products/dto/create-product.dto';
import { ProductDto } from '../../src/products/dto/product.dto';
import * as request from 'supertest';

export function createProduct(
  app: INestApplication,
  token: string,
  dto: CreateProductDto,
): Promise<ProductDto> {
  return request(app.getHttpServer())
    .post('/products')
    .set('Authorization', `Bearer ${token}`)
    .send(dto)
    .expect(201)
    .then(({ body }) => body);
}
