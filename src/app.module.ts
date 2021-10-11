import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './core/user.entity';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [User, Product],
        logging: true,
        synchronize: false,
        // synchronize: true,
        // dropSchema: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CoreModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
