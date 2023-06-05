import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

export default class UsersAvatarController {
  public async update(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    const updateAvatar = new UpdateUserAvatarService();
    console.log(request);
    if (!request.file?.filename) throw new AppError('File not found.');

    const user = updateAvatar.execute({
      userId: request.user.id,
      avatarFileName: request.file.filename,
    });

    return response.json(user);
  }
}