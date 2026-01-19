import type { Config } from 'drizzle-kit';

export default {
  schema: './src/infra/db/schema/index.ts',
  out: './src/infra/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
  strict: true,
  verbose: true,
} satisfies Config;