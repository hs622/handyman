"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { BOOKING_STATUSES, REVIEW_STATUSES, bookingEvents, bookings, reviews, services } from "@/db/schema";
import { createAdminSession, destroyAdminSession, passwordMatches, requireAdmin } from "@/lib/admin-auth";

export type AdminFormState = { ok?: boolean; message?: string };

// ── Auth ────────────────────────────────────────────────────────────────────

export async function login(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const password = String(formData.get("password") ?? "");
  if (!password || !passwordMatches(password)) {
    await new Promise((r) => setTimeout(r, 500)); // slow down guessing
    return { message: "Incorrect password." };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  await destroyAdminSession();
  redirect("/admin/login");
}

// ── Bookings ────────────────────────────────────────────────────────────────

/** "165" / "165.5" / "165.50" (dollars) → 16550 (cents). */
const dollarsToCents = z
  .string()
  .trim()
  .regex(/^\d{1,6}(\.\d{1,2})?$/)
  .transform((v) => Math.round(Number(v) * 100));

const updateBookingSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
  quoteCents: z.union([z.literal("").transform(() => null), dollarsToCents]),
  note: z.string().trim().max(500),
  adminNotes: z.string().trim().max(2000),
});

export async function updateBooking(
  bookingId: string,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = updateBookingSchema.safeParse({
    status: formData.get("status"),
    quoteCents: String(formData.get("quote") ?? ""),
    note: formData.get("note") ?? "",
    adminNotes: formData.get("adminNotes") ?? "",
  });
  if (!parsed.success) return { message: "Invalid input." };
  const { status, quoteCents, note, adminNotes } = parsed.data;

  const db = getDb();
  await db.transaction(async (tx) => {
    const [current] = await tx
      .select({ status: bookings.status })
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .for("update");
    if (!current) throw new Error("Booking not found");

    await tx
      .update(bookings)
      .set({ status, quoteCents, adminNotes: adminNotes || null })
      .where(eq(bookings.id, bookingId));

    // The quote is shown separately on the tracking page (with tax), so only the admin's note goes in the timeline.
    if (status !== current.status || note) {
      await tx.insert(bookingEvents).values({ bookingId, status, note: note || null });
    }
  });

  refresh();
  return { ok: true, message: "Booking updated." };
}

// ── Reviews ─────────────────────────────────────────────────────────────────

export async function setReviewStatus(reviewId: number, status: (typeof REVIEW_STATUSES)[number]) {
  await requireAdmin();
  if (!REVIEW_STATUSES.includes(status)) throw new Error("Invalid status");
  await getDb().update(reviews).set({ status }).where(eq(reviews.id, reviewId));
  updateTag("reviews");
  refresh();
}

// ── Services ────────────────────────────────────────────────────────────────

const updateServiceSchema = z.object({
  priceFromCents: dollarsToCents,
  turnaround: z.string().trim().min(1).max(40),
  turnaroundFr: z.string().trim().min(1).max(40),
  isActive: z.boolean(),
});

export async function updateService(
  serviceId: number,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = updateServiceSchema.safeParse({
    priceFromCents: String(formData.get("price") ?? ""),
    turnaround: formData.get("turnaround"),
    turnaroundFr: formData.get("turnaroundFr"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { message: "Invalid input." };
  await getDb().update(services).set(parsed.data).where(eq(services.id, serviceId));
  updateTag("services");
  refresh();
  return { ok: true, message: "Saved." };
}
