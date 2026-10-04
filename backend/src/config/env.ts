import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [
        'https://databasegenrator.vercel.app',
        'http://localhost:3000',
        'http://localhost:3002',
      ],
  SUPABASE_URL: requireEnv('SUPABASE_URL'),
  SUPABASE_ANON_KEY: requireEnv('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  GROQ_API_KEY: requireEnv('GROQ_API_KEY'),
  GROQ_MODEL: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'DB-Generator Studio <onboarding@resend.dev>',
  APP_URL:
    process.env.APP_URL ||
    process.env.FRONTEND_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://databasegenrator.vercel.app'
      : 'http://localhost:3000'),
};
