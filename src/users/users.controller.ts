import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { CreateUserResponseDto } from './create-user-response.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/')
  async create(@Body() body: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = await this.usersService.createUser(body);
    return { id: user.id, token: await this.authService.tokenFor(user) };
  }

  @Get(':id')
  findOne(@Param('id') id): Promise<UserDto> {
    return this.usersService.findOne(id).then((it) => it.toDto());
  }
}
