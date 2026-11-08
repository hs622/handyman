import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { serverEnv } from "@/env";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as { __db?: Db };

/** Singleton Drizzle client. `prepare: false` is required for Supabase's transaction pooler. */
export function getDb(): Db {
  if (!globalForDb.__db) {
    const client = postgres(serverEnv().DATABASE_URL, { prepare: false, max: 5 });
    globalForDb.__db = drizzle(client, { schema });
  }
  return globalForDb.__db;
}
