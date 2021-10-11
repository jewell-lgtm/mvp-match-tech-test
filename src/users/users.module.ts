import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../core/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from '../core/core.module';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([User]), PassportModule],
  providers: [UsersService, LocalStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
