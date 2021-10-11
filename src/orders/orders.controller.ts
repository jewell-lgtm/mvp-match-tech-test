import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../core/jwt-auth.guard';
import { UserRole } from '../core/dto/user-role.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private service: OrdersService) {}

  @Post()
  @UseGuards(new JwtAuthGuard(UserRole.buyer))
  createOrder(
    @Body() createOrder: CreateOrderDto,
    @Req() request: Request,
  ): Promise<OrderDto> {
    return this.service
      .createOrder((request.user as any).sub as number, createOrder)
      .then((it) => it.toDto());
  }
}
