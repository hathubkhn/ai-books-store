// Volume discount configuration
export const VOLUME_DISCOUNTS = {
  1: 0,    // No additional discount for 1 book
  2: 5,    // +5% for 2 books
  3: 8,    // +8% for 3 books
  4: 10,   // +10% for 4+ books
};

export interface BundleItem {
  bookId: number;
  price: number;
  isRequired: boolean;
}

export interface BundleCalculation {
  originalTotal: number;
  bundleDiscount: number;
  bundleDiscountAmount: number;
  volumeDiscount: number;
  volumeDiscountAmount: number;
  finalTotal: number;
  savingsAmount: number;
  savingsPercent: number;
  itemCount: number;
}

export function calculateBundlePrice(
  items: BundleItem[],
  selectedBookIds: number[],
  bundleDiscountType: "PERCENTAGE" | "FIXED_AMOUNT",
  bundleDiscountValue: number
): BundleCalculation {
  // Filter to only selected books
  const selectedItems = items.filter((item) =>
    selectedBookIds.includes(item.bookId)
  );

  if (selectedItems.length === 0) {
    return {
      originalTotal: 0,
      bundleDiscount: 0,
      bundleDiscountAmount: 0,
      volumeDiscount: 0,
      volumeDiscountAmount: 0,
      finalTotal: 0,
      savingsAmount: 0,
      savingsPercent: 0,
      itemCount: 0,
    };
  }

  // Calculate original total
  const originalTotal = selectedItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  // Apply bundle discount
  let bundleDiscountAmount = 0;
  if (bundleDiscountType === "PERCENTAGE") {
    bundleDiscountAmount = (originalTotal * bundleDiscountValue) / 100;
  } else {
    bundleDiscountAmount = bundleDiscountValue;
  }

  const afterBundleDiscount = originalTotal - bundleDiscountAmount;

  // Apply volume discount
  const itemCount = selectedItems.length;
  const volumeDiscountPercent =
    VOLUME_DISCOUNTS[itemCount as keyof typeof VOLUME_DISCOUNTS] ||
    VOLUME_DISCOUNTS[4]; // 4+ books get max discount

  const volumeDiscountAmount =
    (afterBundleDiscount * volumeDiscountPercent) / 100;

  const finalTotal = afterBundleDiscount - volumeDiscountAmount;
  const savingsAmount = originalTotal - finalTotal;
  const savingsPercent = (savingsAmount / originalTotal) * 100;

  return {
    originalTotal,
    bundleDiscount: bundleDiscountType === "PERCENTAGE" ? bundleDiscountValue : 0,
    bundleDiscountAmount,
    volumeDiscount: volumeDiscountPercent,
    volumeDiscountAmount,
    finalTotal: Math.max(0, finalTotal),
    savingsAmount,
    savingsPercent,
    itemCount,
  };
}
