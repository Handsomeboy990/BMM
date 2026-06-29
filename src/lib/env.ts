import { z } from "zod";

/**
 * Validation centralisée des variables d'environnement.
 * Toute variable manquante ou invalide fait échouer le démarrage,
 * ce qui évite les erreurs silencieuses en production.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  NEXT_PUBLIC_APP_URL: z.string().url(),

  DATABASE_URL: z.string().url(),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Variables d'environnement invalides:\n${issues}`);
}

export const env = parsed.data;

export type Env = typeof env;
