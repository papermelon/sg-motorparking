# Admin Protection & Suggest Button Fixes

## Issues Fixed

### 1. Admin Route Still Accessible
**Problem**: The admin route was still accessible without authentication.

**Root Cause**: The middleware was allowing access when `ADMIN_ACCESS_KEY` wasn't set (for development convenience).

**Solution**: Updated middleware to **always require authentication**. Now it blocks access if:
- No `ADMIN_ACCESS_KEY` is set in environment variables, OR
- No key is provided in the request (query param or header), OR
- The provided key doesn't match

### 2. Suggest Button Not Visible After Search
**Problem**: The suggest button was only in the bottom section and disappeared when search results were shown.

**Solution**: 
- Moved the "Suggest a Location" button to the **header banner** so it's always visible
- Styled it as a prominent green button
- Positioned it to the right of the title on desktop, below on mobile

---

## Changes Made

### 1. `middleware.ts` - Stricter Authentication

```diff
-    // If no admin key is set, allow access (useful for development)
-    if (!adminKey) {
-      console.warn('ADMIN_ACCESS_KEY not set - allowing access to /admin')
-      return NextResponse.next()
-    }
-
-    // Check for key in query parameter
-    const queryKey = request.nextUrl.searchParams.get('key')
-    
-    // Check for key in header
-    const headerKey = request.headers.get('x-admin-key')
-
-    // Validate key from either source
-    const providedKey = queryKey || headerKey
-
-    if (!providedKey || providedKey !== adminKey) {
-      return new NextResponse('Access Forbidden', { status: 403 })
-    }
+    // Check for key in query parameter
+    const queryKey = request.nextUrl.searchParams.get('key')
+    
+    // Check for key in header
+    const headerKey = request.headers.get('x-admin-key')
+
+    // Validate key from either source
+    const providedKey = queryKey || headerKey
+
+    // Block access if:
+    // 1. No admin key is configured in environment, OR
+    // 2. No key is provided in request, OR
+    // 3. Provided key doesn't match
+    if (!adminKey || !providedKey || providedKey !== adminKey) {
+      return new NextResponse('Access Forbidden', { status: 403 })
+    }
```

### 2. `src/app/page.tsx` - Suggest Button in Header

**Before**: Button only in bottom section, disappeared on search

**After**: 
- Button moved to header, always visible
- Positioned next to title (right side on desktop, below on mobile)
- Styled as prominent green button

```diff
-          <div className="text-center">
-            <h1 className="text-3xl font-bold text-gray-900">SG Motorbike Parking</h1>
-            <p className="mt-2 text-gray-600">Find motorcycle parking in Singapore</p>
-          </div>
+          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
+            <div className="text-center sm:text-left flex-1">
+              <h1 className="text-3xl font-bold text-gray-900">SG Motorbike Parking</h1>
+              <p className="mt-2 text-gray-600">Find motorcycle parking in Singapore</p>
+            </div>
+            
+            {/* Suggest button in header - always visible */}
+            <Link
+              href="/suggest"
+              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
+            >
+              <span>+</span>
+              <span>Suggest a Location</span>
+            </Link>
+          </div>
```

---

## ⚠️ IMPORTANT: Set Environment Variable in Vercel

For the admin protection to work, you **MUST** set the `ADMIN_ACCESS_KEY` environment variable in Vercel:

### Steps:

1. **Generate a secure key** (if you haven't already):
   ```bash
   openssl rand -hex 32
   ```

2. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/dashboard
   - Select your `sg-motorparking` project
   - Go to **Settings** → **Environment Variables**

3. **Add the variable**:
   - **Name**: `ADMIN_ACCESS_KEY`
   - **Value**: Your generated secret key
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

4. **Redeploy**:
   - Go to **Deployments** tab
   - Click **three dots (⋯)** on latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete

### Access Admin After Setting Key:

```
https://sg-motorparking.vercel.app/admin?key=YOUR_SECRET_KEY_HERE
```

---

## Testing

### Test Admin Protection:
1. ✅ Try accessing `/admin` without key → Should return 403
2. ✅ Try accessing `/admin?key=wrong-key` → Should return 403
3. ✅ Try accessing `/admin?key=CORRECT_KEY` → Should allow access

### Test Suggest Button:
1. ✅ Check header on main page → Button should be visible
2. ✅ Perform a search → Button should still be visible in header
3. ✅ Click button → Should navigate to `/suggest`

---

## Files Modified

1. `middleware.ts` - Stricter authentication logic
2. `src/app/page.tsx` - Moved suggest button to header

---

## Next Steps

1. **Deploy these changes** to Vercel
2. **Set `ADMIN_ACCESS_KEY`** in Vercel environment variables
3. **Redeploy** after setting the variable
4. **Test** admin access with your secret key

