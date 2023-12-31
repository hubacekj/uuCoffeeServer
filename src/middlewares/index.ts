import type {
  Response,
  Request,
  NextFunction,
} from 'express';
import { ZodError } from 'zod';

import type {
  ErrorResponse,
  RequestValidators,
} from '../types/index';

export function validateRequest(validators: RequestValidators) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400);
      }

      next(error);
    }
  };
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  next(new Error(`🔍 - Not Found - ${req.originalUrl}`));
};

// eslint-disable-next-line
export const errorHandler = (err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  const statusCode = res.statusCode || 500;

  res.status(statusCode);

  if (err instanceof ZodError) {
    res.json({
      error: {
        message: err.issues.map((issue) => issue.message).join(' '),
      },
    });
  }

  res.json({
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    },
  });
};
