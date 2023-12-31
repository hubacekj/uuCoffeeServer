# uuCoffeeApi Documentation

Backend API documentation for the uuCoffee application.

## Routes

### Ingredients

- GET /api/ingredients

  - gets all ingredients as JSON array

- GET /api/ingredients/:id

  - gets one ingredient by its id

- POST /api/ingredients

  - inserts one ingredient and returns it
  - body must be a JSON object with all required properties, id is ignored

- PUT /api/ingredients/:id

  - updates an ingredient by its id and returns it
  - body must be a JSON object with properties to be updated
  - no required properties, id is ignored

- DELETE /api/ingredients/:id
  - deletes an ingredient by its id, empty response
  - body is ignored

### Recipes

- GET /api/recipes

  - gets all recipes as JSON array

- GET /api/recipes/:id

  - gets one recipe by its id

- POST /api/recipes

  - inserts one recipe and returns it
  - body must be a JSON object with all required properties, id is ignored

- PUT /api/recipes/:id

  - updates a recipe by its id and returns it
  - body must be a JSON object with properties to be updated
  - no required properties, id is ignored

- DELETE /api/recipes/:id
  - deletes a recipe by its id, empty response
  - body is ignored

---

## Entities

### Ingredients

| Property | Type                 | Required | Default       | Notes       |
| -------- | -------------------- | -------- | ------------- | ----------- |
| id       | number               | true     | autoincrement | Primary key |
| name     | string               | true     |               | unique      |
| unit     | string               | true     |               |             |
| recipes  | {recipeId: number}[] | false    |               | foreign key |

### Recipes

| Property        | Type                                     | Required | Default       | Notes                                   |
| --------------- | ---------------------------------------- | -------- | ------------- | --------------------------------------- |
| id              | number                                   | true     | autoincrement | Primary key                             |
| name            | string                                   | true     |               | unique                                  |
| description     | string                                   | true     |               |                                         |
| imageUrl        | string                                   | false    |               |                                         |
| favorite        | boolean                                  | false    | false         |                                         |
| portionAmount   | number                                   | true     |               | in mililiters                           |
| preparationTime | number                                   | true     |               | in minutes                              |
| ingredients     | {ingredientId: number, amount: number}[] | false    |               | foreign key, amount in ingredient units |
