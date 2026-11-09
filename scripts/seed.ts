import { inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../src/db/schema";
import {
  BOOKING_STATUSES,
  bookingEvents,
  bookings,
  deviceCategories,
  reviews,
  services,
} from "../src/db/schema";
import { categories, demoBookings, services as serviceSeeds } from "./seed-data";
import { connect } from "./_shared";

/**
 * Idempotent seed.
 *  - Always: device categories + services (insert-if-missing, so admin price edits are never overwritten).
 *  - SEED_DEMO=true: demo bookings, status timelines and reviews (preview/local only).
 */
async function main() {
  const sql = connect();
  try {
    const db = drizzle(sql, { schema });

    await db
      .insert(deviceCategories)
      .values([...categories])
      .onConflictDoNothing({ target: deviceCategories.slug });
    const cats = await db.select().from(deviceCategories);
    const catId = new Map(cats.map((c) => [c.slug, c.id]));

    const insertedServices = await db
      .insert(services)
      .values(serviceSeeds.map(({ category, ...s }) => ({ ...s, categoryId: catId.get(category)! })))
      .onConflictDoNothing({ target: services.slug })
      .returning({ id: services.id });
    console.log(`Catalog: ${cats.length} categories, ${insertedServices.length} new service(s)`);

    if (process.env.SEED_DEMO !== "true") return;

    const svcRows = await db
      .select({ id: services.id, slug: services.slug, categoryId: services.categoryId })
      .from(services)
      .where(
        inArray(
          services.slug,
          demoBookings.map((b) => b.service),
        ),
      );
    const svcBySlug = new Map(svcRows.map((s) => [s.slug, s]));

    let created = 0;
    for (const demo of demoBookings) {
      const svc = svcBySlug.get(demo.service);
      if (!svc) continue;
      const createdAt = new Date(Date.now() - demo.daysAgo * 86_400_000);

      await db.transaction(async (tx) => {
        const [booking] = await tx
          .insert(bookings)
          .values({
            code: demo.code,
            customerName: demo.customerName,
            phone: demo.phone,
            locale: demo.locale,
            categoryId: svc.categoryId,
            serviceId: svc.id,
            deviceBrand: demo.deviceBrand,
            deviceModel: demo.deviceModel,
            issue: demo.issue,
            preferredDate: createdAt.toISOString().slice(0, 10),
            preferredSlot: demo.slot,
            status: demo.status,
            quoteCents: demo.quoteCents,
            createdAt,
          })
          .onConflictDoNothing({ target: bookings.code })
          .returning({ id: bookings.id });
        if (!booking) return; // already seeded

        // Timeline: every status from "pending" up to the current one, 2h apart.
        const steps = BOOKING_STATUSES.slice(0, BOOKING_STATUSES.indexOf(demo.status) + 1);
        await tx.insert(bookingEvents).values(
          steps.map((status, i) => ({
            bookingId: booking.id,
            status,
            note:
              status === "diagnosing" && demo.quoteCents
                ? `Quote: $${(demo.quoteCents / 100).toFixed(2)}`
                : null,
            createdAt: new Date(createdAt.getTime() + i * 7_200_000),
          })),
        );

        if (demo.review) {
          await tx.insert(reviews).values({
            bookingId: booking.id,
            ...demo.review,
            createdAt: new Date(createdAt.getTime() + steps.length * 7_200_000),
          });
        }
        created++;
      });
    }
    const count = await db.$count(bookings);
    console.log(`Demo: ${created} new booking(s), ${count} total`);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
