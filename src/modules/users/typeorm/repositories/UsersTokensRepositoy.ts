import { EntityRepository, Repository } from 'typeorm';
import UserToken from '../entities/UserToken';

@EntityRepository(UserToken)
export default class UsersTokenRepository extends Repository<UserToken> {
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.findOne({
      where: {
        token,
      },
    });
    return await userToken;
  }
  public async generateToken(user_id: string): Promise<UserToken> {
    const userToken = this.create({
      user_id,
    });

    await this.save(userToken);
    return userToken;
  }
}
