"use server";

import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { TIME_SLOTS, bookingEvents, bookings, deviceCategories, services } from "@/db/schema";
import { defaultLocale, hasLocale, localePath } from "@/i18n/config";
import type { ErrorKey } from "@/i18n/dictionaries";
import { generateBookingCode, normalizeBookingCode } from "@/lib/booking-code";
import { todayInShopTz } from "@/lib/format";
import { normalizePhone } from "@/lib/phone";
import { findBookingForCustomer, type CustomerBooking } from "@/lib/queries";

/** Errors are dictionary keys so the client can show them in the visitor's language. */
export type FieldErrors = Partial<Record<string, ErrorKey[]>>;
export type BookingFormState = { message?: ErrorKey; errors?: FieldErrors; values?: Record<string, string> };

const e = (key: ErrorKey) => ({ message: key });

const phoneField = z
  .string()
  .trim()
  .transform((v, ctx) => {
    const phone = normalizePhone(v);
    if (!phone) {
      ctx.addIssue({ code: "custom", message: "phone" });
      return z.NEVER;
    }
    return phone;
  });

const bookingSchema = z.object({
  customerName: z.string().trim().min(2, e("name")).max(80),
  phone: phoneField,
  email: z
    .union([z.literal(""), z.email(e("email"))])
    .optional()
    .transform((v) => v || null),
  categoryId: z.coerce.number(e("category")).int(e("category")).positive(e("category")),
  serviceId: z
    .union([z.literal(""), z.coerce.number().int().positive()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  deviceBrand: z.string().trim().min(1, e("brand")).max(60),
  deviceModel: z.string().trim().min(1, e("model")).max(80),
  issue: z.string().trim().min(10, e("issue")).max(1000),
  preferredDate: z.iso.date(e("date")).refine((d) => d >= todayInShopTz(), e("datePast")),
  preferredSlot: z.enum(TIME_SLOTS, e("slot")),
});

const UNIQUE_VIOLATION = "23505";

export async function createBooking(_prev: BookingFormState, formData: FormData): Promise<BookingFormState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([k]) => !k.startsWith("$")).map(([k, v]) => [k, String(v)]),
  );
  const lang = hasLocale(raw.lang ?? "") ? (raw.lang as "en" | "fr") : defaultLocale;

  // Honeypot: real users never see or fill this field.
  if (raw.company) return { message: "generic" };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      message: "fixFields",
      errors: z.flattenError(parsed.error).fieldErrors as FieldErrors,
      values: raw,
    };
  }
  const data = parsed.data;
  const db = getDb();

  const category = await db.query.deviceCategories.findFirst({
    where: eq(deviceCategories.id, data.categoryId),
  });
  if (!category) return { errors: { categoryId: ["category"] }, values: raw };

  if (data.serviceId) {
    const service = await db.query.services.findFirst({
      where: and(
        eq(services.id, data.serviceId),
        eq(services.categoryId, data.categoryId),
        eq(services.isActive, true),
      ),
    });
    if (!service) return { errors: { serviceId: ["service"] }, values: raw };
  }

  let code = "";
  for (let attempt = 0; attempt < 5 && !code; attempt++) {
    const candidate = generateBookingCode();
    try {
      await db.transaction(async (tx) => {
        const [booking] = await tx
          .insert(bookings)
          .values({ ...data, code: candidate, locale: lang })
          .returning({ id: bookings.id });
        await tx.insert(bookingEvents).values({ bookingId: booking.id, status: "pending" });
      });
      code = candidate;
    } catch (err) {
      const pgCode =
        (err as { cause?: { code?: string }; code?: string }).cause?.code ?? (err as { code?: string }).code;
      if (pgCode !== UNIQUE_VIOLATION) throw err;
    }
  }
  if (!code) return { message: "bookingFailed", values: raw };

  redirect(localePath(lang, `/book/success?code=${code}`));
}

// ── Tracking ────────────────────────────────────────────────────────────────

export type TrackState = { message?: ErrorKey; booking?: CustomerBooking; phone?: string; code?: string };

export async function trackBooking(_prev: TrackState, formData: FormData): Promise<TrackState> {
  const code = normalizeBookingCode(String(formData.get("code") ?? ""));
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const notFound: TrackState = { message: "notFound", code };

  if (code.length !== 9 || !phone) return notFound;
  const booking = await findBookingForCustomer(code, phone);
  if (!booking) return notFound;
  return { booking, phone, code };
}
