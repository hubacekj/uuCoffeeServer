import {
  createInsertSchema, createSelectSchema,
} from 'drizzle-zod';
import type { z } from 'zod';
import { ingredients } from '../../../db/schema';

export const IngredientSchema = createSelectSchema(ingredients);
export const InsertIngredientWithIdSchema = createInsertSchema(ingredients);
export const InsertIngredientSchema = InsertIngredientWithIdSchema.omit({ id: true });
export const UpdateIngredientSchema = InsertIngredientSchema.partial();
export type Ingredient = z.infer<typeof IngredientSchema>;
export type InsertIngredientType = z.infer<typeof InsertIngredientSchema>;
export type UpdateIngredientType = z.infer<typeof UpdateIngredientSchema>;
