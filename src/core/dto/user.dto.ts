import { UserRole } from './user-role.enum';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  @IsNumber()
  deposit: number;

  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsEnum(UserRole)
  role: UserRole;

  @Expose()
  @IsString()
  username: string;
}
