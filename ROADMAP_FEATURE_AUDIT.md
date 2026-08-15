# 🔍 CODEBASE AUDIT & INTEGRATION PLAN
## Learning Roadmap Feature

**Date:** August 15, 2026  
**Auditor:** Senior Full-Stack Engineer

---

## 📊 EXECUTIVE SUMMARY

Codebase hiện tại đã có nền tảng vững chắc để xây dựng Learning Roadmap feature. Architecture hiện tại hỗ trợ tốt việc mở rộng với:
- ✅ Next.js 16 App Router (SSR + Client Components)
- ✅ Prisma ORM với PostgreSQL
- ✅ Customer Authentication (JWT-based)
- ✅ Shopping Cart system
- ✅ Bilingual support (vi/en)
- ✅ Clean component architecture
- ✅ API Routes convention

**Recommendation:** PROCEED với MVP implementation  
**Estimated Effort:** 3-5 days for Phase 1  
**Risk Level:** LOW - Minimal breaking changes needed

---

## 🏗️ CURRENT ARCHITECTURE

### **Frontend Stack**
- **Framework:** Next.js 16.3.1 (App Router)
- **React:** 19.0.0
- **UI:** Tailwind CSS 3.4.15
- **Icons:** Lucide React
- **Language:** TypeScript 5

### **Backend Stack**
- **Runtime:** Node.js
- **Database:** PostgreSQL
- **ORM:** Prisma 6.6.0
- **Auth:** NextAuth 5.0 (Admin) + Custom JWT (Customer)
- **Validation:** Zod 3.24.2

### **Design System**
```typescript
Colors:
- background: #F7F5F0 (warm white)
- accent: #D97757 (terracotta)
- foreground: #191919 (near black)
- success: #476A55 (forest green)
- warning: #A06832 (ochre)
- error: #A9493D (brick red)

Typography:
- Sans: Inter (body text)
- Serif: Source Serif 4 (headings)

Spacing:
- section-padding
- container-custom
```

**Design Philosophy:** Editorial, warm, Anthropic-inspired

---

## 📁 CURRENT DATABASE SCHEMA

### **Existing Models**

#### Category
```prisma
- id, name, slug, description
- sortOrder, isActive
- books (relation)
```

#### Book
```prisma
- id, title, slug
- publisher, authors
- shortDescription, fullDescription
- coverImage, price
- isbn, publishedYear, audience
- featured, isActive
- categoryId (FK)
```

#### Customer
```prisma
- id, fullName, phone, password
- defaultAddress, province
- orders[], cartItems[]
```

#### CartItem
```prisma
- id, customerId, bookId, quantity
- Constraint: unique(customerId, bookId)
```

#### Order & OrderItem
```prisma
- Order: orderCode, customer, pricing, status
- OrderItem: book snapshot, quantity, prices
```

---

## 🛣️ CURRENT ROUTING

```
/                          → Homepage (featured books, categories)
/books                     → All books (with category filter)
/books/[slug]              → Book detail
/category/[slug]           → Books by category
/search                    → Search page
/cart                      → Shopping cart
/checkout                  → Checkout flow
/order/success/[code]      → Order confirmation
/login                     → Customer login
/register                  → Customer registration
/account                   → Customer account (orders, profile)
/admin                     → Admin dashboard
/admin/books               → Book management
/admin/login               → Admin auth
```

---

## 🔌 API CONVENTIONS

### **Pattern**
```
/api/[resource]/[action]
/api/[resource]/[id]
```

### **Existing APIs**
```
GET    /api/cart
POST   /api/cart                    (add item)
PATCH  /api/cart/[id]               (update quantity)
DELETE /api/cart/[id]               (remove item)

POST   /api/customer/register
POST   /api/customer/login
POST   /api/customer/logout
GET    /api/customer/me
GET    /api/customer/orders

POST   /api/checkout
GET    /api/promotion
GET    /api/search
```

### **Auth Pattern**
- Customer: JWT in HTTP-only cookie (`customer_token`)
- Token validation: `jose` library
- Expiry: 7 days

---

## 🎨 UI COMPONENT STRUCTURE

### **Layout Components**
```
components/layout/
├── Header.tsx              (nav, logo, auth nav, language)
├── Footer.tsx              (links, newsletter)
└── MobileNav.tsx           (hamburger menu)
```

### **Book Components**
```
components/books/
├── BookCard.tsx            (cover, title, price, CTA)
├── BookGrid.tsx            (responsive grid)
├── BookCover.tsx           (next/image wrapper)
├── BookPrice.tsx           (VND formatting)
└── AddToCartButton.tsx     (add to cart logic)
```

