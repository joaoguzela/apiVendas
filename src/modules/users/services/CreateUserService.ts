import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import { ICreateUser } from '../domain/models/ICreateUser';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUserRepository';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({ name, email, password }: ICreateUser): Promise<IUser> {
    const emailExist = await this.usersRepository.findByEmail(email);

    if (emailExist) throw new AppError('Email address already used.');

    const hashedPassword = await hash(password, 8);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return user;
  }
}
