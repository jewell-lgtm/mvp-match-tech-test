import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { User } from '../core/user.entity';
import { plainToClass } from 'class-transformer';

@Entity()
export class Product implements ProductDto {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  amountAvailable: number;

  @Column({ type: 'int' })
  cost: number;

  @Column()
  productName: string;

  @ManyToOne(() => User, (user) => user.createdProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sellerId' })
  seller?: User;

  @Column()
  sellerId: number;

  toDto() {
    return plainToClass(ProductDto, this);
  }
}
