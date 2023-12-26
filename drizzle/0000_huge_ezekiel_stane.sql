CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`unit` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recipe_ingredients` (
	`recipeId` integer NOT NULL,
	`ingredientId` integer NOT NULL,
	`amount` integer NOT NULL,
	PRIMARY KEY(`ingredientId`, `recipeId`),
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ingredientId`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`imageUrl` text,
	`favorite` integer DEFAULT false NOT NULL,
	`portionAmount` integer NOT NULL,
	`preparationTime` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ingredients_name_unique` ON `ingredients` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_name_unique` ON `recipes` (`name`);