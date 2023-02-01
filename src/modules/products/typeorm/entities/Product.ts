import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Products')
class Product {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('boolean')
  price: number;

  @Column()
  quantity: number;

  @Column()
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
export default Product;
