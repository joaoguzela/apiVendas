import { NextFunction, Request, Response } from 'express';
import ShowProfileService from '@modules/users/services/showProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

export default class ProfileController {
  public async show(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const showProfile = container.resolve(ShowProfileService);
      const user_id = request.user.id;
      const user = await showProfile.execute({
        user_id,
      });
      return response.json(instanceToInstance(user));
    } catch (err) {
      next(err);
    }
  }

  public async update(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const user_id = request.user.id;
      const { name, email, password, oldPassword } = request.body;
      const updateProfile = container.resolve(UpdateProfileService);

      const user = await updateProfile.execute({
        user_id,
        name,
        email,
        password,
        oldPassword,
      });

      return response.json(instanceToInstance(user));
    } catch (err) {
      next(err);
    }
  }
}
