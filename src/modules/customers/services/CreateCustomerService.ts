import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateCustomer } from '../domain/models/ICreateCustomer';
import { ICustomer } from '../domain/models/ICustomer';
import { ICustomerRepository } from '../domain/repositories/ICustomersRepository';

@injectable()
export default class CreateCustomerService {
  private customerRepository: ICustomerRepository;
  constructor(
    @inject('CustomersRepository')
    customerRepository: ICustomerRepository,
  ) {
    this.customerRepository = customerRepository;
  }
  public async execute({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const emailExist = await this.customerRepository.findByEmail(email);

    if (emailExist) throw new AppError('Email address already used.');

    const customer = await this.customerRepository.create({
      name,
      email,
    });
    if (!customer) throw new AppError('Error Create to user', 403);
    return customer;
  }
}
