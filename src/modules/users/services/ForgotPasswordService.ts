import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import UsersTokenRepository from '../infra/typeorm/repositories/UsersTokensRepositoy';
import EtherealMail from '@config/mail/EtherealMail';
import path from 'path';
interface IRequest {
  email: string;
}
export default class ForgotPasswordService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UsersTokenRepository);
    const user = await usersRepository.findByEmail(email);

    if (!user) throw new AppError('Email does not exist.');

    const { token } = await userTokensRepository.generateToken(user.id);
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
