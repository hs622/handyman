import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import {
  MIGRATIONS_DIR,
  MIGRATIONS_SCHEMA,
  MIGRATIONS_TABLE,
  appliedCount,
  connect,
  setOutput,
} from "./_shared";

async function main() {
  const sql = connect();
  try {
    const before = await appliedCount(sql);
    await migrate(drizzle(sql), {
      migrationsFolder: MIGRATIONS_DIR,
      migrationsSchema: MIGRATIONS_SCHEMA,
      migrationsTable: MIGRATIONS_TABLE,
    });
    const after = await appliedCount(sql);
    const applied = after - before;
    console.log(`Migrations: ${before} → ${after} (${applied} newly applied)`);
    setOutput("applied", applied);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
