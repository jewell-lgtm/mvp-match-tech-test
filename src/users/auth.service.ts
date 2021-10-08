import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  async tokenFor(user: User): Promise<string> {
    return 'A test token';
  }
}
