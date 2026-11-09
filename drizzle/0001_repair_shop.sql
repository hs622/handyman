CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'received', 'diagnosing', 'repairing', 'ready', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('en', 'fr');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('published', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."time_slot" AS ENUM('morning', 'afternoon', 'evening');--> statement-breakpoint
CREATE TABLE "booking_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" uuid NOT NULL,
	"status" "booking_status" NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"customer_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"category_id" integer NOT NULL,
	"service_id" integer,
	"device_brand" text NOT NULL,
	"device_model" text NOT NULL,
	"issue" text NOT NULL,
	"preferred_date" date NOT NULL,
	"preferred_slot" time_slot NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"quote_cents" integer,
	"locale" "locale" DEFAULT 'en' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "device_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"name_fr" text NOT NULL,
	"icon" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "device_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" uuid NOT NULL,
	"rating" smallint NOT NULL,
	"body" text NOT NULL,
	"display_name" text NOT NULL,
	"status" "review_status" DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_booking_id_unique" UNIQUE("booking_id"),
	CONSTRAINT "reviews_rating_range" CHECK ("reviews"."rating" between 1 and 5)
);
--> statement-breakpoint
ALTER TABLE "booking_events" ADD CONSTRAINT "booking_events_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_category_id_device_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."device_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_events_booking_idx" ON "booking_events" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bookings_created_idx" ON "bookings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "reviews_status_created_idx" ON "reviews" USING btree ("status","created_at");--> statement-breakpoint
-- The example services from 0000 have no category; clear them before adding NOT NULL columns.
DELETE FROM "services";--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN "price_cents";--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "category_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "name_fr" text NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "description_fr" text NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "price_from_cents" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "turnaround" text NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "turnaround_fr" text NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "sort" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_device_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."device_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "services_category_idx" ON "services" USING btree ("category_id");