### **Marketing Components**
```
components/marketing/
├── EarlyBuyerBanner.tsx
└── LearningJourney.tsx
```

### **Auth Components**
```
components/auth/
└── CustomerAuthNav.tsx     (login/cart/user display)
```

---

## 💳 CART FLOW

### **Current Implementation**
```
1. User clicks "Thêm vào giỏ"
2. If not logged in → redirect to /login
3. POST /api/cart { bookId, quantity }
4. Server validates auth & book
5. Create/Update CartItem (unique constraint)
6. Redirect to /cart
```

### **Cart Page Features**
- View all items
- Update quantity (+/-)
- Remove items
- Show total
- "Thanh toán" CTA

### **Cart to Checkout**
- Link to `/cart/checkout` (TODO: implement)
- Or: `/checkout?cart=true`

**Key Insight:**  
Cart is **item-based**, not bundle-based. Perfect for roadmap feature!

---

## 🔐 AUTHENTICATION STATUS

### **Customer Auth**
✅ Registration (phone + password)  
✅ Login (JWT cookie-based)  
✅ Session persistence  
✅ Protected routes  
✅ User profile  
✅ Order history  

### **Anonymous Users**
- Can browse
- Can view books
- Must login to cart/checkout

**Implication for Roadmap:**  
Can save progress for logged-in users  
Use localStorage for anonymous users

---

## 🌐 INTERNATIONALIZATION

### **Current Status**
- ✅ Language context (vi/en)
- ✅ Language switcher in header
- ✅ Translation keys in `lib/i18n.ts`
- ✅ LocalStorage persistence

### **Pattern**
```typescript
const { t, language } = useLanguage();
<button>{t("orderBooks")}</button>
```

**Implication:**  
All roadmap UI text must be translatable

---

## 📈 ANALYTICS STATUS

**Current:** No analytics implementation found

**Recommendation:**  
Add analytics layer before or during roadmap implementation:
- Google Analytics 4 (GTM)
- Or: Mixpanel / PostHog
- Track: roadmap views, assessments, bundles, conversions

---

## 🎯 INTEGRATION STRATEGY

### **Phase 1: Core Roadmap System (MVP)**

#### **1.1 Database Schema Extensions**

**New Models:**

```prisma
model LearningTrack {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  name        String
  nameEn      String?
  description String   @db.Text
  descriptionEn String? @db.Text
  icon        String?  // icon name from lucide-react
  level       String?  // BEGINNER, INTERMEDIATE, ADVANCED
  displayOrder Int     @default(0)
  isActive    Boolean  @default(true)
  
  stages      LearningStage[]
  bundles     BookBundle[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([displayOrder])
}

model LearningStage {
  id              Int      @id @default(autoincrement())
  trackId         Int
  track           LearningTrack @relation(fields: [trackId], references: [id], onDelete: Cascade)
  
  slug            String
  title           String
  titleEn         String?
  description     String   @db.Text
  descriptionEn   String?  @db.Text
  
  level           String   // FOUNDATION, BEGINNER, INTERMEDIATE, ADVANCED
  displayOrder    Int
  isOptional      Boolean  @default(false)
  
  // Prerequisites (JSON array of stage IDs)
  prerequisiteStageIds Int[]
  
  bookMappings    BookStageMapping[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([trackId, slug])
  @@index([trackId])
  @@index([displayOrder])
}

model BookStageMapping {
  id                    Int      @id @default(autoincrement())
  
  bookId                Int
  book                  Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  
  stageId               Int
  stage                 LearningStage @relation(fields: [stageId], references: [id], onDelete: Cascade)
  
  recommendationPriority Int     @default(0) // Higher = show first
  recommendationReason  String?  @db.Text
  recommendationReasonEn String? @db.Text
  
  minimumLevel          String?  // FOUNDATION, BEGINNER, etc.
  maximumLevel          String?  // Don't show if user is too advanced
  
  isPrimary             Boolean  @default(true)
  
  // Alternative book IDs if this is out of stock
  alternativeBookIds    Int[]
  
  createdAt             DateTime @default(now())
  
  @@unique([bookId, stageId])
  @@index([stageId, recommendationPriority])
}

model BookBundle {
  id              Int      @id @default(autoincrement())
  slug            String   @unique
  
  trackId         Int?
  track           LearningTrack? @relation(fields: [trackId], references: [id])
  
  title           String
  titleEn         String?
  description     String   @db.Text
  descriptionEn   String?  @db.Text
  
  level           String   // STARTER, PRACTITIONER, ADVANCED
  
  // Discount
  discountType    String   // PERCENTAGE, FIXED_AMOUNT
  discountValue   Decimal  @db.Decimal(12, 0)
  
  isActive        Boolean  @default(true)
  displayOrder    Int      @default(0)
  
  items           BookBundleItem[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([trackId])
  @@index([slug])
  @@index([level])
}

model BookBundleItem {
  id              Int      @id @default(autoincrement())
  
  bundleId        Int
  bundle          BookBundle @relation(fields: [bundleId], references: [id], onDelete: Cascade)
  
  bookId          Int
  book            Book       @relation(fields: [bookId], references: [id])
  
  isRequired      Boolean  @default(true)
  displayOrder    Int      @default(0)
  
  createdAt       DateTime @default(now())
  
  @@unique([bundleId, bookId])
  @@index([bundleId])
}

model CustomerRoadmapProgress {
  id                  Int      @id @default(autoincrement())
  
  customerId          Int
  customer            Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  
  trackId             Int
  track               LearningTrack @relation(fields: [trackId], references: [id], onDelete: Cascade)
  
  currentStageId      Int?
  completedStageIds   Int[]     // JSON array
  ownedBookIds        Int[]     // Books user already has
  
  assessmentData      Json?     // Store quiz answers
  recommendedLevel    String?   // BEGINNER, INTERMEDIATE, etc.
  
  lastAccessedAt      DateTime  @default(now())
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@unique([customerId, trackId])
  @@index([customerId])
}
```

