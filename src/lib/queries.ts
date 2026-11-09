import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, avg, count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { bookings, deviceCategories, reviews, services } from "@/db/schema";

// ── Public, cached reads (invalidated by updateTag in admin/review actions) ──

export async function getCategories() {
  "use cache";
  cacheLife("max");
  cacheTag("services");
  return getDb().select().from(deviceCategories).orderBy(asc(deviceCategories.sort));
}

export type ServiceWithCategory = Awaited<ReturnType<typeof getActiveServices>>[number];

export async function getActiveServices() {
  "use cache";
  cacheLife("max");
  cacheTag("services");
  return getDb()
    .select({
      id: services.id,
      slug: services.slug,
      name: services.name,
      nameFr: services.nameFr,
      description: services.description,
      descriptionFr: services.descriptionFr,
      priceFromCents: services.priceFromCents,
      turnaround: services.turnaround,
      turnaroundFr: services.turnaroundFr,
      categoryId: services.categoryId,
      categorySlug: deviceCategories.slug,
      categoryName: deviceCategories.name,
      categoryNameFr: deviceCategories.nameFr,
      categoryIcon: deviceCategories.icon,
    })
    .from(services)
    .innerJoin(deviceCategories, eq(services.categoryId, deviceCategories.id))
    .where(eq(services.isActive, true))
    .orderBy(asc(deviceCategories.sort), asc(services.sort));
}

export async function getServiceBySlug(slug: string) {
  const all = await getActiveServices();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function getReviewSummary() {
  "use cache";
  cacheLife("max");
  cacheTag("reviews");
  const db = getDb();
  const published = eq(reviews.status, "published");
  const [totals] = await db
    .select({ count: count(), avg: avg(reviews.rating) })
    .from(reviews)
    .where(published);
  const dist = await db
    .select({ rating: reviews.rating, count: count() })
    .from(reviews)
    .where(published)
    .groupBy(reviews.rating);
  const distribution = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: dist.find((d) => d.rating === r)?.count ?? 0,
  }));
  return { count: totals.count, average: totals.avg ? Number(totals.avg) : 0, distribution };
}

export async function getPublishedReviews(limit = 50) {
  "use cache";
  cacheLife("max");
  cacheTag("reviews");
  return getDb()
    .select({
      id: reviews.id,
      rating: reviews.rating,
      body: reviews.body,
      displayName: reviews.displayName,
      createdAt: reviews.createdAt,
      serviceName: services.name,
      serviceNameFr: services.nameFr,
      device: bookings.deviceModel,
    })
    .from(reviews)
    .innerJoin(bookings, eq(reviews.bookingId, bookings.id))
    .leftJoin(services, eq(bookings.serviceId, services.id))
    .where(eq(reviews.status, "published"))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}

// ── Customer booking lookup (uncached; requires code + phone) ───────────────

export async function findBookingForCustomer(code: string, phone: string) {
  const booking = await getDb().query.bookings.findFirst({
    where: and(eq(bookings.code, code), eq(bookings.phone, phone)),
    with: {
      service: { columns: { name: true, nameFr: true } },
      category: { columns: { name: true, nameFr: true } },
      events: { orderBy: (e, { asc }) => [asc(e.createdAt), asc(e.id)] },
      review: { columns: { id: true } },
    },
  });
  if (!booking) return null;
  return {
    code: booking.code,
    customerName: booking.customerName,
    device: `${booking.deviceBrand} ${booking.deviceModel}`,
    category: booking.category,
    service: booking.service ?? null,
    status: booking.status,
    quoteCents: booking.quoteCents,
    preferredDate: booking.preferredDate,
    preferredSlot: booking.preferredSlot,
    createdAt: booking.createdAt.toISOString(),
    events: booking.events.map((e) => ({
      id: e.id,
      status: e.status,
      note: e.note,
      createdAt: e.createdAt.toISOString(),
    })),
    hasReview: Boolean(booking.review),
  };
}

export type CustomerBooking = NonNullable<Awaited<ReturnType<typeof findBookingForCustomer>>>;
