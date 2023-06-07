import { EntityRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';

@EntityRepository(Customer)
export default class CustomersRepository extends Repository<Customer> {
  public async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.findOne({
      where: {
        name,
      },
    });
    return await customer;
  }
  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.findOne({
      where: {
        email,
      },
    });
    return await customer;
  }
  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.findOne({
      where: {
        id,
      },
    });
    return await customer;
  }
}
