-- Replace isActive (Boolean) with deactivatedAt (DateTime?) on Employee, Product and Company
-- NULL = active, timestamp = deactivated at that point in time

ALTER TABLE "Employee" DROP COLUMN IF EXISTS "isActive";
ALTER TABLE "Employee" ADD COLUMN "deactivatedAt" TIMESTAMP(3);

ALTER TABLE "Product" DROP COLUMN IF EXISTS "isActive";
ALTER TABLE "Product" ADD COLUMN "deactivatedAt" TIMESTAMP(3);

ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "deactivatedAt" TIMESTAMP(3);
