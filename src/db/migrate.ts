import { Database } from 'bun:sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';

const client = new Database(`${process.env.DATABASE_LOCATION}${process.env.DATABASE_FILENAME}`, { create: true });
const db = drizzle(client, { schema });

// This will run migrations on the database, skipping the ones already applied
migrate(db, { migrationsFolder: './drizzle' });

client.close();
