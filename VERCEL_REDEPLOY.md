# 🔄 Force Vercel to Use Latest Code

## Issue
Vercel is using cached/old code with ESLint 8, even though GitHub has the fix (ESLint 9).

## ✅ Latest Code Confirmed
- Commit `ce7f431` with ESLint 9 fix is on GitHub
- `package.json` has `"eslint": "^9"`

## Solution: Clear Vercel Cache & Redeploy

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel project**
   - Visit: https://vercel.com/dashboard
   - Select your `ai-books-store` project

2. **Delete the failed deployment**
   - Go to "Deployments" tab
   - Find the failed deployment
   - Click "..." → "Delete"

3. **Trigger a new deployment**
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - **Important**: Check "Clear build cache" ✅
   - Click "Redeploy"

### Option 2: Via Git Commit (Force New Build)

```bash
cd /Users/bapcai/Project/ai-books-store

# Make a small change to force rebuild
git commit --allow-empty -m "chore: trigger Vercel redeploy with ESLint 9"
git push
```

### Option 3: Via Vercel CLI

```bash
# Install if you haven't
npm install -g vercel

# Link your project
vercel link

# Deploy with force
vercel --force --prod
```

### Option 4: Re-import Project (Nuclear Option)

If none of the above work:

1. **Delete the project** from Vercel dashboard
2. **Re-import** from GitHub
3. **Add environment variables** again
4. **Deploy**

## Environment Variables Reminder

When you redeploy, make sure these are still set:

```
DATABASE_URL
AUTH_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD_HASH (with \$)
NEXT_PUBLIC_SITE_URL
CUSTOMER_JWT_SECRET
```

## Why This Happened

Vercel may have:
- Started build before push completed
- Cached the old package.json
- Used a stale Git ref

The forced redeploy with cache clear will fix it!
