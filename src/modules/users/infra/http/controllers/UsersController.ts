import { NextFunction, Request, Response } from 'express';
import CreateUserService from '@modules/users/services/CreateUserService';
import ListUserService from '@modules/users/services/ListUserService';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';

export default class UsersController {
  public async index(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const listUser = container.resolve(ListUserService);
      const users = await listUser.execute();
      return response.json(instanceToInstance(users));
    } catch (err) {
      next(err);
    }
  }

  public async create(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { name, email, password } = request.body;
      const createUser = container.resolve(CreateUserService);

      const user = await createUser.execute({ name, email, password });

      return response.json(instanceToInstance(user));
    } catch (err) {
      next(err);
    }
  }
}
