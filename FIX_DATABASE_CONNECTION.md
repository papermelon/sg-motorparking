# Fix Database Connection Error

## Problem
The error `FATAL: Tenant or user not found` means your Supabase database connection strings are incorrect.

## Solution: Get Correct Connection Strings

### Step 1: Get Your Supabase Connection Strings

1. **Go to Supabase Dashboard**
   - Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to **Project Settings** (⚙️ icon) → **General** (or look for "Connect to your project" button)

2. **Open Connection Modal**
   - Click **"Connect to your project"** button (or similar)
   - This opens a modal with tabs at the top
   - Make sure the **"Connection String"** tab is selected

3. **Get DIRECT_URL (Direct Connection - Port 5432)**
   - In the modal, set the dropdowns to:
     - **Type**: `URI` (should be default)
     - **Source**: `Primary Database` (should be default)
     - **Method**: `Direct connection`
   - Copy the connection string shown
   - It should look like:
     ```
     postgresql://postgres:[YOUR_PASSWORD]@db.xxxxx.supabase.co:5432/postgres
     ```
   - **Important**: Replace `[YOUR_PASSWORD]` with your actual database password
   - This is your **DIRECT_URL**

4. **Get DATABASE_URL (Transaction Pooler - Port 6543)**
   - In the same modal, change the **Method** dropdown to:
     - **Method**: `Transaction` (or look for "Session Pooler" option)
   - Copy the connection string shown
   - It should look like:
     ```
     postgresql://postgres.xxxxx:[YOUR_PASSWORD]@aws-0-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - **Important**: Replace `[YOUR_PASSWORD]` with your actual database password
   - This is your **DATABASE_URL**

   **Note**: If you don't see "Transaction" option, look for:
   - **"Pooler settings"** button (near IPv4 compatibility section)
   - Or check the **"Connection String"** tab for pooler options

### Step 2: URL-Encode Special Characters in Password

If your database password contains special characters, you MUST URL-encode them:

- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `/` → `%2F`
- `:` → `%3A`
- `?` → `%3F`
- `=` → `%3D`

**Example:**
- Password: `myP@ssw0rd#123`
- Encoded: `myP%40ssw0rd%23123`

### Step 3: Update Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Open [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your `sg-motorparking` project
   - Go to **Settings** → **Environment Variables**

2. **Update DATABASE_URL**
   - Find `DATABASE_URL`
   - Click the **three dots** (⋯) → **Edit**
   - Paste your transaction pooler connection string (port 6543)
   - Make sure the password is URL-encoded
   - Click **Save**

3. **Update DIRECT_URL**
   - Find `DIRECT_URL`
   - Click the **three dots** (⋯) → **Edit**
   - Paste your direct connection string (port 5432)
   - Make sure the password is URL-encoded
   - Click **Save**

4. **Verify Both Are Applied to All Environments**
   - Check that both are applied to:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

### Step 4: Redeploy Your Application

1. In Vercel, go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Select **Redeploy**
4. Wait for deployment to complete

### Step 5: Test Again

1. Visit your application: `https://sg-motorparking.vercel.app`
2. Try searching for a location
3. Check Vercel logs again to see if the error is resolved

## Common Mistakes to Avoid

❌ **Don't use the connection string from "Connection info" section** - it's for direct SQL connections only
✅ **Do use the "Connection string" section** with the correct mode and format

❌ **Don't forget to replace `[PASSWORD]`** - the template shows placeholders
✅ **Do use your actual database password**

❌ **Don't forget to URL-encode special characters** in the password
✅ **Do encode special characters** before pasting into Vercel

❌ **Don't use the same connection string for both DATABASE_URL and DIRECT_URL**
✅ **Do use port 6543 for DATABASE_URL and port 5432 for DIRECT_URL**

## Still Having Issues?

If you're still getting errors after following these steps:

1. **Double-check your password** - Go to Supabase → Project Settings → Database → Reset database password if needed
2. **Verify project is not paused** - Check Supabase dashboard to ensure project is active
3. **Check connection string format** - Make sure it matches the format shown above
4. **Review Vercel logs** - Look for new error messages that might give more clues

## Quick Test

You can test your connection string locally before updating Vercel:

1. Create a temporary `.env.local` file:
   ```env
   DATABASE_URL="your_transaction_pooler_url_here"
   DIRECT_URL="your_direct_connection_url_here"
   ```

2. Test the connection:
   ```bash
   npx prisma db pull
   ```

3. If this works, the connection strings are correct!

