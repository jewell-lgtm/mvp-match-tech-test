import { User } from '../../core/user.entity';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../../core/dto/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto
  implements Pick<User, 'password' | 'role' | 'username'>
{
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  username: string;
}
