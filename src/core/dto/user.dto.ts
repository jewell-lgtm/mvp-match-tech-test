import { UserRole } from './user-role.enum';

export class UserDto {
  deposit: number;
  id: number;
  role: UserRole;
  username: string;
}
