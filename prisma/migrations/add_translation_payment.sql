-- Add translation fields to Book
ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS "translationSource" TEXT;
ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS "originalTitle" TEXT;

-- Update OrderStatus enum
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'CONFIRMED', 'PACKING', 'SHIPPING', 'COMPLETED', 'CANCELLED');

-- Update Order table status column
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus" USING 
  CASE 
    WHEN "status"::text = 'PENDING' THEN 'PENDING_PAYMENT'::

"OrderStatus"
    ELSE "status"::text::"OrderStatus"
  END;
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT'::"OrderStatus";

-- Drop old enum
DROP TYPE "OrderStatus_old";

-- Add payment tracking fields to Order
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'bank_transfer';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentProof" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentConfirmedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentConfirmedBy" TEXT;
