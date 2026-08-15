import { prisma } from "./db";
import { normalizeVietnamesePhone } from "./phone";
import { siteConfig } from "@/config/site";
import { PromotionType } from "@prisma/client";

export interface PromotionResult {
  normalizedPhone: string;
  isNewCustomer: boolean;
  isEarlyBuyer: boolean;
  isReturningCustomer: boolean;
  discountPercent: number;
  promotionType: PromotionType | null;
}

/**
 * Calculate promotion eligibility for a customer and specific book
 */
export async function getCustomerPromotion(
  phone: string,
  bookId?: number
): Promise<PromotionResult> {
  const normalizedPhone = normalizeVietnamesePhone(phone);

  // Check if customer exists
  const customer = await prisma.customer.findUnique({
    where: { phone: normalizedPhone },
    include: {
      orders: {
        select: { 
          id: true,
          items: {
            select: { bookId: true }
          }
        },
      },
    },
  });

  const isNewCustomer = !customer;
  const hasOrders = customer && customer.orders.length > 0;

  let discountPercent = 0;
  let promotionType: PromotionType | null = null;
  let isEarlyBuyer = false;
  let isReturningCustomer = false;

  if (isNewCustomer && bookId) {
    // New customer - check if they qualify for early buyer discount for this book
    // Count unique customers who have ordered this book
    const ordersWithBook = await prisma.order.findMany({
      where: {
        items: {
          some: {
            bookId: bookId,
          },
        },
      },
      select: {
        customerId: true,
      },
      distinct: ['customerId'],
    });

    const bookOrderCount = ordersWithBook.length;
    
    if (bookOrderCount < siteConfig.earlyBuyerLimit) {
      isEarlyBuyer = true;
      discountPercent = siteConfig.earlyBuyerDiscount;
      promotionType = PromotionType.EARLY_BUYER_10;
    }
  } else if (hasOrders) {
    // Returning customer
    isReturningCustomer = true;
    discountPercent = siteConfig.returningCustomerDiscount;
    promotionType = PromotionType.RETURNING_CUSTOMER_10;
  }

  return {
    normalizedPhone,
    isNewCustomer,
    isEarlyBuyer,
    isReturningCustomer,
    discountPercent,
    promotionType,
  };
}

/**
 * Calculate order totals with promotion
 */
export function calculateOrderTotal(
  unitPrice: number,
  quantity: number,
  discountPercent: number
): {
  subtotal: number;
  discountAmount: number;
  total: number;
} {
  const subtotal = unitPrice * quantity;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discountAmount;

  return {
    subtotal,
    discountAmount,
    total,
  };
}