**Update Book model:**
```prisma
model Book {
  // ... existing fields
  
  stageMappings   BookStageMapping[]
  bundleItems     BookBundleItem[]
}

model Customer {
  // ... existing fields
  
  roadmapProgress CustomerRoadmapProgress[]
}
```

#### **1.2 New Routes**

```
/roadmap                        → Roadmap hub
/roadmap/[trackSlug]           → Track detail + assessment
/roadmap/[trackSlug]/result    → Personalized roadmap result
/roadmap/bundle/[bundleSlug]   → Bundle detail page
```

#### **1.3 New API Routes**

```
GET    /api/roadmap/tracks           → List all tracks
GET    /api/roadmap/tracks/[slug]    → Track detail
POST   /api/roadmap/assessment        → Submit assessment
GET    /api/roadmap/recommendation    → Get personalized roadmap
POST   /api/roadmap/progress          → Save progress (logged in)
GET    /api/roadmap/progress/[trackId] → Get progress

GET    /api/bundles                   → List bundles
GET    /api/bundles/[slug]            → Bundle detail
POST   /api/bundles/add-to-cart       → Add entire bundle
POST   /api/bundles/customize         → Calculate custom bundle price
```

#### **1.4 New Components**

```
components/roadmap/
├── RoadmapHub.tsx              → Landing page grid
├── RoadmapTrackCard.tsx        → Track card with icon
├── LearningAssessment.tsx      → Quiz container
├── AssessmentQuestion.tsx      → Single question
├── RoadmapVisualization.tsx    → Visual roadmap (stepper)
├── RoadmapStage.tsx            → Single stage node
├── RecommendedBooks.tsx        → Books for a stage
├── BookRecommendationCard.tsx  → Book with "why this book"
├── RecommendationReason.tsx    → Why section
├── BundleCard.tsx              → Bundle display
├── BundleConfigurator.tsx      → Customize bundle
├── BundlePricing.tsx           → Price calculation display
├── RoadmapProgress.tsx         → Progress tracker
└── CrossSellBundleCard.tsx     → Cart upsell

components/integration/
├── ProductRoadmapLinks.tsx     → "This book is in roadmap X"
└── RelatedBooksSection.tsx     → "Often learned together"
```

---

### **Phase 1 Implementation Order**

#### **Week 1: Foundation**
1. Database migration
2. Seed data for 3 tracks (ML, CV, DL)
3. API endpoints
4. Basic routing

#### **Week 2: Core Features**
5. Roadmap hub page
6. Track detail page
7. Assessment quiz
8. Result visualization
9. Book mapping display

#### **Week 3: Commerce**
10. Bundle system
11. Bundle configurator
12. Add bundle to cart
13. Cart integration
14. Product page integration

#### **Week 4: Polish**
15. Mobile responsive
16. Bilingual support
17. Analytics events
18. Testing & QA

---

## 💡 KEY ARCHITECTURAL DECISIONS

### **1. Bundle Pricing Logic**

**Location:** `lib/bundle-pricing.ts`

