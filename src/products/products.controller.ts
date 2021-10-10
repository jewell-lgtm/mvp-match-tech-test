import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, JwtAuthRequest } from '../core/jwt-auth.guard';
import { UserRole } from '../core/dto/user-role.enum';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Post()
  @UseGuards(new JwtAuthGuard(UserRole.seller))
  createProduct(
    @Body() create: CreateProductDto,
    @Req() { user }: JwtAuthRequest,
  ): Promise<ProductDto> {
    return this.service.create(create, user.sub).then((it) => it.toDto());
  }

  @Get(':id')
  viewProduct(@Param('id') id: number): Promise<ProductDto> {
    return this.service.findOne(id).then((it) => it.toDto());
  }
}
