import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema/index';

const client = new Database(`${process.env.DATABASE_LOCATION}${process.env.DATABASE_FILENAME}`, { create: true });

export const db = drizzle(client, { schema });
