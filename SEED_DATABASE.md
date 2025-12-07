# Seed Your Database with Sample Carparks

Your database is currently empty or has no verified carparks. The search function only shows carparks marked as `verified: true`.

## Quick Check: Is Your Database Empty?

First, let's check if you have any carparks in your database:

1. Go to **Supabase Dashboard** → Your project → **SQL Editor**
2. Run this query:
   ```sql
   SELECT COUNT(*) as total_carparks, 
          COUNT(*) FILTER (WHERE "verified" = true) as verified_carparks
   FROM "Carpark";
   ```

**Results:**
- If both are `0` → Database is empty, proceed to **Option 1** or **Option 2**
- If `total_carparks > 0` but `verified_carparks = 0` → Carparks exist but aren't verified, proceed to **Option 3**

---

## Option 1: Seed Database Using Seed Script (Recommended)

This will add sample carparks from your `prisma/seed.ts` file, all marked as verified.

### Step 1: Get Your Database Connection Strings

You already have these from fixing the connection error:
- `DATABASE_URL` (Transaction pooler, port 6543)
- `DIRECT_URL` (Direct connection, port 5432)

### Step 2: Seed Locally (One-Time Setup)

Open your terminal and navigate to your project directory:

```bash
cd /Users/ngawangchime/Desktop/Developer/SGMotorbikeParking
```

**Set environment variables temporarily:**

```bash
# Replace with your actual connection strings
export DATABASE_URL="your_transaction_pooler_connection_string_here"
export DIRECT_URL="your_direct_connection_string_here"
```

**Regenerate Prisma client for PostgreSQL:**

```bash
npx prisma generate
```

**Run the seed script:**

```bash
npm run db:seed
```

You should see: `Database seeded successfully!`

### Step 3: Verify in Supabase

1. Go to **Supabase Dashboard** → **Table Editor** → **Carpark**
2. You should see multiple carparks listed
3. Check that they all have `verified = true`

### Step 4: Test Your Application

1. Visit `https://sg-motorparking.vercel.app`
2. Search for a location like "Orchard Road" or "Jurong East"
3. You should now see motorcycle parking locations!

---

## Option 2: Seed Using Supabase SQL Editor (Alternative)

If you prefer using SQL directly:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New query**
3. Run the seed data SQL (I can generate this for you if needed)

**Note:** This is more manual but doesn't require local setup.

---

## Option 3: Mark Existing Carparks as Verified

If your database already has carparks but they're not verified:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this query to mark all existing carparks as verified:

```sql
UPDATE "Carpark" 
SET "verified" = true 
WHERE "verified" = false;
```

3. Verify the update:

```sql
SELECT COUNT(*) FROM "Carpark" WHERE "verified" = true;
```

---

## What's Included in the Seed Data?

The seed file (`prisma/seed.ts`) includes sample carparks in:
- **Orchard/CBD area**: Orchard Central, Tangs Plaza, Somerset 313
- **Yishun**: Yishun MRT, Northpoint City
- **Jurong East**: Jurong East MRT, Westgate
- **Other areas**: Various HDB carparks, malls, and office buildings

All seeded carparks are automatically marked as `verified: true`.

---

## Troubleshooting

### "Prisma Client not generated" error
```bash
npx prisma generate
```

### "Can't reach database" error
- Double-check your `DATABASE_URL` and `DIRECT_URL` are correct
- Make sure passwords are URL-encoded
- Verify Supabase project is not paused

### Seed runs but no carparks appear
- Check Supabase Table Editor to see if carparks were created
- Verify they have `verified = true`
- Check Vercel logs for any query errors

---

## After Seeding

Once seeded, your application should show motorcycle parking locations when searching in Singapore. Users can also:
- Use the "Suggest a Location" feature to add more carparks
- Those suggestions will need to be verified (manually or via admin interface)

