import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { isAfter, addHours } from 'date-fns';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import UsersTokenRepository from '../infra/typeorm/repositories/UsersTokensRepositoy';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUserRepository';
import { IUsersTokenRepository } from '../domain/repositories/IUserTokenRepository';

interface IRequest {
  token: string;
  password: string;
}
@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokenRepository')
    private userTokensRepository: IUsersTokenRepository,
  ) {}
  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) throw new AppError('User token does not exist.');

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('User does not exist.');

    if (isAfter(Date.now(), addHours(userToken.created_at, 2))) {
      throw new AppError('Token expired.');
    }
    user.password = await hash(password, 8);
    await this.usersRepository.save(user);
  }
}
