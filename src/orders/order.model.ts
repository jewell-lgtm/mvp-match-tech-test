import { OrderDto, OrderPurchasedDto } from './dto/order.dto';
import { User } from '../core/user.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderChange } from './order-change.model';

export class Order {
  change: OrderChange;
  constructor(
    private user: User,
    private product: Product,
    private createOrder: CreateOrderDto,
  ) {
    this.change = new OrderChange(user.deposit, this.getTotal());
  }

  toDto = (): OrderDto => ({
    total: this.getTotal(),
    purchased: this.getPurchased(),
    change: this.change.toDto(),
  });

  private getTotal() {
    return this.product.cost * this.createOrder.quantity;
  }

  private getPurchased(): OrderPurchasedDto {
    return { id: this.product.id, quantity: this.createOrder.quantity };
  }

  isValid() {
    return true;
  }
}
