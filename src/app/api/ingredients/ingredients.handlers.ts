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
    const { name } = req.body;

    const [ingredientWithName] = await db.select().from(ingredients).where(eq(ingredients.name, name));

    if (ingredientWithName) {
      throw new Error(`Ingredient with name "${name}" already exists.`);
    }

    const [insertedIngredient] = await db
      .insert(ingredients)
      .values({ ...req.body })
      .returning();

    if (!insertedIngredient) {
      res.status(404);
      throw new Error('Unable to create ingredient.');
    }

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

    const [result] = await db.select().from(ingredients).where(eq(ingredients.id, paramId));

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

    const [ingredientToBeUpdated] = await db.select().from(ingredients).where(eq(ingredients.id, paramId));

    if (!ingredientToBeUpdated) {
      res.status(404);
      throw new Error(`Ingredient with id "${paramId}" not found.`);
    }

    if (req.body.name) {
      const [ingredientWithName] = await db.select().from(ingredients).where(eq(ingredients.name, req.body.name));

      if (ingredientWithName && ingredientWithName.id !== paramId) {
        throw new Error(`Unable to update ingredient with name "${req.body.name}" that already exists.`);
      }
    }

    const [updatedIngredient] = await db
      .update(ingredients)
      .set({ ...req.body })
      .where(eq(ingredients.id, paramId))
      .returning();

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

    const [toBeDeletedIngredient] = await db.select().from(ingredients).where(eq(ingredients.id, paramId));

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
