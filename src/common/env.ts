import 'dotenv/config';
import { z } from 'zod';
const boolean = z.enum(['true','false']).transform(v => v === 'true');
const schema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  APP_ORIGIN: z.string().url().default('http://localhost:3000'),
  MYSQL_HOST: z.string().default('127.0.0.1'),
  MYSQL_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
  MYSQL_DATABASE: z.string().regex(/^[a-zA-Z0-9_]+$/).default('mare'),
  MYSQL_USER: z.string().min(1).default('mare'),
  MYSQL_PASSWORD: z.string().min(1),
  MYSQL_SSL_CA_FILE: z.string().optional(),
  ENABLE_DOCS: boolean.default(false),
  OPEN_METEO_API_KEY: z.string().optional(),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) throw new Error('Invalid environment: ' + parsed.error.issues.map(i => i.path.join('.') + ': ' + i.message).join('; '));
export const env = parsed.data;
if (new URL(env.APP_ORIGIN).origin !== env.APP_ORIGIN) throw new Error('APP_ORIGIN must be an origin without a trailing slash or path');
if (env.NODE_ENV === 'production' && (!env.APP_ORIGIN.startsWith('https://') || env.MYSQL_PASSWORD.length < 16)) throw new Error('Production requires an HTTPS APP_ORIGIN and a database password of at least 16 characters');
