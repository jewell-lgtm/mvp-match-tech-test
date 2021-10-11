import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.model';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(private users: UsersService, private products: ProductsService) {}

  async createOrder(
    userId: number,
    createOrder: CreateOrderDto,
  ): Promise<Order> {
    const productId = createOrder.productId;
    const [user, product] = await Promise.all([
      this.users.findOne(userId),
      this.products.findOne(productId),
    ]);
    const order = new Order(user, product, createOrder);
    order.assertIsValid();

    // TODO: is it possible for user to submit 2 simultaneous orders and get one for free?
    await this.users.updateDeposit(userId, order.change.toPay);
    await this.products.incrementAmount(productId, -1 * createOrder.quantity);

    return order;
  }
}
