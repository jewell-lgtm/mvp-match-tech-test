import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [],
  controllers: [AppController, ProductsController, UsersController],
  providers: [AppService],
})
export class AppModule {}
