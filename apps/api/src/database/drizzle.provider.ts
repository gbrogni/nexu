import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const drizzleProvider = {
  provide: DATABASE_CONNECTION,
  useFactory: async () => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    return drizzle(pool);
  },
};