import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import {
  MIGRATIONS_SCHEMA,
  MIGRATIONS_TABLE,
  appliedCount,
  connect,
  downFileFor,
  hasDownFile,
  readJournal,
} from "./_shared";

/**
 * Roll back the last N applied Drizzle migrations using hand-written
 * drizzle/down/<tag>.down.sql files. Everything runs in one transaction.
 *
 *   pnpm db:rollback            # last 1
 *   pnpm db:rollback --steps 2
 */
async function main() {
  const { values } = parseArgs({ options: { steps: { type: "string", default: "1" } } });
  const steps = Number(values.steps);
  if (!Number.isInteger(steps) || steps < 0)
    throw new Error(`--steps must be a non-negative integer, got "${values.steps}"`);
  if (steps === 0) return console.log("Nothing to roll back (steps=0).");

  const journal = readJournal();
  const sql = connect();
  try {
    if ((await appliedCount(sql)) === 0) return console.log("No migrations applied; nothing to roll back.");

    const rows = await sql<{ id: number; created_at: string }[]>`
      select id, created_at from ${sql(MIGRATIONS_SCHEMA)}.${sql(MIGRATIONS_TABLE)}
      order by created_at desc limit ${steps}`;

    const plan = rows.map((row) => {
      const entry = journal.find((e) => e.when === Number(row.created_at));
      if (!entry)
        throw new Error(`Applied migration (created_at=${row.created_at}) not found in _journal.json`);
      if (!hasDownFile(entry.tag)) throw new Error(`Missing down file: ${downFileFor(entry.tag)}`);
      return { id: row.id, tag: entry.tag };
    });

    await sql.begin(async (tx) => {
      for (const { id, tag } of plan) {
        console.log(`↩︎  Rolling back ${tag}`);
        await tx.unsafe(readFileSync(downFileFor(tag), "utf8"));
        await tx`delete from ${tx(MIGRATIONS_SCHEMA)}.${tx(MIGRATIONS_TABLE)} where id = ${id}`;
      }
    });
    console.log(`Rolled back ${plan.length} migration(s).`);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
