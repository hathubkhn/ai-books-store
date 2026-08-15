/**
 * Format number to Vietnamese currency
 * 329000 → 329,000₫
 */
export function formatVND(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return "0₫";
  
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(num) + "₫";
}

/**
 * Parse VND string back to number
 * "329,000₫" → 329000
 */
export function parseVND(vndString: string): number {
  return parseInt(vndString.replace(/[^\d]/g, ""), 10) || 0;
}
