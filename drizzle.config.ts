import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema',
  driver: 'better-sqlite',
  dbCredentials: {
    url: `${process.env.DATABASE_LOCATION}${process.env.DATABASE_FILENAME}`,
  },
  out: './drizzle',
} satisfies Config;
