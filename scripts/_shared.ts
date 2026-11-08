import "dotenv/config";
import { readFileSync, existsSync, appendFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";

export const MIGRATIONS_DIR = path.resolve(process.cwd(), "drizzle");
export const DOWN_DIR = path.join(MIGRATIONS_DIR, "down");
export const MIGRATIONS_SCHEMA = "drizzle";
export const MIGRATIONS_TABLE = "__drizzle_migrations";

export type JournalEntry = { idx: number; when: number; tag: string };

export function readJournal(): JournalEntry[] {
  const file = path.join(MIGRATIONS_DIR, "meta", "_journal.json");
  return (JSON.parse(readFileSync(file, "utf8")) as { entries: JournalEntry[] }).entries;
}

export function downFileFor(tag: string) {
  return path.join(DOWN_DIR, `${tag}.down.sql`);
}

export function hasDownFile(tag: string) {
  return existsSync(downFileFor(tag));
}

/** DDL connection: Supabase direct or session pooler (port 5432), never the transaction pooler. */
export function connect() {
  const url = process.env.DIRECT_URL;
  if (!url) throw new Error("DIRECT_URL is not set");
  return postgres(url, { max: 1, prepare: false, onnotice: () => {} });
}

export async function appliedCount(sql: postgres.Sql): Promise<number> {
  const [{ exists }] = await sql<{ exists: boolean }[]>`
    select to_regclass(${`${MIGRATIONS_SCHEMA}.${MIGRATIONS_TABLE}`}) is not null as exists`;
  if (!exists) return 0;
  const [{ count }] = await sql<{ count: number }[]>`
    select count(*)::int as count from ${sql(MIGRATIONS_SCHEMA)}.${sql(MIGRATIONS_TABLE)}`;
  return count;
}

/** Write a step output when running inside GitHub Actions. */
export function setOutput(name: string, value: string | number) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}
