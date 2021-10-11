import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.model';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { BadOrderError } from './bad-order.error';

@Injectable()
export class OrdersService {
  constructor(private users: UsersService, private products: ProductsService) {}

  async createOrder(
    userId: number,
    createOrder: CreateOrderDto,
  ): Promise<Order> {
    const [user, product] = await Promise.all([
      this.users.findOne(userId),
      this.products.findOne(createOrder.productId),
    ]);
    const order = new Order(user, product, createOrder);
    if (!order.isValid()) {
      throw new BadOrderError(
        'Order is invalid, please check you have enough money deposited to complete your order',
      );
    }
    await this.users.updateDeposit(userId, order.change.toPay);

    return order;
  }
}
