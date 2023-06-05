import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UsersTokenRepository from '../typeorm/repositories/UsersTokensRepositoy';
import EtherealMail from '@config/mail/EtherealMail';
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

    await EtherealMail.sendMail({
      to: { name: user.name, email: user.email },
      subject: '[API VENDAS] Recuperação de senha',
      templateData: {
        template: `Ola {{name}} : {{token}}`,
        variables: {
          name: user.name,
          token: token,
        },
      },
    });
  }
}
