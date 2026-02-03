import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().optional().default(3001),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  CALLBACK_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  BREVO_API_KEY: z.string().min(1, 'Brevo API key is required'),
  BREVO_SENDER_EMAIL: z.string().email('Invalid sender email'),
  BREVO_SENDER_NAME: z.string().default('Nexu App'),
});

export type Env = z.infer<typeof envSchema>;