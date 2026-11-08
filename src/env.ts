import { z } from "zod";

const serverEnvSchema = z.object({
  // Supabase transaction pooler (port 6543) — used by the app at runtime.
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

let cached: z.infer<typeof serverEnvSchema> | undefined;

/** Validated server-only env. Read lazily so `next build` works without DB secrets. */
export function serverEnv() {
  cached ??= serverEnvSchema.parse(process.env);
  return cached;
}
