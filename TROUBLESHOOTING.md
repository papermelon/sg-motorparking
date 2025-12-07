# Troubleshooting Guide

## Common Issues and Solutions

### "Failed to search carparks" Error

This error typically occurs due to database connection issues. Here's how to diagnose and fix:

#### 1. Check Vercel Logs

1. Go to your Vercel dashboard
2. Select your project (`sg-motorparking`)
3. Click on **"Logs"** in the top navigation
4. Look for errors related to:
   - Database connection (P1001 errors)
   - Prisma client generation
   - Query failures

#### 2. Verify Environment Variables

In Vercel → Settings → Environment Variables, make sure you have:

- ✅ `DATABASE_URL` - Supabase transaction pooler (port 6543)
- ✅ `DIRECT_URL` - Supabase direct connection (port 5432)
- ✅ `GOOGLE_MAPS_API_KEY` - Server-side API key
- ✅ `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Client-side API key

**Important:** Check that:
- Both database URLs are correct and include your actual password
- Passwords are URL-encoded (special characters like `@`, `#`, `$` should be encoded)
- The database is not paused in Supabase

#### 3. Check Database Connection

Test your database connection:

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this query to check if tables exist:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
3. You should see `Carpark` and `Photo` tables

#### 4. Check if Database Has Data

The search only returns **verified** carparks. Check if you have any:

```sql
SELECT COUNT(*) FROM "Carpark" WHERE "verified" = true;
```

If this returns 0, your database is empty. You need to:
- Seed the database (see DEPLOYMENT.md Step 5)
- Or add carparks manually via the admin interface

#### 5. Verify Database Schema

Make sure your database schema matches Prisma schema:

1. Check if the `Carpark` table has all required columns:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'Carpark';
   ```

2. Verify indexes exist:
   ```sql
   SELECT indexname, indexdef 
   FROM pg_indexes 
   WHERE tablename = 'Carpark';
   ```

#### 6. Common Error Codes

- **P1001**: Can't reach database server
  - Check DATABASE_URL and DIRECT_URL
  - Verify Supabase project is not paused
  - Check network/firewall settings

- **P2025**: Record not found (usually not relevant for search)
  
- **P2002**: Unique constraint violation (not relevant for search)

- **PrismaClientInitializationError**: Prisma client not generated
  - Redeploy on Vercel (build process should generate it)
  - Check build logs for Prisma generation errors

#### 7. Quick Fix Steps

1. **Verify environment variables are set correctly in Vercel**
2. **Check Supabase project is active** (not paused)
3. **Redeploy the application** after fixing environment variables
4. **Check if database has verified carparks** (query above)
5. **Review Vercel build logs** for any Prisma errors

### Other Issues

#### Geocoding Errors

- See DEPLOYMENT.md Step 4 for API key configuration
- Make sure Geocoding API is enabled in Google Cloud Console

#### Map Not Loading

- Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Verify API key restrictions allow your domain
- Check browser console for specific errors

## Getting Help

If issues persist:

1. Check Vercel deployment logs
2. Check Supabase logs (Dashboard → Logs)
3. Review browser console for client-side errors
4. Verify all environment variables are correct
5. Check that all APIs are enabled in Google Cloud Console

