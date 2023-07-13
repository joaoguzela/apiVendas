import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import UsersTokenRepository from '../infra/typeorm/repositories/UsersTokensRepositoy';
import EtherealMail from '@config/mail/EtherealMail';
import path from 'path';
import { inject, injectable } from 'tsyringe';
import { IUsersTokenRepository } from '../domain/repositories/IUserTokenRepository';
import { IUsersRepository } from '../domain/repositories/IUserRepository';
interface IRequest {
  email: string;
}
@injectable()
export default class ForgotPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokenRepository')
    private userTokensRepository: IUsersTokenRepository,
  ) {}
  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Email does not exist.');

    const { token } = await this.userTokensRepository.generateToken(user.id);
    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );
    await EtherealMail.sendMail({
      to: { name: user.name, email: user.email },
      subject: '[API VENDAS] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
  }
}
