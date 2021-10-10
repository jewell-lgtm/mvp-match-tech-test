import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';

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

  async updateOne(id: number, update: UpdateProductDto): Promise<Product> {
    await this.products.update(id, update);
    return this.findOne(id);
  }

  async deleteOne(id: number): Promise<void> {
    await this.products.delete(id);
  }

  list(): Promise<Product[]> {
    return this.products.find();
  }
}
