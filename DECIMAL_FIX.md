# Decimal Serialization Fix

## Issue
Error when passing Prisma `Book` objects with `Decimal` type fields to Client Components in Next.js.

**Error Message:**
```
Only plain objects can be passed to Client Components from Server Components. 
Decimal objects are not supported.
```

## Root Cause
Prisma uses the `Decimal` type for numeric fields (like `price`). This is not a plain JavaScript object and cannot be serialized when passing data from Server Components to Client Components in Next.js.

## Solution
Convert all `Decimal` fields to `number` before passing data to Client Components.

## Files Modified

### 1. Server Components (Data Fetching)
These files now serialize Decimal → number:

**`app/books/page.tsx`**
```typescript
// Before
const books = await prisma.book.findMany({...});

// After
const booksRaw = await prisma.book.findMany({...});
const books = booksRaw.map((book) => ({
  ...book,
  price: book.price.toNumber(),
}));
```

**`app/page.tsx`** (Homepage)
- Same pattern applied to `featuredBooks`

**`app/category/[slug]/page.tsx`**
- Same pattern applied to category books

**`app/books/[slug]/page.tsx`** (Book detail)
- Same pattern applied to `relatedBooks`

**`app/api/search/route.ts`** (Search API)
- Serializes books before returning JSON response

**`app/checkout/page.tsx`** (Checkout page)
- Serializes book before passing to CheckoutForm

### 2. Type Definitions Updated

**`app/books/BooksPageClient.tsx`**
```typescript
interface BooksPageClientProps {
  initialBooks: (Omit<Book, "price"> & { price: number; category: Category })[];
  categories: Category[];
}
```

**`app/HomePageClient.tsx`**
```typescript
interface HomePageClientProps {
  categories: (Category & { _count?: { books: number } })[];
  featuredBooks: (Omit<Book, "price"> & { price: number; category: Category })[];
}
```

**`components/books/BookGrid.tsx`**
```typescript
interface BookGridProps {
  books: (Omit<Book, "price"> & { price: number; category: Category })[];
}
```

**`components/books/BookCard.tsx`**
```typescript
interface BookCardProps {
  book: Omit<Book, "price"> & { price: number; category: Category };
}
```

Also removed unnecessary `Number()` conversion since price is already a number.

**`components/order/CheckoutForm.tsx`**
```typescript
interface CheckoutFormProps {
  book: Omit<Book, "price"> & { price: number };
}
```

## Pattern Used

### Server Component Pattern
```typescript
// 1. Fetch data with Prisma (returns Decimal)
const booksRaw = await prisma.book.findMany({
  include: { category: true },
});

// 2. Serialize Decimal to number
const books = booksRaw.map((book) => ({
  ...book,
  price: book.price.toNumber(),
}));

// 3. Pass to Client Component
<ClientComponent books={books} />
```

### Type Definition Pattern
```typescript
import { Book, Category } from "@prisma/client";

// Remove 'price' from Book type and replace with number
type SerializedBook = Omit<Book, "price"> & { 
  price: number; 
  category: Category;
};

interface Props {
  books: SerializedBook[];
}
```

## Testing Checklist

✅ Homepage loads without errors
✅ Books page loads with category filter
✅ Category pages load correctly
✅ Book detail pages load with related books
✅ Checkout page loads without errors
✅ Search functionality works
✅ All prices display correctly
✅ No linter errors
✅ Type checking passes
✅ Server runs without Decimal errors

## Why This Approach?

1. **Minimal Changes**: Only serialize at the boundary between Server and Client Components
2. **Type Safety**: Updated TypeScript interfaces ensure type correctness
3. **Performance**: Serialization happens once per request on the server
4. **Maintainability**: Clear pattern that can be applied to other Decimal fields if needed

## Alternative Approaches Considered

1. ❌ **Using `JSON.parse(JSON.stringify(books))`**: Loses Date objects and other special types
2. ❌ **Converting to string**: Would require parsing everywhere the value is used
3. ✅ **Convert to number**: Most natural for currency values, works seamlessly with existing code

## Notes

- Admin pages don't need this fix as they render entirely on the server
- The `formatVND()` utility already accepts numbers, so no changes needed there
- The `BookPrice` component accepts numbers, so it's compatible
- Search API returns JSON, so serialization is necessary there too

---

**Fix Applied:** August 14, 2026
**Status:** ✅ Complete
