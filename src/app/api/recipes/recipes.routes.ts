import { Router } from 'express';
import { ParamsWithId } from '../../../types';

import { validateRequest } from '../../../middlewares';
import {
  findAll,
  findOne,
  createOne,
  updateOne,
  deleteOne,
} from './recipes.handlers';
import {
  InsertRecipeSchema,
  UpdateRecipeSchema,
} from './recipes.models';

const recipesRouter = Router();

recipesRouter.get('/', findAll);

recipesRouter.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  findOne,
);

recipesRouter.post(
  '/',
  validateRequest({
    body: InsertRecipeSchema,
  }),
  createOne,
);

recipesRouter.put(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: UpdateRecipeSchema,
  }),
  updateOne,
);

recipesRouter.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  deleteOne,
);

export default recipesRouter;
