# Quick Fix: Database Connection Error

## Current Error
`FATAL: Tenant or user not found` - Your database connection strings need to be updated.

## Steps to Fix (New Supabase UI)

### 1. Get Connection Strings from Supabase

**You're already at the right place!** In the "Connect to your project" modal:

#### Get DIRECT_URL (Port 5432):
- ✅ **Method**: Keep it as `Direct connection`
- ✅ Copy the connection string shown
- Looks like: `postgresql://postgres:[YOUR_PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
- This is your **DIRECT_URL**

#### Get DATABASE_URL (Port 6543):
- 🔄 **Method**: Change dropdown to `Transaction` (or look for "Session Pooler")
- ✅ Copy the connection string shown
- Should look like: `postgresql://postgres.xxxxx:[YOUR_PASSWORD]@aws-0-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true`
- This is your **DATABASE_URL**

**Note**: If you don't see "Transaction" option:
- Click **"Pooler settings"** button (in IPv4 section)
- Or check other tabs in the modal

### 2. Replace Password Placeholder

In **both** connection strings:
- Replace `[YOUR_PASSWORD]` with your actual database password
- **If password has special characters**, URL-encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`

**Example:**
- Password: `myP@ss#123`
- Encoded: `myP%40ss%23123`

### 3. Update Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your project → **Settings** → **Environment Variables**

2. **Edit DATABASE_URL:**
   - Click three dots (⋯) → **Edit**
   - Paste your **transaction pooler** connection string (port 6543)
   - Make sure password is URL-encoded
   - Click **Save**

3. **Edit DIRECT_URL:**
   - Click three dots (⋯) → **Edit**
   - Paste your **direct connection** string (port 5432)
   - Make sure password is URL-encoded
   - Click **Save**

4. **Verify both are applied to:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### 4. Redeploy

1. Go to **Deployments** tab
2. Click **three dots** (⋯) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~2-3 minutes)

### 5. Test

1. Visit: `https://sg-motorparking.vercel.app`
2. Try searching for a location
3. Check if error is resolved!

## Quick Checklist

- [ ] Got DIRECT_URL from Supabase (port 5432)
- [ ] Got DATABASE_URL from Supabase (port 6543, Transaction pooler)
- [ ] Replaced `[YOUR_PASSWORD]` in both strings
- [ ] URL-encoded special characters in password
- [ ] Updated DATABASE_URL in Vercel
- [ ] Updated DIRECT_URL in Vercel
- [ ] Both variables applied to all environments
- [ ] Redeployed application
- [ ] Tested search function

## Still Not Working?

1. **Check Vercel logs** for new error messages
2. **Verify password** - You might need to reset it in Supabase
3. **Check connection string format** - Should match examples above
4. **Ensure project is not paused** in Supabase dashboard

