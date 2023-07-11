import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
}
export default class UpdateProfileService {
  public async execute({
    user_id,
    name,
    email,
    password,
    oldPassword,
  }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    const updateEmail = await usersRepository.findByEmail(email);

    if (updateEmail && updateEmail.id != user.id) {
      throw new AppError('Email address already used.');
    }
    if (password && !oldPassword) {
      throw new AppError('Old password is required.');
    }
    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if (!checkOldPassword) throw new AppError('Old password does not match.');
      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;
    await usersRepository.save(user);

    return user;
  }
}
