import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { CreateUserResponseDto } from './create-user-response.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserDto } from './user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserRole } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/')
  async create(@Body() body: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = await this.usersService.createUser(body);
    return { id: user.id, token: this.authService.tokenFor(user) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req): Promise<UserDto> {
    return this.findOne(req.user.sub);
  }

  @UseGuards(new JwtAuthGuard(UserRole.admin))
  @Get(':id')
  findOne(@Param('id') id): Promise<UserDto> {
    return this.usersService.findOne(id).then((it) => it.toDto());
  }
}
