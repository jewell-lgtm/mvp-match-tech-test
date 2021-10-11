import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../core/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { DepositCoinDto } from './dto/deposit-coin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create(dto);
    await this.repo.save(user);
    return user;
  }

  async findOne(id: number): Promise<User> {
    return this.repo.findOneOrFail({ where: { id } });
  }

  async updateOne(id: number, update: UpdateUserDto): Promise<User> {
    await this.repo.update(id, update);
    return this.findOne(id);
  }

  async deleteOne(id: number): Promise<void> {
    await this.repo.remove(await this.repo.findOneOrFail(id));
  }

  async depositCoin(id: number, coin: DepositCoinDto): Promise<void> {
    await this.repo
      .createQueryBuilder('users')
      .update(User)
      .where({ id })
      .set({ deposit: () => `"deposit" + ${coin.coinValue}` })
      .execute();
  }

  async updateDeposit(id: number, newAmount: number): Promise<void> {
    await this.repo.update({ id }, { deposit: newAmount });
  }
}
