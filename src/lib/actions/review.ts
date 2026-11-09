"use server";

import { updateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { bookings, reviews } from "@/db/schema";
import type { ErrorKey } from "@/i18n/dictionaries";
import { normalizeBookingCode } from "@/lib/booking-code";
import { normalizePhone } from "@/lib/phone";

export type ReviewFormState = {
  ok?: boolean;
  message?: ErrorKey;
  errors?: Partial<Record<string, ErrorKey[]>>;
};

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, { message: "rating" }).max(5, { message: "rating" }),
  displayName: z.string().trim().min(2, { message: "displayName" }).max(40),
  body: z.string().trim().min(10, { message: "reviewBody" }).max(800),
});

export async function submitReview(_prev: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  const code = normalizeBookingCode(String(formData.get("code") ?? ""));
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  if (!phone) return { message: "verify" };

  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating") || 0,
    displayName: formData.get("displayName"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors as Partial<Record<string, ErrorKey[]>> };
  }

  const db = getDb();
  const booking = await db.query.bookings.findFirst({
    where: and(eq(bookings.code, code), eq(bookings.phone, phone)),
    columns: { id: true, status: true },
  });
  if (!booking) return { message: "verify" };
  if (booking.status !== "completed") return { message: "notCompleted" };

  const inserted = await db
    .insert(reviews)
    .values({ bookingId: booking.id, ...parsed.data })
    .onConflictDoNothing({ target: reviews.bookingId })
    .returning({ id: reviews.id });
  if (inserted.length === 0) return { message: "alreadyReviewed" };

  updateTag("reviews");
  return { ok: true, message: "reviewLive" };
}
