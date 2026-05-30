# 🚀 Quick Deployment Guide - Fix 403 Error

## The Problem

You got this error:
```
❌ Error while deploying: XHR for "/api/integrations/supabase/10WBrElbGlciFKK7bWCPFq/edge_functions/make-server/deploy" failed with status 403
```

**Translation:** Figma Make cannot deploy to Supabase directly. You need to deploy manually.

---

## ✅ Solution: Choose One Method

### Method 1: Supabase Dashboard (Easiest - No Installation)

**Time Required:** 5 minutes  
**Requires:** Web browser only

#### Steps:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/trtqbruuzdvlmzrzwrot
   - Login if needed

2. **Navigate to Edge Functions**
   - Click **"Edge Functions"** in left sidebar
   - Click **"Create a new function"** button

3. **Create Function**
   - **Function name:** `make-server-5cb00c7d`
   - Click **"Create function"**

4. **Copy the Code**
   - Open this file: `/supabase/functions/make-server-5cb00c7d-DASHBOARD-VERSION.tsx`
   - Select ALL the code (Ctrl+A / Cmd+A)
   - Copy it (Ctrl+C / Cmd+C)

5. **Paste into Dashboard**
   - In the Supabase dashboard editor, delete any default code
   - Paste your copied code (Ctrl+V / Cmd+V)

6. **Deploy**
   - Click the **"Deploy function"** button
   - Wait for deployment to complete (30-60 seconds)

7. **Test It**
   - Visit this URL in your browser:
   ```
   https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
   ```
   - You should see:
   ```json
   {
     "status": "ok",
     "message": "MANYARA Backend API",
     "timestamp": "2026-01-16T..."
   }
   ```

✅ **Done!** If you see that response, deployment was successful!

---

### Method 2: Supabase CLI (More Powerful)

**Time Required:** 10 minutes  
**Requires:** Terminal/Command Prompt, Node.js

#### Steps:

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```
   - This opens your browser
   - Authorize the CLI
   - Return to terminal

3. **Rename the Function Folder**
   
   The folder is named `server` but needs to be `make-server-5cb00c7d`.
   
   **Option A: Manual**
   - Navigate to `/supabase/functions/`
   - Rename `server` folder to `make-server-5cb00c7d`
   
   **Option B: Terminal**
   ```bash
   cd supabase/functions
   mv server make-server-5cb00c7d
   ```

4. **Deploy**
   ```bash
   supabase functions deploy make-server-5cb00c7d --project-ref trtqbruuzdvlmzrzwrot
   ```

5. **Test**
   ```bash
   curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
   ```

✅ **Done!** If you see the health check response, it worked!

---

## After Successful Deployment

### Step 1: Test All Endpoints

Open these URLs in your browser:

```
✅ Health Check:
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health

✅ Sanity Products:
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products

✅ KV Products:
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/kv-products
```

All should return JSON responses (not errors).

---

### Step 2: Re-enable Admin Panel Features

Now that the backend is deployed, you need to remove the early returns from the admin panel.

**Edit this file:** `/components/AdminPage.tsx`

**Find and remove these sections:**

#### 1. Remove lines 50-54 (fetchProducts early return):
```typescript
// DELETE THESE LINES:
    // Backend not deployed - skip fetch
    console.log('⚠️ Backend not deployed - Product upload functionality requires manual Supabase Edge Function deployment');
    setExistingProducts([]);
    setMessage({ type: 'info', text: 'Backend not deployed. See documentation for deployment instructions.' });
    return;
```

**Then uncomment the code below it** (remove the `/*` and `*/`)

---

#### 2. Remove lines 93-95 (fetchDebugInfo early return):
```typescript
// DELETE THESE LINES:
    // Backend not deployed - skip fetch
    console.log('⚠️ Debug endpoint requires deployed backend');
    return;
```

**Then uncomment the code below it**

---

#### 3. Remove lines 124-130 (handleUpload early return):
```typescript
// DELETE THESE LINES:
    // Backend not deployed - cannot upload
    setMessage({ 
      type: 'error', 
      text: 'Backend not deployed. Product upload requires Edge Function deployment. See PRODUCT-MANAGEMENT-ERROR-ANALYSIS.md for deployment instructions.' 
    });
    return;
```

**Then uncomment the code below it**

---

#### 4. Remove lines 193-199 (handleDelete early return):
```typescript
// DELETE THESE LINES:
    // Backend not deployed - cannot delete
    setMessage({ 
      type: 'error', 
      text: 'Backend not deployed. Product deletion requires Edge Function deployment. See PRODUCT-MANAGEMENT-ERROR-ANALYSIS.md for deployment instructions.' 
    });
    return;
```

**Then uncomment the code below it**

---

#### 5. Remove lines 231-236 (fetchSanityProducts early return):
```typescript
// DELETE THESE LINES:
    // Backend not deployed - cannot fetch from Sanity via backend
    setMessage({ 
      type: 'error', 
      text: 'Backend not deployed. Sanity CMS integration requires manual Edge Function deployment. See documentation.' 
    });
    return;
```

**Then uncomment the code below it**

---

### Step 3: Test Admin Panel

1. **Open your MANYARA site**
2. **Click "Admin Panel"**
3. **Should see:** Loading products from KV store (or "0 products")
4. **Click "Import from Sanity CMS"**
5. **Should see:** Products loading from Sanity
6. **Try uploading a product**
7. **Should work!**

---

## Troubleshooting

### Problem: Still getting 403 error

**Solution:** You're still trying to deploy through Figma Make. Use the Dashboard or CLI method above instead.

---

### Problem: "Function not found" error

**Solution:** The function name doesn't match.

**Fix:** Make sure the function is named exactly `make-server-5cb00c7d`

---

### Problem: Dashboard shows error after pasting code

**Solution:** Make sure you copied ALL the code from the dashboard version file.

**Fix:** 
1. Open `/supabase/functions/make-server-5cb00c7d-DASHBOARD-VERSION.tsx`
2. Select everything (Ctrl+A)
3. Copy (Ctrl+C)
4. Paste into dashboard
5. Deploy

---

### Problem: Admin panel still shows "Backend not deployed"

**Solution:** You haven't removed the early returns yet.

**Fix:** Follow "Step 2: Re-enable Admin Panel Features" above

---

## Summary

### Before:
- ❌ 403 error when deploying
- ❌ Admin panel non-functional
- ❌ Cannot upload/delete products

### After:
- ✅ Backend deployed successfully
- ✅ Admin panel fully functional
- ✅ Can import from Sanity CMS
- ✅ Can upload/delete products
- ✅ All endpoints working

---

## Quick Reference

**Supabase Dashboard:**
https://supabase.com/dashboard/project/trtqbruuzdvlmzrzwrot

**Function Name:**
`make-server-5cb00c7d`

**Code File for Dashboard:**
`/supabase/functions/make-server-5cb00c7d-DASHBOARD-VERSION.tsx`

**Test URL:**
```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
```

---

## Need Help?

**Detailed Guide:** See `/DEPLOYMENT-403-ERROR-FIX.md`

**Backend Config:** See `/BACKEND-CONFIGURATION-REPORT.md`

**Error Analysis:** See `/PRODUCT-MANAGEMENT-ERROR-ANALYSIS.md`

---

**The 403 error is fixed by deploying manually through Supabase Dashboard or CLI. Figma Make cannot deploy Edge Functions for security reasons.**
