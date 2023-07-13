import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import { IUsersRepository } from '../domain/repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
@injectable()
export default class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute(): Promise<User[]> {
    const users = await this.usersRepository.find();
    if (!users?.length) throw new AppError('Nenhum usuario identificado');
    return users;
  }
}
