import type {
  Response, Request, NextFunction,
} from 'express';
import { eq } from 'drizzle-orm';

import type {
  ParamWithId,
  EmptyObject,
} from '../../../types';
import {
  recipeIngredients,
  recipes,
  ingredients,
} from '../../../db/schema';
import { db } from '../../../db';
import { filterAsync } from '../../../utilities/asyncFilter';

import type {
  InsertRecipeType, Recipe, UpdateRecipeType,
} from './recipes.models';

export async function findAll(_: Request, res: Response<Recipe[]>, next: NextFunction) {
  try {
    const allRecipes = await db.query.recipes.findMany({
      with: {
        ingredients: {
          columns: {
            ingredientId: true,
            amount: true,
          },
        },
      },
    });

    res.json(allRecipes);
  } catch (error) {
    next(error);
  }
}

export async function createOne(
  req: Request<EmptyObject, Recipe, InsertRecipeType>,
  res: Response<Recipe>,
  next: NextFunction,
) {
  try {
    const {
      ingredients: recipeIngredientList, ...rest
    } = req.body;

    if (recipeIngredientList) {
      const recipeIngredientsThatDontExist = await filterAsync(recipeIngredientList, async (recipeIngredient) => {
        const ingredientRecord = await db.query.ingredients.findFirst({
          where: eq(ingredients.id, recipeIngredient.ingredientId),
        });

        return ingredientRecord === undefined;
      });

      if (recipeIngredientsThatDontExist.length > 0) {
        res.status(404);
        throw new Error(
          `Ingredients with ids ${recipeIngredientsThatDontExist.map((recipeIngredient) => recipeIngredient.ingredientId).join(', ')} not found.`,
        );
      }
    }

    const updatedRecipes = await db.insert(recipes).values({ ...rest }).returning();

    const lastRecipeId = updatedRecipes[updatedRecipes.length - 1]?.id;

    if (!lastRecipeId) {
      res.status(404);
      throw new Error('Unable to insert.');
    }

    const insertedRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, lastRecipeId),
      with: {
        ingredients: {
          columns: {
            ingredientId: true,
            amount: true,
          },
        },
      },
    });

    if (recipeIngredientList) {
      const recipeIngredientsToInsert = recipeIngredientList.map((recipeIngredient) => ({
        ...recipeIngredient,
        recipeId: lastRecipeId,
      }));

      await db.insert(recipeIngredients).values(recipeIngredientsToInsert);
    }

    res.json(insertedRecipe);
  } catch (error) {
    next(error);
  }
}

export async function findOne(
  req: Request<ParamWithId, Recipe, EmptyObject>,
  res: Response<Recipe>,
  next: NextFunction,
) {
  try {
    const paramId = Number(req.params.id);

    const result = await db.query.recipes.findFirst({
      where: eq(recipes.id, paramId),
      with: {
        ingredients: {
          columns: {
            ingredientId: true,
            amount: true,
          },
        },
      },
    });

    if (!result) {
      res.status(404);
      throw new Error(`Recipe with id "${paramId}" not found.`);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(
  req: Request<ParamWithId, Recipe, UpdateRecipeType>,
  res: Response<Recipe>,
  next: NextFunction,
) {
  try {
    const paramId = Number(req.params.id);

    const {
      ingredients: recipeIngredientList, ...rest
    } = req.body;

    const recipeToBeUpdated = await db.query.ingredients.findFirst({
      where: eq(ingredients.id, paramId),
    });

    if (!recipeToBeUpdated) {
      res.status(404);
      throw new Error(`Recipe with id "${paramId}" not found.`);
    }

    if (recipeIngredientList) {
      const recipeIngredientsThatDontExist = await filterAsync(recipeIngredientList, async (recipeIngredient) => {
        const ingredientRecord = await db.query.ingredients.findFirst({
          where: eq(ingredients.id, recipeIngredient.ingredientId),
        });

        return ingredientRecord === undefined;
      });

      if (recipeIngredientsThatDontExist.length > 0) {
        res.status(404);
        throw new Error(
          `Ingredients with ids ${recipeIngredientsThatDontExist.map((recipeIngredient) => recipeIngredient.ingredientId).join(', ')} not found.`,
        );
      }
    }

    await db.update(recipes).set({ ...rest }).where(eq(recipes.id, paramId));

    if (recipeIngredientList) {
      const recipeIngredientsToInsert = recipeIngredientList.map((recipeIngredient) => ({
        ...recipeIngredient,
        recipeId: paramId,
      }));

      await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, paramId));
      await db.insert(recipeIngredients).values(recipeIngredientsToInsert);
    }

    const updatedRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, paramId),
      with: {
        ingredients: {
          columns: {
            ingredientId: true,
            amount: true,
          },
        },
      },
    });

    res.json(updatedRecipe);
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

    const deletedRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, paramId),
    });

    if (!deletedRecipe) {
      res.status(404);
      throw new Error(`Recipe with id "${paramId}" not found.`);
    }

    await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, paramId));
    await db.delete(recipes).where(eq(recipes.id, paramId));

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
