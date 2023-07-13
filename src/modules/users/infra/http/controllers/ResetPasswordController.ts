import { NextFunction, Request, Response } from 'express';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import { container } from 'tsyringe';

export default class ResetPasswordController {
  public async create(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { password, token } = request.body;

      const ResetPassword = container.resolve(ResetPasswordService);
      await ResetPassword.execute({ token, password });

      return response.status(204).json();
    } catch (err) {
      next(err);
    }
  }
}
