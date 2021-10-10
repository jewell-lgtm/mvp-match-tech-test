import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponseDto } from './create-user-response.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserRole } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService, private authService: AuthService) {}

  @Post('/')
  async create(@Body() body: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = await this.users.createUser(body);
    return { id: user.id, token: this.authService.tokenFor(user) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req): Promise<UserDto> {
    return this.users.findOne(parseInt(req.user.sub)).then((it) => it.toDto());
  }

  @UseGuards(new JwtAuthGuard(UserRole.admin))
  @Get(':id')
  findOne(@Param('id') id): Promise<UserDto> {
    return this.users.findOne(id).then((it) => it.toDto());
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Request() req, @Body() update: UpdateUserDto): Promise<UserDto> {
    console.log('req.user.sub', req.user.sub);

    return this.users
      .updateOne(parseInt(req.user.sub), update)
      .then((it) => it.toDto());
  }
}
