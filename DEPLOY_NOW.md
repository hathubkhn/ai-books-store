# 🚀 Quick Deploy to Vercel

## ✅ Database Setup Complete!

Your Neon PostgreSQL database schema has been successfully created with all tables.

## 📋 Environment Variables for Vercel

Copy and paste these into your Vercel project settings (Settings → Environment Variables):

```env
DATABASE_URL=postgresql://neondb_owner:npg_ceRFHobq98zM@ep-fragrant-lake-axmppx5q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

AUTH_SECRET=CtIyoO5iJEdtqdSasr1wH0VAa2iAwF8FJYU1oOlysGA=

ADMIN_EMAIL=admin@aibooks.com

ADMIN_PASSWORD_HASH=\$2a\$10\$UeYVsUnfFfztPX1J5LlmnenNNGAzcjmvSce5wd1eHiqSQNb1mqzVi

NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

CUSTOMER_JWT_SECRET=VNfgnjkETNvyOAUU02BtzJ9H3rRmUXF8mvSmSc2mzi0=
```

**⚠️ IMPORTANT:** 
- Make sure to use `\$` (backslash dollar) in `ADMIN_PASSWORD_HASH` when pasting into Vercel
- Update `NEXT_PUBLIC_SITE_URL` with your actual Vercel URL after first deployment

## 🎯 Deploy Now - 3 Options

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com/new
2. **Import your Git repository** (GitHub, GitLab, or Bitbucket)
3. **Configure:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `prisma generate && next build` (auto-detected from package.json)
4. **Add Environment Variables** (click "Add" and paste each variable from above)
5. **Click "Deploy"**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /Users/bapcai/Project/ai-books-store
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? ai-books-store (or your choice)
# - Directory? ./ 
# - Override settings? No

# When asked about environment variables, add them one by one
```

### Option 3: Connect Git Repository First

```bash
cd /Users/bapcai/Project/ai-books-store

# If you haven't pushed to GitHub yet:
# 1. Create a new repo on GitHub
# 2. Then run:
git remote add origin https://github.com/yourusername/ai-books-store.git
git branch -M main
git push -u origin main

# Then deploy via Option 1 (Dashboard) by importing your GitHub repo
```

## 📝 After Deployment

### 1. Update Site URL
Once deployed, update the `NEXT_PUBLIC_SITE_URL` in Vercel:
- Go to your project → Settings → Environment Variables
- Edit `NEXT_PUBLIC_SITE_URL` to your actual URL (e.g., `https://ai-books-store.vercel.app`)
- Redeploy: Deployments → Click "..." → Redeploy

### 2. Seed Initial Data

```bash
# Seed categories and books
DATABASE_URL="postgresql://neondb_owner:npg_ceRFHobq98zM@ep-fragrant-lake-axmppx5q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" npx tsx prisma/seed.ts

# Seed roadmap data
DATABASE_URL="postgresql://neondb_owner:npg_ceRFHobq98zM@ep-fragrant-lake-axmppx5q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" npx tsx prisma/seed-roadmap.ts
```

### 3. Test Your Deployment

1. Visit your Vercel URL
2. Test homepage: `https://your-app.vercel.app`
3. Test admin login: `https://your-app.vercel.app/admin/login`
   - Email: `admin@aibooks.com`
   - Password: `admin123`
4. Create a test customer account
5. Test checkout flow

## 🔒 Admin Credentials

- **Email:** admin@aibooks.com
- **Password:** admin123
- **Password Hash:** For password `admin123`

⚠️ **Change the admin password after first login** by updating `ADMIN_PASSWORD_HASH` in Vercel.

To generate a new hash:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your_new_password', 10).then(hash => console.log(hash.replace(/\$/g, '\\$')));"
```

## 📊 What's Included

Your deployed app includes:
- ✅ Full e-commerce storefront
- ✅ Admin dashboard (books, categories, orders)
- ✅ Customer authentication & accounts
- ✅ Shopping cart & checkout
- ✅ Bank transfer payment flow
- ✅ Learning roadmap system
- ✅ Book bundles
- ✅ Order management
- ✅ Promotion system (first 50 buyers, returning customers)
- ✅ Bilingual support (VI/EN framework ready)
- ✅ Responsive design

## 🐛 Troubleshooting

### Build fails with Prisma error
- Make sure `postinstall` script runs: `"postinstall": "prisma generate"`
- Check environment variables are set correctly

### Database connection fails
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check database is accessible from internet
- Try connection pooling: Add `?pgbouncer=true` to URL

### 404 on pages
- Clear cache and redeploy
- Check build logs for errors
- Verify all files are committed to Git

### Environment variables not working
- Make sure to escape `$` as `\$` in Vercel dashboard
- Redeploy after adding/changing variables

## 📈 Next Steps

1. Add custom domain in Vercel settings
2. Set up analytics (Vercel Analytics is built-in)
3. Upload book cover images to production storage
4. Configure email notifications (optional)
5. Set up monitoring and alerts

## 🎉 You're Live!

Your AI Books Store is ready for production. Happy selling! 📚

For questions: Check DEPLOYMENT.md for detailed documentation.
