import type { AnyZodObject } from 'zod';
import { z } from 'zod';

export type AnyObject = Record<PropertyKey, unknown>;
export type EmptyObject = Record<PropertyKey, never>;

export type RequestValidators = {
  body?: AnyZodObject,
  params?: AnyZodObject,
  query?: AnyZodObject,
};

export type MessageResponse = {
  message: string
};

export type ErrorResponse = MessageResponse & {
  stack?: string
};

export const ParamsWithId = z.object({
  id: z.string().min(1).refine((val) => (
    !Number.isNaN(Number(val))
  ), {
    message: 'Invalid id',
  }),
});

export type ParamWithId = z.infer<typeof ParamsWithId>;
