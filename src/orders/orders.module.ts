import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UsersModule } from '../users/users.module';
import { CoreModule } from '../core/core.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [UsersModule, CoreModule, ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
