# Quick Steps to Seed Your Database

## Step 1: Check Your Database (Optional)

Go to **Supabase Dashboard** → **SQL Editor** and run:

```sql
SELECT COUNT(*) FROM "Carpark";
```

If this returns `0`, your database is empty.

---

## Step 2: Seed Your Database

### Option A: Using Terminal (Recommended)

1. **Open Terminal** and go to your project:
   ```bash
   cd /Users/ngawangchime/Desktop/Developer/SGMotorbikeParking
   ```

2. **Set your database connection strings:**
   ```bash
   # Get these from Vercel → Settings → Environment Variables
   export DATABASE_URL="your_transaction_pooler_url_here"
   export DIRECT_URL="your_direct_connection_url_here"
   ```

3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

4. **Run seed script:**
   ```bash
   npm run db:seed
   ```

   You should see: `Database seeded successfully!`

5. **Test your app:**
   - Visit `https://sg-motorparking.vercel.app`
   - Search for "Orchard Road" or "Jurong East"
   - You should now see motorcycle parking locations!

### Option B: Mark Existing Carparks as Verified

If you already have carparks but they're not verified:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run:
   ```sql
   UPDATE "Carpark" SET "verified" = true;
   ```

---

## That's It! 🎉

After seeding, your search should show motorcycle parking locations across Singapore.

