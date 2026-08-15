# Deployment Guide - AI Books Store

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Production Database** - Set up a PostgreSQL database (recommended providers):
   - [Neon](https://neon.tech) - Free tier available, serverless
   - [Supabase](https://supabase.com) - Free tier with 500MB database
   - [Railway](https://railway.app) - $5/month for PostgreSQL
   - [Vercel Postgres](https://vercel.com/storage/postgres) - Integrated with Vercel

## Step-by-Step Deployment

### 1. Set Up Production Database

#### Option A: Using Neon (Recommended)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (it will look like):
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

#### Option B: Using Supabase

1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Settings → Database → Connection String
3. Copy the URI connection string

### 2. Prepare Your Repository

```bash
cd /Users/bapcai/Project/ai-books-store

# Make sure all changes are committed
git add .
git commit -m "Prepare for deployment"

# Push to GitHub (if not already)
git remote add origin https://github.com/yourusername/ai-books-store.git
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Build Command**: `prisma generate && next build` (should be auto-detected)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables** (IMPORTANT):
   Click "Environment Variables" and add:

   ```env
   DATABASE_URL=your_neon_or_supabase_connection_string
   AUTH_SECRET=generate_with_openssl_rand_base64_32
   ADMIN_EMAIL=admin@aibooks.com
   ADMIN_PASSWORD_HASH=\$2a\$10\$UeYVsUnfFfztPX1J5LlmnenNNGAzcjmvSce5wd1eHiqSQNb1mqzVi
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   CUSTOMER_JWT_SECRET=generate_with_openssl_rand_base64_32
   ```

   **Generate secrets:**
   ```bash
   openssl rand -base64 32
   ```

5. Click "Deploy"

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

### 4. Set Up Database Schema

After deployment, run migrations:

```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Link to your project
vercel link

# Run migrations (Option 1: Direct Prisma)
DATABASE_URL="your_production_db_url" npx prisma db push

# Run migrations (Option 2: Via Vercel CLI)
vercel env pull .env.production
npm run db:push
```

### 5. Seed Initial Data (Optional)

```bash
# Seed categories and books
DATABASE_URL="your_production_db_url" npx tsx prisma/seed.ts

# Seed roadmap data (if needed)
DATABASE_URL="your_production_db_url" npx tsx prisma/seed-roadmap.ts
```

### 6. Verify Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test the homepage loads
3. Try logging in to admin: `/admin/login`
   - Email: `admin@aibooks.com`
   - Password: `admin123`
4. Create a test order

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `AUTH_SECRET` | NextAuth secret for admin auth | Generate with `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Admin login email | `admin@aibooks.com` |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password | Use escaped `\$` in Vercel UI |
| `NEXT_PUBLIC_SITE_URL` | Your production URL | `https://your-app.vercel.app` |
| `CUSTOMER_JWT_SECRET` | JWT secret for customer auth | Generate with `openssl rand -base64 32` |

## Important Notes

### Admin Password Hash

When adding `ADMIN_PASSWORD_HASH` to Vercel:
- The `$` characters MUST be escaped as `\$`
- Example: `\$2a\$10\$UeYVsUnfFfztPX1J5LlmnenNNGAzcjmvSce5wd1eHiqSQNb1mqzVi`
- This hash is for password: `admin123`
- To generate a new hash:
  ```bash
  node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your_password', 10).then(console.log);"
  ```

### Database SSL

Make sure your `DATABASE_URL` includes `?sslmode=require` at the end for secure connections.

### Image Storage

Currently, images are stored in `/public/images/books/`. For production:
- Consider using Vercel Blob Storage or
- Upload to a CDN like Cloudinary, AWS S3, or Vercel Blob
- Update image paths accordingly

## Troubleshooting

### Build Fails

```bash
# Check logs in Vercel dashboard
# Common issues:
# 1. Missing environment variables
# 2. Database connection issues
# 3. Prisma client not generated

# Solution: Make sure postinstall runs
npm run postinstall
```

### Database Connection Issues

```bash
# Test connection locally
DATABASE_URL="your_prod_url" npx prisma db push

# Check SSL mode is required
# URL should end with: ?sslmode=require
```

### 404 on Routes

```bash
# Make sure build completed successfully
# Check Vercel Functions tab for errors
# Verify all API routes are deployed
```

## Updating Your Deployment

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push

# Vercel will auto-deploy from GitHub
# Or use CLI:
vercel --prod
```

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_SITE_URL` environment variable

## Performance Tips

1. **Enable Caching**: Pages are automatically cached by Next.js
2. **Database Connection Pooling**: Use `?pgbouncer=true` in Neon URL
3. **Image Optimization**: Next.js Image component is already used
4. **Static Pages**: Homepage and book listings are statically generated

## Security Checklist

- [x] Environment variables are set in Vercel (not in code)
- [x] Admin password is hashed with bcrypt
- [x] Database uses SSL connection
- [x] Customer authentication uses JWT
- [ ] Set up rate limiting (optional)
- [ ] Enable HTTPS only (Vercel default)
- [ ] Review Vercel Security settings

## Support

For issues:
1. Check Vercel deployment logs
2. Check Functions logs for API errors
3. Test database connection
4. Review environment variables

Your AI Books Store is now live! 🎉
