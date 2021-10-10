import {
  Body,
  Controller,
  Delete,
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
import { AuthService } from '../core/auth.service';
import { UserDto } from '../core/dto/user.dto';
import { JwtAuthGuard } from '../core/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../core/dto/user-role.enum';
import { DepositCoinDto } from './dto/deposit-coin.dto';

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
    return this.users
      .updateOne(parseInt(req.user.sub), update)
      .then((it) => it.toDto());
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Request() req): Promise<void> {
    await this.users.deleteOne(parseInt(req.user.sub));
  }

  @UseGuards(new JwtAuthGuard(UserRole.buyer))
  @Post('me/deposit')
  async increaseDeposit(@Request() req, @Body() coin: DepositCoinDto) {
    await this.users.depositCoin(parseInt(req.user.sub), coin);
  }
}
