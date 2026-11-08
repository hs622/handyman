import { drizzle } from "drizzle-orm/postgres-js";
import { services, type NewService } from "../src/db/schema";
import { connect } from "./_shared";

// Idempotent: safe to run on every deploy.
const seedServices: NewService[] = [
  { slug: "plumbing-repair", name: "Plumbing repair", priceCents: 12000 },
  { slug: "electrical-fix", name: "Electrical fix", priceCents: 15000 },
  { slug: "furniture-assembly", name: "Furniture assembly", priceCents: 8000 },
  { slug: "drywall-patch", name: "Drywall patch", priceCents: 9500 },
];

async function main() {
  const sql = connect();
  try {
    const db = drizzle(sql);
    const inserted = await db
      .insert(services)
      .values(seedServices)
      .onConflictDoNothing({ target: services.slug })
      .returning({ slug: services.slug });
    console.log(
      `Seeded ${inserted.length} new service(s) (${seedServices.length - inserted.length} already present)`,
    );
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
