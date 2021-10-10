import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserDto } from '../users/dto/user.dto';
import { plainToClass } from 'class-transformer';

export enum UserRole {
  admin = 'admin',
  seller = 'seller',
  buyer = 'buyer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  // Implement user model with username, password, deposit and role fields
  @Column({ unique: true })
  username: string;
  @Column()
  password: string; // todo: don't store passwords in database
  @Column({ type: 'int', default: 0 })
  deposit: number;
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  toDto(): UserDto {
    return plainToClass(UserDto, this);
  }
}
