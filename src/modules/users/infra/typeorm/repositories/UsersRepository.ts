import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IUpdateProfile } from '@modules/users/domain/models/IUpdateProfile';
import { IUsersRepository } from '@modules/users/domain/repositories/IUserRepository';
import { getRepository, Repository } from 'typeorm';
import User from '../entities/User';

export default class UsersRepository implements IUsersRepository {
  private ormUsersRepository: Repository<User>;
  constructor() {
    this.ormUsersRepository = getRepository(User);
  }
  public async findByName(name: string): Promise<User | undefined> {
    const user = this.ormUsersRepository.findOne({
      where: {
        name,
      },
    });
    return await user;
  }
  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.ormUsersRepository.findOne({
      where: {
        email,
      },
    });
    return await user;
  }
  public async findById(id: string): Promise<User | undefined> {
    const user = this.ormUsersRepository.findOne({
      where: {
        id,
      },
    });
    return await user;
  }
  public async create(user: ICreateUser): Promise<User> {
    const createProduct = this.ormUsersRepository.create(user);

    this.ormUsersRepository.save(createProduct);

    return createProduct;
  }
  public async find(): Promise<User[] | undefined> {
    const ProductList = this.ormUsersRepository.find();
    return ProductList;
  }
  public async save(user: User): Promise<User> {
    await this.ormUsersRepository.save(user);

    return user;
  }
}
