import { IUserToken } from '../models/IUserToken';

export interface IUsersTokenRepository {
  findByToken(token: string): Promise<IUserToken | undefined>;
  generateToken(user_id: string): Promise<IUserToken>;
}
