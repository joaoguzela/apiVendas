import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { isAfter, addHours } from 'date-fns';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import UsersTokenRepository from '../infra/typeorm/repositories/UsersTokensRepositoy';

interface IRequest {
  token: string;
  password: string;
}
export default class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UsersTokenRepository);
    const userToken = await userTokensRepository.findByToken(token);

    if (!userToken) throw new AppError('User token does not exist.');

    const user = await usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('User does not exist.');

    if (isAfter(Date.now(), addHours(userToken.created_at, 2))) {
      throw new AppError('Token expired.');
    }
    user.password = await hash(password, 8);
    await usersRepository.save(user);
  }
}
