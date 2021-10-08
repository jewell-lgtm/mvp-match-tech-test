import { User, UserRole } from './user.entity';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto implements Omit<User, 'id' | 'deposit' | 'toDto'> {
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @MinLength(4)
  @MaxLength(255)
  username: string;
}
