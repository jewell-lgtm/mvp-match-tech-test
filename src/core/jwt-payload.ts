import { User } from './user.entity';
import { plainToClass } from 'class-transformer';
import { UserRole } from './dto/user-role.enum';

export class JwtPayloadDto {
  sub: number;
  username: string;
  role: UserRole;
}

export class JwtPayload implements JwtPayloadDto {
  sub: number;
  username: string;
  role: UserRole;

  static create(user: User): JwtPayload {
    return plainToClass(JwtPayload, {
      sub: user.id,
      username: user.username,
      role: user.role,
    } as JwtPayload);
  }

  toDto(): JwtPayloadDto {
    return { sub: this.sub, username: this.username, role: this.role };
  }
}
