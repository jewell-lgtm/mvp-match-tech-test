import { OrderDto, OrderPurchasedDto } from './dto/order.dto';
import { User } from '../core/user.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderChange } from './order-change.model';
import { BadOrderError } from './bad-order.error';

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
    return { productId: this.product.id, quantity: this.createOrder.quantity };
  }

  assertIsValid(): void {
    if (this.getTotal() > this.user.deposit) {
      throw new BadOrderError('Please insert more coins');
    }
    if (this.product.amountAvailable < this.createOrder.quantity) {
      const productName = this.product.productName;
      throw new BadOrderError(
        `Not enough ${productName} available, please select something else`,
      );
    }
  }
}
