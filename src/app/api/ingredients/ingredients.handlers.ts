import type {
  Response, Request, NextFunction,
} from 'express';
import { eq } from 'drizzle-orm';

import type {
  ParamWithId,
  EmptyObject,
} from '../../../types';
import {
  ingredients, recipeIngredients,
} from '../../../db/schema';
import { db } from '../../../db';
import type {
  InsertIngredientType,
  UpdateIngredientType,
  Ingredient,
} from './ingredients.models';

export async function findAll(
  _: Request,
  res: Response<Ingredient[]>,
  next: NextFunction,
) {
  try {
    const allIngredients = await db.query.ingredients.findMany({
      with: {
        recipes: {
          columns: {
            recipeId: true,
          },
        },
      },
    });

    res.json(allIngredients);
  } catch (error) {
    next(error);
  }
}

export async function createOne(
  req: Request<EmptyObject, Ingredient, InsertIngredientType>,
  res: Response<Ingredient>,
  next: NextFunction,
) {
  try {
    const updatedIngredients = await db.insert(ingredients).values({ ...req.body }).returning();

    const lastIngredientId = updatedIngredients[updatedIngredients.length - 1]?.id;

    if (!lastIngredientId) {
      res.status(404);
      throw new Error('Unable to insert.');
    }

    const insertedIngredient = await db.query.ingredients.findFirst({
      where: eq(ingredients.id, lastIngredientId),
    });

    res.json(insertedIngredient);
  } catch (error) {
    next(error);
  }
}

export async function findOne(
  req: Request<ParamWithId, Ingredient, EmptyObject>,
  res: Response<Ingredient>,
  next: NextFunction,
) {
  try {
    const paramId = Number(req.params.id);

    const result = await db.query.ingredients.findFirst({
      where: eq(ingredients.id, paramId),
    });

    if (!result) {
      res.status(404);
      throw new Error(`Ingredient with id "${paramId}" not found.`);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(
  req: Request<ParamWithId, Ingredient, UpdateIngredientType>,
  res: Response<Ingredient>,
  next: NextFunction,
) {
  try {
    const paramId = Number(req.params.id);

    const ingredientToBeUpdated = await db.query.ingredients.findFirst({
      where: eq(ingredients.id, paramId),
    });

    if (!ingredientToBeUpdated) {
      res.status(404);
      throw new Error(`Ingredient with id "${paramId}" not found.`);
    }

    await db.update(ingredients).set({ ...req.body }).where(eq(ingredients.id, paramId));

    const updatedIngredient = await db.query.ingredients.findFirst({
      where: eq(ingredients.id, paramId),
    });

    res.json(updatedIngredient);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(
  req: Request<ParamWithId, EmptyObject, EmptyObject>,
  res: Response<EmptyObject>,
  next: NextFunction,
) {
  try {
    const paramId = Number(req.params.id);

    const toBeDeletedIngredient = await db.query.ingredients.findFirst({
      where: eq(ingredients.id, paramId),
    });

    if (!toBeDeletedIngredient) {
      res.status(404);
      throw new Error(`Ingredient with id "${paramId}" not found.`);
    }

    await db.delete(recipeIngredients).where(eq(recipeIngredients.ingredientId, paramId));

    await db.delete(ingredients).where(eq(ingredients.id, paramId));

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
