/**
 * Normalize Vietnamese phone numbers to standard format
 * Converts +84912345678, 84912345678 → 0912345678
 */
export function normalizeVietnamesePhone(phone: string): string {
  // Remove all spaces, dashes, parentheses
  let normalized = phone.replace(/[\s\-()]/g, "");

  // Remove +84 prefix and convert to 0
  if (normalized.startsWith("+84")) {
    normalized = "0" + normalized.slice(3);
  } else if (normalized.startsWith("84")) {
    normalized = "0" + normalized.slice(2);
  }

  return normalized;
}

/**
 * Validate Vietnamese mobile phone number
 * Format: 0XXXXXXXXX (10 digits starting with 0)
 */
export function isValidVietnamesePhone(phone: string): boolean {
  const normalized = normalizeVietnamesePhone(phone);
  
  // Vietnamese mobile: 0 + 9 digits
  // Valid prefixes: 03, 05, 07, 08, 09
  const vietnameseMobileRegex = /^0[3|5|7|8|9][0-9]{8}$/;
  
  return vietnameseMobileRegex.test(normalized);
}

/**
 * Mask phone number for display
 * 0912345678 → 0912***678
 */
export function maskPhone(phone: string): string {
  if (phone.length < 10) return phone;
  return phone.slice(0, 4) + "***" + phone.slice(-3);
}
