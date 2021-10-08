import { UserRole } from './user.entity';

export class UserDto {
  deposit: number;
  id: number;
  role: UserRole;
  username: string;
}
