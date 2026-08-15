# AI Books Store - Updates Summary

## ✅ Step 1: Fixed Book Cover Images

**Problem:** Book cover SVG images weren't loading
**Solution:** Added `unoptimized` prop to Next.js Image component in `BookCover.tsx`

```tsx
<Image
  src={src}
  alt={alt}
  fill
  unoptimized  // ← Added this
  className="object-cover"
/>
```

## ✅ Step 2: Updated Categories

**Old Categories:**
- AI First Steps
- Exploring AI  
- Advanced AI Foundations
- AI & Machine Learning
- Computer Vision
- Algorithms & Programming

**New Categories:**
- **AI for Kids** (Tiểu học)
- **AI for Middle School** (THCS)
- **AI for High School** (THPT)
- **Chuyên Ngành AI** (University/Professional)
- **Computer Vision** (Advanced)
- **Data & Algorithms** (Dữ liệu & Thuật toán)

Updated via `scripts/update-categories.ts`

## ✅ Step 3: Changed Promotion Logic

**Old System:** First 50 customers globally get 10% off
**New System:** First 50 customers **per book** get 10% off that specific book

### Implementation Changes:

1. **Updated `lib/promotion.ts`:**
   - Added `bookId` parameter to `getCustomerPromotion()`
   - Now counts unique customers per book
   - Each book has its own 50-reader promotion

2. **Updated API routes:**
   - `/api/promotion` - Now accepts `bookSlug` parameter
   - `/api/checkout` - Passes book ID to promotion check

3. **Updated Early Buyer Banner:**
   - Changed text to clarify "Per Book" promotion
   - Removed global counter (since each book is separate)

### How It Works:
```typescript
// Counts unique customers who ordered THIS specific book
const bookOrderCount = await prisma.order.count({
  where: {
    items: {
      some: { bookId: bookId },
    },
  },
  distinct: ['customerId'],
});

// First 50 get discount
if (bookOrderCount < 50) {
  discountPercent = 10;
}
```

## ✅ Step 4: Discount Preview in Checkout

**Feature:** When user enters phone number in checkout, immediately shows if they qualify for discount

**Already Implemented:**
- Real-time phone validation
- Debounced API call (500ms)
- Shows promotion notice:
  - "🎉 You qualify for 10% off this order" (new customer, first 50 for book)
  - "Welcome back. Returning customer offer: -10%" (returning customer)
- Live order summary with discount calculation

## ✅ Step 5: Bilingual Support (VI/EN) - Foundation

### Added Components:

1. **Translation System** (`lib/i18n.ts`):
   - Complete Vietnamese and English translations
   - 40+ translation keys
   - Helper function `getTranslation(lang, key)`

2. **Language Switcher** (`components/LanguageSwitcher.tsx`):
   - Globe icon with VI/EN toggle
   - Added to both desktop and mobile headers
   - Saves language preference

### Translation Keys Available:
- Header: books, categories, search, orderBooks
- Categories: All 6 category names
- Homepage: heroTitle, heroSubtitle, buttons
- Checkout: All form fields and labels
- Promotions: Discount messages
- Footer: All sections

### To Fully Implement:
For complete bilingual support, you would need to:
1. Create `/en/*` route structure
2. Wrap pages with language context
3. Replace hardcoded text with `getTranslation()` calls
4. Add language detection and persistence

**Current Status:** Foundation is ready, language switcher is visible in header

---

## Testing Checklist

- [x] Book covers load correctly
- [x] Categories show new names
- [x] First 50 readers counted per book
- [x] Checkout shows discount when phone entered
- [x] Returning customers get 10% off
- [x] Language switcher visible in header
- [x] Mobile responsive

---

## Files Modified

### Core Logic:
- `lib/promotion.ts` - Per-book promotion logic
- `lib/i18n.ts` - NEW: Translation system
- `components/books/BookCover.tsx` - Fixed image loading

### API Routes:
- `app/api/promotion/route.ts` - Added bookSlug parameter
- `app/api/checkout/route.ts` - Pass bookId to promotion

### Components:
- `components/LanguageSwitcher.tsx` - NEW: Language toggle
- `components/layout/Header.tsx` - Added language switcher
- `components/order/CheckoutForm.tsx` - Pass bookSlug to API
- `components/marketing/EarlyBuyerBanner.tsx` - Updated text

### Scripts:
- `scripts/update-categories.ts` - NEW: Category update script

---

## Next Steps (Optional Enhancements)

1. **Full Bilingual Implementation:**
   - Create English route structure
   - Add language context provider
   - Translate all pages

2. **Per-Book Promotion Tracking:**
   - Add badge to books showing "X/50 spots taken"
   - Show countdown on book detail pages

3. **Enhanced Checkout:**
   - Show multiple promotion options
   - Add coupon code field
   - Email confirmation

4. **Admin Features:**
   - View per-book promotion statistics
   - Export customer data per book
   - Promotion analytics dashboard

---

## Database Changes

No schema changes required! The promotion logic uses existing tables:
- `Order` - Links customers to books
- `OrderItem` - Tracks which books were ordered
- `Customer` - Unique by phone number

Query efficiently counts distinct customers per book using:
```sql
SELECT COUNT(DISTINCT customerId) 
FROM Order 
WHERE id IN (
  SELECT orderId FROM OrderItem WHERE bookId = ?
)
```
