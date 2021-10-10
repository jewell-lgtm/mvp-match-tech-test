import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  tokenFor(user: User): string {
    return this.jwtService.sign(JwtPayload.create(user).toDto());
  }
}
