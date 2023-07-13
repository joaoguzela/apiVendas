import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import { IUpdateProfile } from '../domain/models/IUpdateProfile';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({
    user_id,
    name,
    email,
    password,
    oldPassword,
  }: IUpdateProfile): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    const updateEmail = await this.usersRepository.findByEmail(email);

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
    await this.usersRepository.save(user);

    return user;
  }
}
