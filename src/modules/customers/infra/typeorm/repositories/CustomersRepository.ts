import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { ICustomerRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { getRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';

export default class CustomersRepository implements ICustomerRepository {
  private ormRepository: Repository<Customer>;
  constructor() {
    this.ormRepository = getRepository(Customer);
  }
  public async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.ormRepository.findOne({
      where: {
        name,
      },
    });
    return await customer;
  }
  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.ormRepository.findOne({
      where: {
        email,
      },
    });
    return await customer;
  }
  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.ormRepository.findOne({
      where: {
        id,
      },
    });
    return await customer;
  }
  public async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = this.ormRepository.create({ name, email });
    await this.ormRepository.save(customer);
    return customer;
  }
  public async save(customer: Customer): Promise<Customer | undefined> {
    return this.ormRepository.save(customer);
  }

  public async remove(customer: Customer): Promise<void> {
    this.ormRepository.remove(customer);
  }
}
