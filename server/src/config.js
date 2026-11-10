import 'dotenv/config';
import { z } from 'zod';

// Treat empty strings in .env as "not set".
const raw = Object.fromEntries(Object.entries(process.env).filter(([, v]) => v !== ''));

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  SERVER_URL: z.string().url().default('http://localhost:4000'),
  CLIENT_URL: z.string().min(1).default('http://localhost:5173'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_SENDER_NAME: z.string().default('Webhead Solutions'),
  OWNER_EMAIL: z.string().email().optional(),
  BREVO_LIST_LEADS: z.coerce.number().int().positive().optional(),
  BREVO_LIST_NEWSLETTER: z.coerce.number().int().positive().optional(),
  RESPONSE_TIME: z.string().default('one business day'),
});

const parsed = schema.safeParse(raw);
if (!parsed.success) {
  const lines = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  console.error(`Invalid environment configuration:\n${lines}\nSee server/.env.example`);
  process.exit(1);
}
const env = parsed.data;

const clientUrls = env.CLIENT_URL.split(',').map((s) => s.trim().replace(/\/$/, '')).filter(Boolean);

export const config = {
  env: env.NODE_ENV,
  isProd: env.NODE_ENV === 'production',
  port: env.PORT,
  serverUrl: env.SERVER_URL.replace(/\/$/, ''),
  clientUrls,
  clientUrl: clientUrls[0],
  supabase: { url: env.SUPABASE_URL, key: env.SUPABASE_SERVICE_ROLE_KEY },
  brevo: {
    apiKey: env.BREVO_API_KEY,
    senderEmail: env.BREVO_SENDER_EMAIL,
    senderName: env.BREVO_SENDER_NAME,
    ownerEmail: env.OWNER_EMAIL,
    leadsList: env.BREVO_LIST_LEADS,
    newsletterList: env.BREVO_LIST_NEWSLETTER,
  },
  responseTime: env.RESPONSE_TIME,
  emailEnabled: Boolean(env.BREVO_API_KEY && env.BREVO_SENDER_EMAIL),
};
