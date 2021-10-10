import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private products: Repository<Product>,
  ) {}

  create(dto: CreateProductDto, sellerId: number): Promise<Product> {
    const product = this.products.create({ ...dto, sellerId });
    return this.products.save(product);
  }

  findOne(id: number): Promise<Product> {
    return this.products.findOneOrFail(id);
  }
}
