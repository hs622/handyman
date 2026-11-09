import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { type BookingStatus, bookings, deviceCategories, reviews, services } from "@/db/schema";

export async function listBookings(status?: BookingStatus) {
  return getDb().query.bookings.findMany({
    where: status ? eq(bookings.status, status) : undefined,
    orderBy: desc(bookings.createdAt),
    limit: 200,
    with: { service: { columns: { name: true } }, category: { columns: { name: true } } },
  });
}

export async function getBooking(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return (
    (await getDb().query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: {
        service: { columns: { name: true } },
        category: { columns: { name: true } },
        events: { orderBy: (e, { desc }) => [desc(e.createdAt), desc(e.id)] },
        review: true,
      },
    })) ?? null
  );
}

export async function listAllReviews() {
  return getDb()
    .select({
      id: reviews.id,
      rating: reviews.rating,
      body: reviews.body,
      displayName: reviews.displayName,
      status: reviews.status,
      createdAt: reviews.createdAt,
      bookingId: bookings.id,
      bookingCode: bookings.code,
      device: bookings.deviceModel,
    })
    .from(reviews)
    .innerJoin(bookings, eq(reviews.bookingId, bookings.id))
    .orderBy(desc(reviews.createdAt));
}

export async function listAllServices() {
  return getDb()
    .select({
      id: services.id,
      name: services.name,
      slug: services.slug,
      priceFromCents: services.priceFromCents,
      turnaround: services.turnaround,
      turnaroundFr: services.turnaroundFr,
      isActive: services.isActive,
      category: deviceCategories.name,
    })
    .from(services)
    .innerJoin(deviceCategories, eq(services.categoryId, deviceCategories.id))
    .orderBy(deviceCategories.sort, services.sort);
}
