import { EntityRepository, Repository } from 'typeorm';
import User from '../entities/User';

@EntityRepository(User)
export default class UsersRepository extends Repository<User> {
  public async findByName(name: string): Promise<User | undefined> {
    const user = this.findOne({
      where: {
        name,
      },
    });
    return await user;
  }
  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.findOne({
      where: {
        email,
      },
    });
    return await user;
  }
  public async findById(id: string): Promise<User | undefined> {
    const user = this.findOne({
      where: {
        id,
      },
    });
    return await user;
  }
}
