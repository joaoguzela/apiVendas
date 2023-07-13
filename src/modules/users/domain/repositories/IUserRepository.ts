import User from '@modules/users/infra/typeorm/entities/User';
import { ICreateUser } from '../models/ICreateUser';

export interface IUsersRepository {
  findByName(name: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  create(user: ICreateUser): Promise<User>;
  find(): Promise<User[] | undefined>;
  save(user: User): Promise<User>;
}
