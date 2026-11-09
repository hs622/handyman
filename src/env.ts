import "server-only";
import { z } from "zod";

// Read lazily so `next build` and DB scripts work without unrelated secrets.

const dbEnvSchema = z.object({
  // Supabase transaction pooler (port 6543) — used by the app at runtime.
  DATABASE_URL: z.url(),
});

const adminEnvSchema = z.object({
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD must be at least 8 characters"),
  // Generate with: openssl rand -base64 32
  ADMIN_SESSION_SECRET: z.string().min(32, "ADMIN_SESSION_SECRET must be at least 32 characters"),
});

let dbEnv: z.infer<typeof dbEnvSchema> | undefined;
let adminEnv: z.infer<typeof adminEnvSchema> | undefined;

export function serverEnv() {
  dbEnv ??= dbEnvSchema.parse(process.env);
  return dbEnv;
}

export function getAdminEnv() {
  adminEnv ??= adminEnvSchema.parse(process.env);
  return adminEnv;
}
