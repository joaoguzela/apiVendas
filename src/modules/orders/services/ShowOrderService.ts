import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IOrder } from '../domain/models/IOrder';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';

interface IRequest {
  id: string;
}
@injectable()
export default class ShowOrderService {
  private ordersRepository: IOrdersRepository;
  constructor(
    @inject('OrdersRepository')
    ordersRepository: IOrdersRepository,
  ) {
    this.ordersRepository = ordersRepository;
  }
  public async execute({ id }: IRequest): Promise<IOrder> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new AppError('Order not found.');
    }

    return order;
  }
}