```typescript
export function calculateBundlePrice(
  bundleItems: BookBundleItem[],
  customization: { bookId: number; include: boolean }[],
  discountType: string,
  discountValue: number
): {
  originalTotal: number;
  bundleDiscount: number;
  volumeDiscount: number;
  finalTotal: number;
  savingsAmount: number;
}
```

**Volume Discount Rules:**
- 1 book: 0%
- 2 books: +5%
- 3 books: +8%
- 4+ books: +10%

**Store in:** `config/pricing.ts`

### **2. Assessment Scoring**

**Location:** `lib/assessment-scoring.ts`

```typescript
export function calculateRecommendedLevel(
  answers: AssessmentAnswer[],
  trackSlug: string
): {
  level: string;
  startingStageId: number;
  completedStageIds: number[];
}
```

**Logic:** Rule-based for MVP  
**Future:** AI-powered with GPT-4

### **3. State Management**

**Logged-in users:**
- Database (`CustomerRoadmapProgress`)
- Real-time sync

**Anonymous users:**
- localStorage
- Key: `roadmap_progress_${trackSlug}`
- Migrate to DB on login

### **4. Cart Integration**

**When adding bundle:**
```typescript
// Add individual books with metadata
for (const item of bundleItems) {
  await addToCart({
    bookId: item.bookId,
    quantity: 1,
    metadata: {
      bundleId: bundle.id,
      bundleSlug: bundle.slug,
      bundleDiscount: calculatedDiscount,
    }
  });
}
```

**Track in CartItem:**
- Add optional `bundleId` field
- Or: use `metadata` JSON field

### **5. Analytics Events**

**Implementation:** Create `lib/analytics.ts`

```typescript
export function trackRoadmapEvent(
  event: string,
  properties: Record<string, any>
): void {
  // GA4
  if (window.gtag) {
    window.gtag('event', event, properties);
  }
  
  // PostHog
  if (window.posthog) {
    window.posthog.capture(event, properties);
  }
}
```

---

## 🎨 UI/UX SPECIFICATIONS

### **Roadmap Hub**

```
Hero:
┌─────────────────────────────────────────────┐
│ Học AI không nhất thiết phải mua thật       │
│ nhiều sách.                                  │
│                                              │
│ Điều quan trọng là đọc đúng cuốn, đúng     │
│ thời điểm.                                  │
│                                              │
│ [Tìm lộ trình của tôi]                      │
└─────────────────────────────────────────────┘

Track Grid:
┌──────┐ ┌──────┐ ┌──────┐
│ ML   │ │ DL   │ │ CV   │
│ icon │ │ icon │ │ icon │
└──────┘ └──────┘ └──────┘
```

### **Assessment Quiz**

```
Progress: ▓▓▓▓▓░░░ 5/8

┌─────────────────────────────────────────────┐
│ Câu 1: Kinh nghiệm Python của bạn?          │
│                                              │
│ ○ Chưa biết Python                          │
│ ○ Biết syntax cơ bản                        │
│ ○ Có thể dùng NumPy/Pandas                  │
│ ○ Sử dụng Python thành thạo                 │
│                                              │
│ [Tiếp theo]                                  │
└─────────────────────────────────────────────┘
```

### **Roadmap Result**

```
Your Level: INTERMEDIATE

┌─────────────────────────────────────────────┐
│ Bạn nên bắt đầu từ Machine Learning         │
│ Foundation                                   │
│                                              │
│ Python          ✓ Đã biết                   │
│ Data Processing ✓ Đã biết                   │
│ ML Foundation   → BẮT ĐẦU TẠI ĐÂY          │
│ Deep Learning   ↓ Tiếp theo                 │
│ Advanced ML     ↓ Nâng cao                  │
└─────────────────────────────────────────────┘

Recommended Books for ML Foundation:
┌──────┐
│ Book │ Hands-On Machine Learning
│      │ Phù hợp vì: thiên về thực hành
│      │ [Xem sách] [Thêm vào giỏ]
└──────┘
```

### **Bundle Card**

```
┌─────────────────────────────────────────────┐
│ Computer Vision Starter Pack                │
│                                              │
│ 📚 3 cuốn sách:                             │
│ 1. Python for Data Science                  │
│ 2. Machine Learning Fundamentals            │
│ 3. Computer Vision Basics                   │
│                                              │
│ Giá mua riêng:   1.280.000đ                 │
│ Giá combo:       ━━━━━━━━━                  │
│                    899.000đ                  │
│ Tiết kiệm:         381.000đ (30%)           │
│                                              │
│ [Thêm cả bộ vào giỏ]  [Tùy chỉnh]          │
└─────────────────────────────────────────────┘
```

