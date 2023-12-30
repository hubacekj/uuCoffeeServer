import { Router } from 'express';
import { ParamsWithId } from '../../../types';

import { validateRequest } from '../../../middlewares';
import {
  findAll, findOne, createOne, updateOne, deleteOne,
} from './ingredients.handlers';
import {
  InsertIngredientSchema, UpdateIngredientSchema,
} from './ingredients.models';

const ingredientsRouter = Router();

ingredientsRouter.get('/', findAll);

ingredientsRouter.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  findOne,
);

ingredientsRouter.post(
  '/',
  validateRequest({
    body: InsertIngredientSchema,
  }),
  createOne,
);

ingredientsRouter.put(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: UpdateIngredientSchema,
  }),
  updateOne,
);

ingredientsRouter.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  deleteOne,
);

export default ingredientsRouter;
