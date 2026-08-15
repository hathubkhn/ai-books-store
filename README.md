# AI Books Store 📚

A modern, full-stack e-commerce platform for AI and machine learning books built with Next.js 16, TypeScript, Prisma, and PostgreSQL.

## Features

### Customer Features
- 🛒 **Shopping Experience**
  - Browse books by categories
  - Detailed book pages with descriptions
  - Shopping cart functionality
  - Secure checkout with bank transfer

- 🎓 **Learning Roadmaps**
  - Interactive learning paths for different AI topics
  - Assessment quizzes to determine skill level
  - Personalized book recommendations
  - Progress tracking

- 📦 **Book Bundles**
  - Curated book collections
  - Volume discounts
  - Customizable bundle selection

- 💰 **Promotions**
  - Early buyer discounts (first 50 customers)
  - Returning customer offers
  - Per-book promotion tracking

- 👤 **Customer Account**
  - Order history
  - Profile management
  - Auto-fill checkout forms

- 🌐 **Bilingual Support**
  - Vietnamese and English interface

### Admin Features
- 📊 **Dashboard**
  - Sales statistics
  - Order analytics
  - Early buyer program progress

- 📚 **Content Management**
  - Book management (CRUD)
  - Category management
  - Translation source tracking

- 📋 **Order Management**
  - View all orders
  - Update order status
  - Payment confirmation system
  - Customer details

- 💳 **Payment Processing**
  - Bank transfer verification
  - Payment confirmation workflow
  - Order tracking

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: 
  - NextAuth.js 5 (Admin)
  - Custom JWT (Customers)
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-books-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/aibooks"
   AUTH_SECRET="your-secret-key"
   ADMIN_EMAIL="admin@aibooks.com"
   ADMIN_PASSWORD_HASH="\\$2a\\$10\\$..."
   NEXT_PUBLIC_SITE_URL="http://localhost:3001"
   CUSTOMER_JWT_SECRET="your-jwt-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed initial data
   npm run db:seed
   
   # Seed roadmap data (optional)
   npx tsx prisma/seed-roadmap.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: [http://localhost:3001](http://localhost:3001)
   - Admin: [http://localhost:3001/admin/login](http://localhost:3001/admin/login)
     - Email: `admin@aibooks.com`
     - Password: `admin123`

## Project Structure

```
ai-books-store/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── admin/          # Admin APIs
│   │   ├── auth/           # Authentication
│   │   ├── cart/           # Cart operations
│   │   ├── checkout/       # Checkout flow
│   │   ├── customer/       # Customer APIs
│   │   └── roadmap/        # Learning roadmap APIs
│   ├── admin/              # Admin pages
│   ├── books/              # Book pages
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout pages
│   ├── roadmap/            # Roadmap pages
│   └── order-confirmation/ # Order confirmation
├── components/              # React components
│   ├── admin/              # Admin components
│   ├── books/              # Book components
│   ├── layout/             # Layout components
│   ├── order/              # Order components
│   └── roadmap/            # Roadmap components
├── lib/                     # Utility functions
│   ├── auth.ts             # NextAuth configuration
│   ├── currency.ts         # Currency formatting
│   ├── db.ts               # Prisma client
│   ├── order-code.ts       # Order code generation
│   ├── phone.ts            # Phone normalization
│   ├── promotion.ts        # Promotion logic
│   └── validation.ts       # Zod schemas
├── prisma/                  # Database
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed script
│   └── migrations/         # Migration files
├── public/                  # Static assets
│   └── images/books/       # Book cover images
└── styles/                  # Global styles
    └── globals.css         # Tailwind CSS
```

## Database Schema

Key models:
- `Category` - Book categories
- `Book` - Books with pricing and details
- `Customer` - Customer accounts
- `Order` - Orders with items
- `CartItem` - Shopping cart
- `LearningTrack` - Roadmap tracks
- `LearningStage` - Roadmap stages
- `BookBundle` - Curated book sets

## API Routes

### Public APIs
- `GET /api/books` - List books
- `GET /api/books/[slug]` - Book details
- `GET /api/categories` - List categories
- `GET /api/promotion` - Check promotion eligibility
- `POST /api/checkout` - Create order

### Customer APIs (Authentication Required)
- `GET /api/customer/me` - Get customer profile
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `POST /api/checkout/cart` - Checkout with cart

### Admin APIs (Admin Authentication Required)
- `GET /api/admin/books` - List books
- `POST /api/admin/books` - Create book
- `PUT /api/admin/books/[id]` - Update book
- `GET /api/admin/orders` - List orders
- `PUT /api/admin/orders/[id]/status` - Update order status
- `POST /api/admin/confirm-payment` - Confirm payment

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Add environment variables
   - Deploy!

3. **Set up production database**
   - Use Neon, Supabase, or Railway
   - Add `DATABASE_URL` to Vercel environment variables
   - Run migrations: `npx prisma db push`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | NextAuth secret | Yes |
| `ADMIN_EMAIL` | Admin login email | Yes |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password | Yes |
| `NEXT_PUBLIC_SITE_URL` | Site URL | Yes |
| `CUSTOMER_JWT_SECRET` | JWT secret for customer auth | Yes |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
```

## Features In Detail

### Payment Flow
1. Customer adds books to cart
2. Proceeds to checkout
3. Fills in shipping information
4. Receives order confirmation with bank transfer details
5. Makes bank transfer
6. Admin confirms payment
7. Order is fulfilled

### Promotion System
- **Early Buyer**: First 50 unique customers get 10% off
- **Returning Customer**: Customers who ordered once get 10% off subsequent orders
- Promotions are tracked per book

### Learning Roadmap
- Multiple learning tracks (ML, CV, Deep Learning, etc.)
- Assessment quiz to determine starting level
- Visual roadmap with stages
- Book recommendations per stage
- Progress tracking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript
