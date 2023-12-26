import { integer, text, sqliteTable, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const recipes = sqliteTable('recipes', {
  id: integer('id', { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  imageUrl: text('imageUrl'),
  favorite: integer('favorite', { mode: 'boolean' }).default(false).notNull(),
  portionAmount: integer('portionAmount').notNull(),
  preparationTime: integer('preparationTime').notNull(),
});

export const recipeRelations = relations(recipes, ({ many }) => ({
  ingredients: many(recipeIngredients)
}))

export const ingredients = sqliteTable('ingredients', {
  id: integer('id', { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  unit: text('unit').notNull(),
});

export const ingredientRelations = relations(ingredients, ({ many }) => ({
  recipes: many(recipeIngredients)
}))

export const recipeIngredients = sqliteTable('recipe_ingredients', {
  recipeId: integer('recipeId').notNull().references(() => recipes.id),
  ingredientId: integer('ingredientId').notNull().references(() => ingredients.id),
  amount: integer('amount').notNull(),
},
  (t) => ({
    pk: primaryKey({ columns: [t.recipeId, t.ingredientId] }),
  })
);

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id]
  }),
  ingredient: one(ingredients, {
    fields: [recipeIngredients.ingredientId],
    references: [ingredients.id]
  }),
}))
