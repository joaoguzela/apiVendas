import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export const isAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new AppError('JWT Token is missing.');

  const [, token] = authHeader.split(' ');
  try {
    const decodeToken = verify(token, authConfig.jwt.secret);
    const {
      sub: idUser,
      exp: expires,
      iat: createAt,
    } = decodeToken as ITokenPayload;

    request.user = {
      id: idUser,
    };
    return next();
  } catch (error) {
    throw new AppError(`Application error: ${error}`);
  }
};
