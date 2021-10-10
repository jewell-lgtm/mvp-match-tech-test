import { UserRole } from '../../core/user.entity';

export class UserDto {
  deposit: number;
  id: number;
  role: UserRole;
  username: string;
}
