import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../core/jwt-payload';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OwnProductGuard implements CanActivate {
  constructor(
    @InjectRepository(Product) private products: Repository<Product>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const id = request.params.id ? parseInt(request.params.id) : undefined;
    const userId = (request.user as JwtPayload).sub;

    // can't catch these at compile time due to coerced types and optional param
    if (!id) {
      throw new Error(`Unable to determine the product id`);
    }
    if (!userId) {
      throw new Error(`Unable to determine the user id`);
    }

    if (!(await this.validateRequest(id, userId))) {
      throw new ForbiddenException(
        'A seller can only modify their own products',
      );
    }

    return true;
  }

  private async validateRequest(id: number, userId: number): Promise<boolean> {
    // TODO: creates an extra db request, replace repo with service with per-request caching
    const sellerId = await this.products
      .findOne(id)
      .then((it) => it?.sellerId ?? -1);
    return sellerId === userId;
  }
}
