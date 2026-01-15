import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().optional().default(3001),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;