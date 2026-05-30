# 🚨 EDGE FUNCTION NEEDS REDEPLOYMENT

## ⚠️ Issue Fixed: 401 Authentication Error

The 401 error was caused by:
1. Missing CORS configuration in Edge Function
2. Missing Authorization header in frontend requests

## ✅ Changes Made

### 1. Frontend Updated ✅
**File:** `/utils/sanity/client.ts`
- Added `Authorization: Bearer {anonKey}` header to all Edge Function requests
- This is already live in your frontend code

### 2. Edge Function Updated ✅
**File:** `/supabase/functions/make-server-5cb00c7d-DASHBOARD-VERSION.tsx`
- Enhanced CORS configuration to accept Authorization headers
- Configured proper allowed methods and origins

## 🔧 REQUIRED ACTION: Redeploy Edge Function

**You must redeploy the Edge Function for the fixes to take effect.**

### Option A: Deploy via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/trtqbruuzdvlmzrzwrot/functions
   ```

2. **Find your Edge Function**
   - Look for: `make-server-5cb00c7d`
   - Click on it

3. **Click "Deploy"**
   - You should see a Deploy button
   - Or click the 3-dot menu → Deploy new version

4. **Copy the updated code**
   - Open `/supabase/functions/make-server-5cb00c7d-DASHBOARD-VERSION.tsx`
   - Copy the ENTIRE file contents
   - Paste into the Supabase editor
   - Click Deploy

5. **Wait for deployment**
   - Takes 10-30 seconds
   - You'll see a success message

6. **Test the fix**
   ```bash
   curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
   ```
   Should return: `{"status":"ok",...}`

### Option B: Deploy via Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to your project
cd /path/to/your/project

# Deploy the Edge Function
supabase functions deploy make-server-5cb00c7d --project-ref trtqbruuzdvlmzrzwrot
```

## 🧪 Verify the Fix

### Step 1: Test Edge Function Directly
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ" \
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products
```

**Expected Result:**
```json
{
  "success": true,
  "products": [...],
  "count": X,
  "source": "sanity"
}
```

### Step 2: Test in Your Site
1. Hard refresh your MANYARA site (Ctrl+Shift+R)
2. Open browser console (F12)
3. Look for:
   ```
   ✅ Fetched X products from Sanity via Edge Function
   ```
4. No more 401 errors!

## 📋 What Was Changed in Edge Function

### Before:
```typescript
app.use("/*", cors());
```

### After:
```typescript
app.use("/*", cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
```

This tells the Edge Function to:
- Accept requests from any origin
- Allow Authorization headers
- Handle preflight OPTIONS requests
- Enable credentials for authenticated requests

## ❌ What Happens If You Don't Redeploy?

The frontend code is updated to send Authorization headers, but:
- The Edge Function still has the old CORS config
- 401 errors will continue
- Products won't load from Sanity
- Site will fallback to mock data

## ✅ After Successful Redeployment

You'll see in console:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎀 MANYARA Luxury Lingerie E-Commerce 🎀
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Application Status: FULLY OPERATIONAL
📦 Data Source: Sanity CMS via Edge Function
🔗 Edge Function: make-server-5cb00c7d
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Fetching products from Sanity CMS via Edge Function...
🔗 Fetching from Edge Function: https://trtqbruuzdvlmzrzwrot...
✅ Fetched 23 products from Sanity via Edge Function
✅ Loaded 23 products from Sanity via Edge Function
```

No errors! Clean console output! 🎉

## 🆘 If You Still Get 401 After Redeploying

### Check 1: Verify Deployment
- Go to Supabase Dashboard → Edge Functions
- Check that `make-server-5cb00c7d` shows recent deployment time
- Click on it to see the code - verify CORS config is there

### Check 2: Hard Refresh Frontend
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### Check 3: Test Health Endpoint
```bash
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
```
Should work WITHOUT auth header (it's a public endpoint)

### Check 4: Test with Auth Header
```bash
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products
```

### Check 5: Look at Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Find request to `make-server-5cb00c7d`
5. Click on it
6. Check Headers → Request Headers
7. Verify `Authorization` header is present

## 📞 Summary

**What you need to do:**
1. ✅ Frontend is already fixed (no action needed)
2. 🔧 Redeploy Edge Function with updated CORS config
3. 🧪 Test to verify 401 error is gone
4. 🎉 Enjoy products loading from Sanity!

**Estimated time:** 5 minutes

---

**Created:** January 16, 2026  
**Priority:** HIGH - Required for Sanity integration to work  
**Status:** Waiting for Edge Function redeployment
