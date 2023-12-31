import type {
  Response,
  Request,
  NextFunction,
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
      ingredients: recipeIngredientList,
      ...rest
    } = req.body;

    const [recipesWithName] = await db.select().from(recipes).where(eq(recipes.name, rest.name));

    if (recipesWithName) {
      throw new Error(`Recipe with name "${rest.name}" already exists.`);
    }

    if (recipeIngredientList) {
      const recipeIngredientsThatDontExist = await filterAsync(recipeIngredientList, async (recipeIngredient) => {
        const [ingredientRecord] = await db
          .select()
          .from(ingredients)
          .where(eq(ingredients.id, recipeIngredient.ingredientId));

        return ingredientRecord === undefined;
      });

      if (recipeIngredientsThatDontExist.length > 0) {
        const idsString = recipeIngredientsThatDontExist
          .map((recipeIngredient) => recipeIngredient.ingredientId).join(', ');

        res.status(404);
        throw new Error(
          `Ingredients with ids ${idsString} not found.`,
        );
      }
    }

    const [insertedRecipe] = await db.insert(recipes).values({ ...rest }).returning();

    if (!insertedRecipe) {
      res.status(404);
      throw new Error('Unable to create recipe.');
    }

    if (recipeIngredientList) {
      const recipeIngredientsToInsert = recipeIngredientList.map((recipeIngredient) => ({
        ...recipeIngredient,
        recipeId: insertedRecipe.id,
      }));

      await db.insert(recipeIngredients).values(recipeIngredientsToInsert);
    }

    const [insertedRecipeWithIngredients] = await db.query.recipes.findMany({
      where: eq(recipes.id, insertedRecipe.id),
      with: {
        ingredients: {
          columns: {
            ingredientId: true,
            amount: true,
          },
        },
      },
    });

    res.json(insertedRecipeWithIngredients);
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

    const [result] = await db.query.recipes.findMany({
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
      ingredients: recipeIngredientList,
      ...rest
    } = req.body;

    const [recipeToBeUpdated] = await db.select().from(recipes).where(eq(recipes.id, paramId));

    if (!recipeToBeUpdated) {
      res.status(404);
      throw new Error(`Recipe with id ${paramId} not found.`);
    }

    if (rest.name) {
      const [recipesWithName] = await db.select().from(recipes).where(eq(recipes.name, rest.name));

      if (recipesWithName && recipesWithName.id !== paramId) {
        throw new Error(`Unable to update recipe with name "${rest.name}" that already exists.`);
      }
    }

    if (recipeIngredientList) {
      const recipeIngredientsThatDontExist = await filterAsync(recipeIngredientList, async (recipeIngredient) => {
        const [ingredientRecord] = await db
          .select()
          .from(ingredients)
          .where(eq(ingredients.id, recipeIngredient.ingredientId));

        return ingredientRecord === undefined;
      });

      if (recipeIngredientsThatDontExist.length > 0) {
        const idsString = recipeIngredientsThatDontExist
          .map((recipeIngredient) => recipeIngredient.ingredientId).join(', ');

        res.status(404);
        throw new Error(
          `Ingredients with ids ${idsString} not found.`,
        );
      } else {
        const recipeIngredientsToInsert = recipeIngredientList.map((recipeIngredient) => ({
          ...recipeIngredient,
          recipeId: paramId,
        }));

        await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, paramId));
        await db.insert(recipeIngredients).values(recipeIngredientsToInsert);
      }
    }

    await db
      .update(recipes)
      .set({ ...rest })
      .where(eq(recipes.id, paramId));

    const [updatedRecipeWithIngredients] = await db.query.recipes.findMany({
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

    res.json(updatedRecipeWithIngredients);
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

    const recipeToBeDeleted = await db.select().from(recipes).where(eq(recipes.id, paramId));

    if (!recipeToBeDeleted) {
      res.status(404);
      throw new Error(`Recipe with id ${paramId} not found.`);
    }

    await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, paramId));
    await db.delete(recipes).where(eq(recipes.id, paramId));

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
