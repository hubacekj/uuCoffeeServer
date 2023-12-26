import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from 'zod';
import { recipes, recipeIngredients } from "../../../db/schema";

export const RecipeIngredientRelationSchema = createSelectSchema(recipeIngredients);
export const RecipeIngredientSchema = RecipeIngredientRelationSchema.omit({ recipeId: true })
export type RecipeIngredientRelation = z.infer<typeof RecipeIngredientRelationSchema>;
export type RecipeIngredient = z.infer<typeof RecipeIngredientSchema>

export const RecipeSchema = createSelectSchema(recipes);
export const InsertRecipeWithIdSchema = createInsertSchema(recipes);
export const InsertRecipeSchema = InsertRecipeWithIdSchema
  .omit({ id: true })
  .merge(
    z.object({ ingredients: RecipeIngredientSchema.array().optional() })
  )
export const UpdateRecipeSchema = InsertRecipeSchema.partial();
export type Recipe = z.infer<typeof RecipeSchema>;
export type InsertRecipeType = z.infer<typeof InsertRecipeSchema>;
export type UpdateRecipeType = z.infer<typeof UpdateRecipeSchema>;
