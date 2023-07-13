import { instanceToInstance } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import CreateSessionService from '@modules/users/services/CreateSessionsService';
import { container } from 'tsyringe';

export default class SessionsController {
  public async create(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { email, password } = request.body;
      const createSession = container.resolve(CreateSessionService);
      const user = await createSession.execute({ email, password });
      return response.json(instanceToInstance(user));
    } catch (err) {
      next(err);
    }
  }
}
