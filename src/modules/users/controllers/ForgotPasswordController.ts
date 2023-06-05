import { NextFunction, Request, Response } from 'express';
import ForgotPasswordService from '../services/ForgotPasswordService';

export default class ForgotPasswordController {
  public async create(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { email } = request.body;

      const sendForgotPasswordEmail = new ForgotPasswordService();
      await sendForgotPasswordEmail.execute({ email });

      return response.status(204).json();
    } catch (err) {
      next(err);
    }
  }
}
