import { IUserToken } from '@modules/users/domain/models/IUserToken';
import { IUsersTokenRepository } from '@modules/users/domain/repositories/IUserTokenRepository';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import UserToken from '../entities/UserToken';

@EntityRepository(UserToken)
export default class UsersTokenRepository implements IUsersTokenRepository {
  private ormUsersTokenRepository: Repository<UserToken>;
  constructor() {
    this.ormUsersTokenRepository = getRepository(UserToken);
  }
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.ormUsersTokenRepository.findOne({
      where: {
        token,
      },
    });
    return await userToken;
  }
  public async generateToken(user_id: string): Promise<UserToken> {
    const userToken = this.ormUsersTokenRepository.create({
      user_id,
    });

    await this.ormUsersTokenRepository.save(userToken);
    return userToken;
  }
}
