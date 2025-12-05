# Step-by-Step Deployment Guide

Follow these steps in order. Each step tells you exactly where to go and what to do.

---

## ✅ STEP 1: Create Tables in Supabase

**WHERE:** Supabase Dashboard (web browser)

1. **Open:** https://supabase.com/dashboard
2. **Click:** Your project "sg-motorparking"
3. **In left sidebar:** Click **"SQL Editor"**
4. **Click:** **"New query"** button (top right)
5. **Copy this entire SQL block:**

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

-- Create indexes
CREATE INDEX "Photo_carparkId_idx" ON "Photo"("carparkId");
CREATE INDEX "Carpark_lat_lng_idx" ON "Carpark"("lat", "lng");
CREATE INDEX "Carpark_verified_idx" ON "Carpark"("verified");
```

6. **Paste** into the SQL editor
7. **Click:** **"Run"** button (or press `Cmd+Enter` / `Ctrl+Enter`)
8. **Verify:** You should see "Success. No rows returned" message
9. **Check:** Go to **"Table Editor"** in left sidebar → You should see "Carpark" and "Photo" tables

**✅ DONE when:** You see both tables in Table Editor

---

## ✅ STEP 2: Get Supabase Connection Strings

**WHERE:** Supabase Dashboard → Project Settings

1. **In Supabase dashboard:** Click **⚙️ Settings icon** (bottom left)
2. **Click:** **"Database"** (under CONFIGURATION section)
3. **Scroll down** to find **"Connection string"** section

**If you see "Connection string" section:**
   - Select **"Transaction"** mode → **"URI"** format
   - **Copy** the connection string → This is your `DATABASE_URL`
   - Select **"Session"** mode → **"URI"** format  
   - **Copy** the connection string → This is your `DIRECT_URL`

**If you DON'T see "Connection string" section:**
   - Try **Project Settings** → **"API"** instead
   - Or construct manually (see below)

**Manual Construction (if needed):**
Your connection strings should look like this (replace values):
- `DATABASE_URL`: `postgresql://postgres.eejqzyifbmbhgidmvhvd:Palsang95%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- `DIRECT_URL`: `postgresql://postgres.eejqzyifbmbhgidmvhvd:Palsang95%40@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`

**Important:** 
- Replace `Palsang95%40` with your actual password (URL-encoded)
- Replace `ap-southeast-1` with your actual region if different
- `%40` is the URL-encoded version of `@`

**✅ DONE when:** You have both connection strings copied

---

## ✅ STEP 3: Deploy to Vercel

**WHERE:** Vercel Dashboard (web browser)

### 3a. Sign in to Vercel

1. **Open:** https://vercel.com
2. **Click:** **"Sign Up"** or **"Log In"**
3. **Choose:** **"Continue with GitHub"**
4. **Authorize** Vercel to access your GitHub

### 3b. Import Your Project

1. **Click:** **"Add New..."** button (top right)
2. **Click:** **"Project"**
3. **Find:** `papermelon/sg-motorparking` in the list
4. **Click:** **"Import"** button next to it

### 3c. Configure Project

1. **Framework Preset:** Should auto-detect "Next.js" ✅
2. **Root Directory:** Leave as `.` (default) ✅
3. **Build Command:** Should show `npm run build` ✅
4. **Output Directory:** Should show `.next` ✅

**⚠️ DON'T CLICK DEPLOY YET!** We need to add environment variables first.

### 3d. Add Environment Variables

1. **Scroll down** to **"Environment Variables"** section
2. **Click:** **"Add"** button
3. **Add these 3 variables one by one:**

   **Variable 1:**
   - **Name:** `DATABASE_URL`
   - **Value:** Paste your Supabase transaction pooler connection string
   - **Environment:** Check all three: Production, Preview, Development
   - **Click:** **"Save"**

   **Variable 2:**
   - **Name:** `DIRECT_URL`
   - **Value:** Paste your Supabase direct connection string
   - **Environment:** Check all three: Production, Preview, Development
   - **Click:** **"Save"**

   **Variable 3:**
   - **Name:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value:** Your Google Maps API key (from Google Cloud Console)
   - **Environment:** Check all three: Production, Preview, Development
   - **Click:** **"Save"**

4. **Verify:** You should see all 3 variables listed

### 3e. Deploy

1. **Scroll to bottom**
2. **Click:** **"Deploy"** button
3. **Wait:** ~2-3 minutes for build to complete
4. **Watch:** The build logs in real-time

**✅ DONE when:** You see "Congratulations! Your project has been deployed" with a URL like `sg-motorparking.vercel.app`

---

## ✅ STEP 4: Update Google Maps API Key

**WHERE:** Google Cloud Console (web browser)

1. **Open:** https://console.cloud.google.com/apis/credentials
2. **Click:** Your API key
3. **Scroll to:** **"Application restrictions"** section
4. **Select:** **"HTTP referrers (web sites)"**
5. **Click:** **"Add an item"**
6. **Add these referrers one by one:**
   ```
   https://sg-motorparking.vercel.app/*
   https://*.vercel.app/*
   http://localhost:3000/*
   http://localhost:3001/*
   ```
   (Replace `sg-motorparking` with your actual Vercel domain if different)
7. **Click:** **"Save"** button (top of page)
8. **Wait:** ~5 minutes for changes to propagate

**✅ DONE when:** Changes are saved successfully

---

## ✅ STEP 5: Test Your Deployment

**WHERE:** Your Vercel URL (web browser)

1. **Open:** Your Vercel deployment URL (e.g., `https://sg-motorparking.vercel.app`)
2. **Test:**
   - ✅ Page loads without errors
   - ✅ Map displays correctly
   - ✅ Search bar works
   - ✅ "Use my location" button works

**If you see errors:**
- Check Vercel deployment logs (click on your deployment → "Logs" tab)
- Verify all environment variables are set correctly
- Check browser console for specific errors

**✅ DONE when:** Your app works on the live URL

---

## ✅ STEP 6: Seed Production Database (Optional)

**WHERE:** Your local terminal

**Only do this if you want sample data in production.**

1. **Open Terminal** on your Mac
2. **Navigate to project:**
   ```bash
   cd /Users/ngawangchime/Desktop/Developer/SGMotorbikeParking
   ```

3. **Temporarily set production database URLs:**
   ```bash
   export DATABASE_URL="postgresql://postgres.eejqzyifbmbhgidmvhvd:Palsang95%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   export DIRECT_URL="postgresql://postgres.eejqzyifbmbhgidmvhvd:Palsang95%40@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
   ```
   (Replace with your actual connection strings)

4. **Regenerate Prisma client:**
   ```bash
   npx prisma generate
   ```

5. **Run seed script:**
   ```bash
   npm run db:seed
   ```

6. **Verify:** Go to Supabase → Table Editor → Check that Carpark table has data

**✅ DONE when:** You see carparks in your production database

---

## 🎉 You're Done!

Your app should now be live at your Vercel URL!

**Next steps:**
- Share your live URL with others
- Test all features thoroughly
- Monitor Vercel dashboard for any issues
- Consider setting up a custom domain (optional)

---

## Troubleshooting

**Build fails:**
- Check Vercel logs for specific error
- Verify all environment variables are set
- Make sure connection strings are correct

**Database connection errors:**
- Verify connection strings are correct
- Check password is URL-encoded
- Ensure Supabase project is not paused

**Google Maps not loading:**
- Wait 5 minutes after updating API key restrictions
- Verify domain is added to allowed referrers
- Check browser console for specific errors

