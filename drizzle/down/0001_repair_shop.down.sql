-- Reverts 0001_repair_shop: drops repair-shop tables/enums and restores the original services shape.
DROP TABLE IF EXISTS "reviews";
DROP TABLE IF EXISTS "booking_events";
DROP TABLE IF EXISTS "bookings";

DELETE FROM "services";
ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_category_id_device_categories_id_fk";
DROP INDEX IF EXISTS "services_category_idx";
ALTER TABLE "services"
  DROP COLUMN IF EXISTS "category_id",
  DROP COLUMN IF EXISTS "name_fr",
  DROP COLUMN IF EXISTS "description",
  DROP COLUMN IF EXISTS "description_fr",
  DROP COLUMN IF EXISTS "price_from_cents",
  DROP COLUMN IF EXISTS "turnaround",
  DROP COLUMN IF EXISTS "turnaround_fr",
  DROP COLUMN IF EXISTS "is_active",
  DROP COLUMN IF EXISTS "sort",
  ADD COLUMN "price_cents" integer NOT NULL;

DROP TABLE IF EXISTS "device_categories";

DROP TYPE IF EXISTS "public"."booking_status";
DROP TYPE IF EXISTS "public"."review_status";
DROP TYPE IF EXISTS "public"."time_slot";
DROP TYPE IF EXISTS "public"."locale";
