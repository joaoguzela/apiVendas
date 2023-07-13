import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import { ICustomerRepository } from '../domain/repositories/ICustomersRepository';
import Customer from '../infra/typeorm/entities/Customer';
import CustomersRepository from '../infra/typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
}
@injectable()
export default class ShowCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomerRepository,
  ) {}
  public async execute({ id }: IRequest): Promise<Customer> {
    try {
      const customer = await this.customersRepository.findById(id);

      if (!customer) throw new AppError('User not found.');

      return customer;
    } catch (err) {
      throw new AppError(JSON.stringify(err));
    }
  }
}
