import { NextFunction, Request, Response } from 'express';
import ForgotPasswordService from '@modules/users/services/ForgotPasswordService';
import { container } from 'tsyringe';

export default class ForgotPasswordController {
  public async create(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { email } = request.body;

      const sendForgotPasswordEmail = container.resolve(ForgotPasswordService);
      await sendForgotPasswordEmail.execute({ email });

      return response.status(204).json();
    } catch (err) {
      next(err);
    }
  }
}
