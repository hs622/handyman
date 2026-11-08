import { downFileFor, hasDownFile, readJournal } from "./_shared";

const missing = readJournal().filter((e) => !hasDownFile(e.tag));
if (missing.length) {
  console.error("Every migration needs a rollback file. Missing:");
  for (const e of missing) console.error(`  - ${downFileFor(e.tag)}`);
  process.exit(1);
}
console.log("All migrations have down files ✔");
