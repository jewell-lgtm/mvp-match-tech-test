import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { CoreModule } from "../core/core.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { OwnProductGuard } from "./own-product.guard";

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [OwnProductGuard, ProductsService]
})
export class ProductsModule {
}
