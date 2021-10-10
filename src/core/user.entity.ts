import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { UserRole } from './dto/user-role.enum';
import { Product } from '../products/product.entity';

// User, perhaps counter intuitively, does not belong in the users module as
// auth is a concern that cuts across several modules, so it belongs in core
@Entity()
export class User implements UserDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // todo: don't store passwords in database

  @Column({ type: 'int', default: 0 })
  deposit: number;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToMany(() => Product, (product) => product.seller)
  createdProducts?: Product[];

  toDto(): UserDto {
    return plainToClass(UserDto, this);
  }
}
