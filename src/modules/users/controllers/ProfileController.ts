import { NextFunction, Request, Response } from 'express';
import ShowProfileService from '../services/showProfileService';
import UpdateProfileService from '../services/UpdateProfileService';

export default class ProfileController {
  public async show(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const showProfile = new ShowProfileService();
      const user_id = request.user.id;
      const user = await showProfile.execute({
        user_id,
      });
      return response.json(user);
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
      const updateProfile = new UpdateProfileService();

      const user = await updateProfile.execute({
        user_id,
        name,
        email,
        password,
        oldPassword,
      });

      return response.json(user);
    } catch (err) {
      next(err);
    }
  }
}
