import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder';
import { IOrder } from '@modules/orders/domain/models/IOrder';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { getRepository, Repository } from 'typeorm';
import Order from '../entities/Order';
interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}
interface IRequest {
  customer: Customer;
  products: IProduct[];
}
export class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;
  constructor() {
    this.ormRepository = getRepository(Order);
  }
  public async findById(id: string): Promise<Order | null> {
    const order = this.ormRepository.findOne({
      where: { id },
      relations: ['order_products', 'customer'],
    });
    return order;
  }

  public async create({ customer, products }: ICreateOrder): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });

    await this.ormRepository.save(order);

    return order;
  }
}
