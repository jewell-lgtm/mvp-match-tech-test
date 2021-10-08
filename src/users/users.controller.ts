import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  @Post('/')
  async create(@Body() createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }
}
