import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private users: Repository<User>) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.users.findOne({ where: { username, password } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
