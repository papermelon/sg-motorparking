# Deployment Guide - Vercel + Supabase

This guide walks you through deploying SG MotoPark to Vercel with Supabase as the database.

## Prerequisites

- ✅ GitHub repository: [papermelon/sg-motorparking](https://github.com/papermelon/sg-motorparking)
- ✅ Supabase project created
- ✅ Google Maps API key

---

## Step 1: Create Tables in Supabase

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Paste and run this SQL:

```sql
-- Create Carpark table
CREATE TABLE "Carpark" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "town" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "motorcycleAllowed" BOOLEAN NOT NULL,
    "carAllowed" BOOLEAN NOT NULL,
    "totalMotoLots" INTEGER,
    "covered" BOOLEAN,
    "seasonOnly" BOOLEAN,
    "pricingNotes" TEXT,
    "openingHours" TEXT,
    "entranceNotes" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Carpark_pkey" PRIMARY KEY ("id")
);

-- Create Photo table
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "carparkId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "takenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_carparkId_fkey" 
    FOREIGN KEY ("carparkId") REFERENCES "Carpark"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes for faster lookups
CREATE INDEX "Photo_carparkId_idx" ON "Photo"("carparkId");
CREATE INDEX "Carpark_lat_lng_idx" ON "Carpark"("lat", "lng");
CREATE INDEX "Carpark_verified_idx" ON "Carpark"("verified");
```

5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify tables were created in **Table Editor**

---

## Step 2: Get Supabase Connection Strings

1. In Supabase, go to **Project Settings** (⚙️ icon) → **Database**
2. Scroll to **Connection string** section
3. You need two connection strings:

   **a) Transaction pooler (port 6543) - for `DATABASE_URL`:**
   - Select **"Transaction"** mode
   - Select **"URI"** format
   - Copy the string (looks like: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`)

   **b) Direct connection (port 5432) - for `DIRECT_URL`:**
   - Select **"Session"** or **"Direct"** mode
   - Select **"URI"** format
   - Copy the string (looks like: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`)

   **Important:** Replace `[password]` with your actual database password. If your password contains special characters, URL-encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - etc.

   **If you can't find the connection strings:**
   - Check **Project Settings** → **API** for connection info
   - Or construct manually using format:
     - `DATABASE_URL`: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`
     - `DIRECT_URL`: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres`

---

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub

2. Click **"Add New..."** → **"Project"**

3. **Import your repository:**
   - Find and select `papermelon/sg-motorparking`
   - Click **Import**

4. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `.` (default)
   - **Build Command:** `npm run build` (default - includes Prisma generate)
   - **Output Directory:** `.next` (default)

5. **⚠️ CRITICAL: Add Environment Variables**
   
   Before clicking "Deploy", click **"Environment Variables"** and add these three:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Your Supabase transaction pooler connection string (port 6543) |
   | `DIRECT_URL` | Your Supabase direct connection string (port 5432) |
   | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your Google Maps API key |

   **Make sure to:**
   - Add these for **Production**, **Preview**, and **Development** environments
   - Click **Save** after adding each variable

6. Click **"Deploy"**

7. Wait for deployment to complete (~2-3 minutes)

---

## Step 4: Update Google Maps API Key Restrictions

After Vercel assigns your domain (e.g., `sg-motorparking.vercel.app`):

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your **Maps API Key**
3. Under **"Application restrictions"** → **"HTTP referrers"**
4. Add these entries:
   ```
   https://sg-motorparking.vercel.app/*
   https://*.vercel.app/*
   http://localhost:3000/*
   http://localhost:3001/*
   ```
   (Replace `sg-motorparking` with your actual Vercel domain)
5. Click **Save**

---

## Step 5: Seed Production Database (Optional)

After deployment, you can seed the production database with sample data:

**Option A: Using Supabase SQL Editor (Manual)**
- Copy data from your local `prisma/seed.ts` and insert via SQL

**Option B: Run seed script locally (temporarily)**
```bash
# Temporarily set production database URLs
export DATABASE_URL="postgresql://postgres.[ref]:[password]@..."
export DIRECT_URL="postgresql://postgres.[ref]:[password]@..."

# Regenerate Prisma client for PostgreSQL
npx prisma generate

# Run seed
npm run db:seed
```

**Option C: Use Prisma Studio**
```bash
# Set production URLs
export DATABASE_URL="..."
export DIRECT_URL="..."

# Open Prisma Studio
npm run db:studio
```

---

## Step 6: Verify Deployment

1. Visit your Vercel deployment URL
2. Test the search functionality
3. Check that carparks are loading (if seeded)
4. Verify map is displaying correctly

---

## Troubleshooting

### Build Fails with "Prisma Client not generated"
- Ensure `postinstall` script is in `package.json`: `"postinstall": "prisma generate"`
- Check that `DATABASE_URL` and `DIRECT_URL` are set correctly

### "Can't reach database server"
- Verify connection strings are correct
- Check that password is URL-encoded (special characters)
- Ensure Supabase project is not paused

### Google Maps not loading
- Check API key restrictions include your Vercel domain
- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in Vercel
- Check browser console for specific errors

### Database connection timeout
- Try using the direct connection string format
- Check Supabase project status
- Verify region matches in connection string

---

## Local Development After Deployment

For local development, you have two options:

**Option 1: Keep using SQLite locally**
- Temporarily change `schema.prisma` to `provider = "sqlite"`
- Use `DATABASE_URL="file:./dev.db"` in local `.env`
- Remember to switch back to PostgreSQL before deploying

**Option 2: Use Supabase for local dev too**
- Keep `schema.prisma` as PostgreSQL
- Use Supabase connection strings in local `.env`
- This keeps dev and prod in sync

---

## Next Steps

- ✅ Deploy to Vercel
- ✅ Seed production database
- ✅ Test all features
- ✅ Set up custom domain (optional)
- ✅ Configure monitoring (optional)

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Verify all environment variables are set
4. Review this guide for missed steps