---

## 🚨 POTENTIAL RISKS & MITIGATION

### **Risk 1: Cart complexity**
**Issue:** Adding bundle items individually  
**Mitigation:** Add `bundleId` metadata to CartItem  
**Rollback:** Simple - just add books normally

### **Risk 2: Performance**
**Issue:** Loading many books per roadmap  
**Mitigation:** 
- Lazy load stages
- Paginate recommendations
- Cache track data

### **Risk 3: Out-of-stock books**
**Issue:** Bundle includes unavailable book  
**Mitigation:**
- Check stock before showing bundle
- Show alternative books
- Allow partial bundle

### **Risk 4: Discount conflicts**
**Issue:** Bundle discount + early buyer discount  
**Mitigation:**
- Bundle discount overrides individual discounts
- Show clear pricing breakdown

---

## ✅ COMPATIBILITY CHECK

### **With Existing Features**

| Feature | Compatible? | Notes |
|---------|-------------|-------|
| Cart | ✅ Yes | Add metadata field |
| Checkout | ✅ Yes | No changes needed |
| Promotions | ⚠️ Partial | Need discount priority logic |
| Categories | ✅ Yes | Roadmap links to categories |
| Search | ✅ Yes | Can search by roadmap |
| Admin | ⚠️ Later | Need admin UI for roadmap config |
| Mobile | ✅ Yes | Design mobile-first |
| Bilingual | ✅ Yes | Add translations |
| Auth | ✅ Yes | Use existing customer auth |

---

## 📝 SAMPLE SEED DATA

### **Machine Learning Track**

```typescript
{
  slug: "machine-learning",
  name: "Machine Learning",
  nameEn: "Machine Learning",
  description: "Lộ trình học Machine Learning từ cơ bản đến nâng cao",
  stages: [
    {
      slug: "python-foundation",
      title: "Python Foundation",
      level: "FOUNDATION",
      displayOrder: 1
    },
    {
      slug: "data-processing",
      title: "Data Processing & NumPy",
      level: "BEGINNER",
      displayOrder: 2,
      prerequisiteStageIds: [1]
    },
    {
      slug: "ml-fundamentals",
      title: "Machine Learning Fundamentals",
      level: "BEGINNER",
      displayOrder: 3
    },
    {
      slug: "applied-ml",
      title: "Applied Machine Learning",
      level: "INTERMEDIATE",
      displayOrder: 4
    },
    {
      slug: "deep-learning-intro",
      title: "Introduction to Deep Learning",
      level: "INTERMEDIATE",
      displayOrder: 5
    },
    {
      slug: "advanced-ml",
      title: "Advanced ML Topics",
      level: "ADVANCED",
      displayOrder: 6,
      isOptional: true
    }
  ]
}
```

### **Computer Vision Track**

```typescript
{
  slug: "computer-vision",
  name: "Computer Vision",
  stages: [
    "Python & NumPy",
    "Image Processing Basics",
    "Machine Learning Foundation",
    "Deep Learning & PyTorch",
    "CNN & Image Classification",
    "Object Detection",
    "Vision Transformer & Advanced"
  ]
}
```

---

## 🎯 SUCCESS METRICS

### **Phase 1 Goals**

**Engagement:**
- 20% of visitors view roadmap
- 50% complete assessment
- 30% view recommended books

**Conversion:**
- 10% add bundle to cart
- 5% purchase from roadmap
- Bundle AOV: 2.5x single book

**Retention:**
- 15% return to continue roadmap
- 20% purchase next stage within 30 days

---

## 🚀 GO/NO-GO DECISION

### **✅ GO CRITERIA MET**

1. ✅ Clean architecture
2. ✅ Extensible database
3. ✅ Existing auth system
4. ✅ Cart compatibility
5. ✅ Modern UI framework
6. ✅ Component reusability
7. ✅ API conventions established
8. ✅ Mobile-responsive foundation

### **Recommendation: PROCEED WITH MVP**

**Start Date:** Immediate  
**MVP Timeline:** 3-4 weeks  
**Phase 2:** After MVP validation

---

## 📋 NEXT STEPS

1. **Review this audit** with product/business team
2. **Approve database schema** changes
3. **Create migration plan**
4. **Setup analytics** (GA4/PostHog)
5. **Begin implementation** following order above
6. **Create admin seeding scripts** for tracks/stages
7. **Design A/B tests** for bundle pricing
8. **Plan Phase 2** features

---

**Status:** READY TO BUILD 🚀
