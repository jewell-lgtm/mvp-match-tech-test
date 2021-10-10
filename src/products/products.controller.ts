import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, JwtAuthRequest } from '../core/jwt-auth.guard';
import { UserRole } from '../core/dto/user-role.enum';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { OwnProductGuard } from './own-product.guard';

@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  listProducts(): Promise<ProductDto[]> {
    return this.service.list().then((list) => list.map((it) => it.toDto()));
  }

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

  @Patch(':id')
  @UseGuards(new JwtAuthGuard(UserRole.seller), OwnProductGuard)
  updateProduct(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductDto> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(
        'update requires at least one key to be set',
      );
    }
    return this.service.updateOne(id, dto).then((it) => it.toDto());
  }
  @Delete(':id')
  @UseGuards(new JwtAuthGuard(UserRole.seller), OwnProductGuard)
  async deleteProduct(@Param('id') id: number): Promise<void> {
    await this.service.deleteOne(id);
  }
}
