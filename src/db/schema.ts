import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────────────────────
export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "received",
  "diagnosing",
  "repairing",
  "ready",
  "completed",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const TIME_SLOTS = ["morning", "afternoon", "evening"] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

export const REVIEW_STATUSES = ["published", "hidden"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const LOCALES = ["en", "fr"] as const;
export const bookingStatus = pgEnum("booking_status", BOOKING_STATUSES);
export const timeSlot = pgEnum("time_slot", TIME_SLOTS);
export const reviewStatus = pgEnum("review_status", REVIEW_STATUSES);
export const locale = pgEnum("locale", LOCALES);

// ── Catalog ──────────────────────────────────────────────────────────────────
export const deviceCategories = pgTable("device_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameFr: text("name_fr").notNull(),
  /** lucide-react icon name, e.g. "smartphone" */
  icon: text("icon").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => deviceCategories.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    nameFr: text("name_fr").notNull(),
    description: text("description").notNull(),
    descriptionFr: text("description_fr").notNull(),
    /** Starting price in CAD cents, before tax. */
    priceFromCents: integer("price_from_cents").notNull(),
    turnaround: text("turnaround").notNull(),
    turnaroundFr: text("turnaround_fr").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    sort: integer("sort").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("services_category_idx").on(t.categoryId)],
);

// ── Bookings ─────────────────────────────────────────────────────────────────
export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    customerName: text("customer_name").notNull(),
    /** E.164, e.g. +14165550123 */
    phone: text("phone").notNull(),
    email: text("email"),
    categoryId: integer("category_id")
      .notNull()
      .references(() => deviceCategories.id, { onDelete: "restrict" }),
    serviceId: integer("service_id").references(() => services.id, { onDelete: "set null" }),
    deviceBrand: text("device_brand").notNull(),
    deviceModel: text("device_model").notNull(),
    issue: text("issue").notNull(),
    preferredDate: date("preferred_date").notNull(),
    preferredSlot: timeSlot("preferred_slot").notNull(),
    status: bookingStatus("status").notNull().default("pending"),
    /** Quote in CAD cents, before tax. */
    quoteCents: integer("quote_cents"),
    /** Language the customer booked in — use it when calling/texting them. */
    locale: locale("locale").notNull().default("en"),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("bookings_status_idx").on(t.status), index("bookings_created_idx").on(t.createdAt)],
);

export const bookingEvents = pgTable(
  "booking_events",
  {
    id: serial("id").primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    status: bookingStatus("status").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("booking_events_booking_idx").on(t.bookingId)],
);

// ── Reviews ──────────────────────────────────────────────────────────────────
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .unique()
      .references(() => bookings.id, { onDelete: "cascade" }),
    rating: smallint("rating").notNull(),
    body: text("body").notNull(),
    displayName: text("display_name").notNull(),
    status: reviewStatus("status").notNull().default("published"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("reviews_rating_range", sql`${t.rating} between 1 and 5`),
    index("reviews_status_created_idx").on(t.status, t.createdAt),
  ],
);

// ── Relations ────────────────────────────────────────────────────────────────
export const deviceCategoriesRelations = relations(deviceCategories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  category: one(deviceCategories, { fields: [services.categoryId], references: [deviceCategories.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  category: one(deviceCategories, { fields: [bookings.categoryId], references: [deviceCategories.id] }),
  service: one(services, { fields: [bookings.serviceId], references: [services.id] }),
  events: many(bookingEvents),
  review: one(reviews),
}));

export const bookingEventsRelations = relations(bookingEvents, ({ one }) => ({
  booking: one(bookings, { fields: [bookingEvents.bookingId], references: [bookings.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, { fields: [reviews.bookingId], references: [bookings.id] }),
}));

export type DeviceCategory = typeof deviceCategories.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type BookingEvent = typeof bookingEvents.$inferSelect;
export type Review = typeof reviews.$inferSelect;
