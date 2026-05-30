# 🚨 URGENT: Fixing 404 Errors - Backend Not Accessible

## The Problem

You're getting these errors:
```
Sanity CMS response not OK: 404
Supabase KV response not OK: 404
⚠️ Backend unavailable - using fallback products
Error while deploying: XHR for "/api/integrations/supabase/.../edge_functions/make-server/deploy" failed with status 403
```

## Root Cause Analysis

### Issue 1: Edge Function Doesn't Exist or Was Deleted
The frontend is trying to reach `make-server-5cb00c7d` but getting 404. This means:
- The edge function was never deployed, OR
- It was deleted/removed, OR
- The name changed

### Issue 2: Deployment Permission Denied (403)
Figma Make is trying to auto-deploy but lacks credentials.

### Issue 3: Anon Key Changed
Your Supabase anon key was regenerated:
- **Old key** (in docs): `...KqLdC0` (expired: Jan 2026 - EXPIRED!)
- **New key** (current): `...PYYq` (expires: 2074 - VALID)

## 🎯 Solution: Redeploy Edge Function Manually

You need to deploy the edge function yourself through Supabase Dashboard.

### Step 1: Go to Supabase Dashboard

1. Open https://supabase.com/dashboard
2. Select your project: `trtqbruuzdvlmzrzwrot`
3. Click "Edge Functions" in the left sidebar

### Step 2: Create New Edge Function

**Option A: If `make-server-5cb00c7d` Exists**
1. Click on it
2. Click "Edit"
3. Copy the code from `/supabase/functions/server/index.tsx` (see below)
4. Also create `kv_store.tsx` file with code from `/supabase/functions/server/kv_store.tsx`
5. Click "Deploy"

**Option B: If No Edge Functions Exist**
1. Click "Create a new function"
2. Name it: `make-server-5cb00c7d`
3. Paste the code (see below)
4. Click "Deploy"

### Step 3: Code to Deploy

You need TWO files in your edge function:

#### File 1: `index.ts` (Main)

Copy ENTIRE contents from: `/supabase/functions/server/index.tsx`

OR use the Supabase CLI:
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref trtqbruuzdvlmzrzwrot

# Deploy the function
cd /path/to/your/project
supabase functions deploy make-server-5cb00c7d \
  --project-ref trtqbruuzdvlmzrzwrot
```

#### File 2: `kv_store.tsx` (Helper)

Copy from: `/supabase/functions/server/kv_store.tsx`

### Step 4: Test Deployment

After deploying, open `/test-backend.html` in your browser or run:

```javascript
// Test in browser console
fetch('https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend:', d));
```

Expected response:
```json
{
  "status": "ok",
  "message": "MANYARA Backend API",
  "timestamp": "2026-01-11T..."
}
```

## 🔧 Alternative: Deploy via Supabase Dashboard UI

### Manual Deployment Steps:

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard/project/trtqbruuzdvlmzrzwrot

2. **Navigate to Edge Functions**
   - Left sidebar → "Edge Functions"

3. **Create New Function**
   - Click "New Edge Function"
   - Name: `make-server-5cb00c7d`

4. **Paste Code**
   - Copy ALL code from `/supabase/functions/server/index.tsx`
   - Paste into the editor

5. **Add KV Store Helper**
   - If multi-file support: Add `kv_store.tsx`
   - If single file only: Inline the KV code into `index.tsx`

6. **Configure**
   - Set environment variables if needed:
     - `SANITY_PROJECT_ID`: `ximq2iuj`
     - `SANITY_DATASET`: `production`

7. **Deploy**
   - Click "Deploy" button
   - Wait for deployment to complete

8. **Verify**
   - Copy the function URL
   - Should be: `https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d`

## 🧪 Verification Checklist

After deploying, test these endpoints:

### ✅ Health Check
```bash
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
```

### ✅ Sanity Products
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ" \
  https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products
```

### ✅ Raw Sanity Debug
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ" \
  https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-raw
```

## 📋 Quick Reference

### Your Supabase Info
- **Project ID**: `trtqbruuzdvlmzrzwrot`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ`
- **Edge Function**: `make-server-5cb00c7d`
- **Base URL**: `https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d`

### Your Sanity Info
- **Project ID**: `ximq2iuj`
- **Dataset**: `production`
- **Studio**: https://ximq2iuj.sanity.studio

## 🚨 If Deployment Still Fails

### Option 1: Simplify the Function
Instead of multi-file, combine everything into one `index.ts`:

1. Copy `/supabase/functions/server/index.tsx`
2. Copy `/supabase/functions/server/kv_store.tsx`
3. Paste KV store code at the TOP of index.tsx
4. Remove the `import * as kv from "./kv_store.tsx";` line
5. Deploy as single file

### Option 2: Use Supabase CLI
```bash
# Install CLI
brew install supabase/tap/supabase
# or
npm install -g supabase

# Login
supabase login

# Initialize in project
supabase init

# Deploy
supabase functions deploy make-server-5cb00c7d
```

### Option 3: Contact Support
If nothing works:
1. Check Supabase Status: https://status.supabase.com/
2. Check Supabase Discord: https://discord.supabase.com/
3. Check if free tier has limits

## 🎯 Expected Outcome

After successful deployment:

1. ✅ Health endpoint returns 200 OK
2. ✅ Sanity products endpoint returns products
3. ✅ Frontend loads products from Sanity
4. ✅ No more 404 errors
5. ✅ Can place orders
6. ⚠️ May still see 403 deployment error (ignore - it's cosmetic)

## 📊 Troubleshooting Table

| Error | Meaning | Solution |
|-------|---------|----------|
| 404 on `/health` | Function not deployed | Deploy via dashboard |
| 403 on deploy | No deploy permissions | Deploy manually (not via Figma) |
| 401 on endpoints | Wrong anon key | Use new key: `...PYYq` |
| 500 on `/sanity-products` | Sanity API error | Check Sanity project settings |
| Empty products array | No products in Sanity | Add products in Sanity Studio |

## ✅ Success Indicators

You'll know it's working when:

1. Browser console shows:
   ```
   ✅ Fetched 45 products from Sanity CMS
   📊 Category distribution: {...}
   ```

2. Network tab shows:
   ```
   sanity-products → 200 OK → 45 products
   ```

3. No more "Backend unavailable" warnings

4. Products display with proper images (or category fallbacks)

## 🎬 Next Steps After Fixing

Once backend is deployed:

1. **Upload Product Images**
   - Go to https://ximq2iuj.sanity.studio
   - Edit each product
   - Upload image
   - Click "Publish" (not just Save)

2. **Test Image Detection**
   ```javascript
   checkSanityImages()
   ```

3. **Verify Categories**
   ```javascript
   goToDiagnostic()
   ```

---

**IMMEDIATE ACTION REQUIRED:**
Deploy the edge function manually via Supabase Dashboard NOW to fix the 404 errors.
