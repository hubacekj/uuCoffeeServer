import { Router } from 'express';

import recipes from './recipes/recipes.routes';
import ingredients from './ingredients/ingredients.routes';

const router = Router();

router.get('/', (_, res) => {
  res.json({
    message: 'Welcome to uuCoffeeApi',
  });
});

router.use('/recipes', recipes);
router.use('/ingredients', ingredients);

export default router;
