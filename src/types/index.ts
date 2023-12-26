import { AnyZodObject, z } from 'zod';

export type RequestValidators = {
  params?: AnyZodObject,
  body?: AnyZodObject,
  query?: AnyZodObject,
}

export type MessageResponse = {
  message: string
}

export type ErrorResponse = MessageResponse & {
  stack?: string
}

export const ParamsWithId = z.object({
  id: z.string().min(1).refine((val) => (
    !Number.isNaN(Number(val))
  ), {
    message: 'Invalid id',
  }
  )
});

export type ParamWithId = z.infer<typeof ParamsWithId>;