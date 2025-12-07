# Deploy Changes to Production

To see your changes (renaming "SG MotoPark" to "SG Motorbike Parking") on your live website, you need to deploy them. Here's how:

## Option 1: Deploy via Git (Recommended if Vercel is connected to GitHub)

If your Vercel project is connected to a GitHub repository, it will automatically deploy when you push changes.

### Step 1: Commit Your Changes

```bash
cd /Users/ngawangchime/Desktop/Developer/SGMotorbikeParking

# Add the changed files
git add src/app/page.tsx src/app/layout.tsx README.md DEPLOYMENT.md

# Commit with a descriptive message
git commit -m "Rename app from 'SG MotoPark' to 'SG Motorbike Parking'"
```

### Step 2: Push to GitHub

```bash
git push origin main
```

### Step 3: Wait for Auto-Deployment

- Vercel will automatically detect the push
- Go to your [Vercel Dashboard](https://vercel.com/dashboard)
- Watch the deployment progress
- Usually takes 2-3 minutes

## Option 2: Manual Redeploy on Vercel

If you prefer not to use git, or want to deploy immediately:

### Step 1: Commit Locally (Still Recommended)

```bash
git add src/app/page.tsx src/app/layout.tsx README.md DEPLOYMENT.md
git commit -m "Rename app from 'SG MotoPark' to 'SG Motorbike Parking'"
```

### Step 2: Redeploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `sg-motorparking` project
3. Go to the **Deployments** tab
4. Click the **three dots (⋯)** on the latest deployment
5. Select **Redeploy**
6. Wait for deployment to complete (~2-3 minutes)

## Option 3: Deploy via Vercel CLI (Advanced)

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel --prod
```

## Verify the Changes

After deployment completes:

1. Visit: https://sg-motorparking.vercel.app/
2. Check that:
   - Page title shows "SG Motorbike Parking" (check browser tab)
   - Main heading shows "SG Motorbike Parking"
   - Page metadata is updated

**Note:** You may need to hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R) to see changes due to browser caching.

## Troubleshooting

### Changes Not Showing?

1. **Hard refresh your browser**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Clear browser cache** or use incognito/private mode
3. **Check Vercel deployment logs** for any build errors
4. **Verify the deployment succeeded** in Vercel dashboard

### Build Failed?

1. Check Vercel deployment logs for errors
2. Make sure all environment variables are set correctly
3. Verify Prisma client is generating correctly

