import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../core/jwt-auth.guard';
import { UserRole } from '../core/user.entity';

@Controller('products')
export class ProductsController {
  @Post()
  @UseGuards(new JwtAuthGuard(UserRole.seller))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async createProduct() {}
}
