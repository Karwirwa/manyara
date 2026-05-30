# ✅ Correct Edge Function URLs - Visual Reference

## 🔴 INCORRECT URL (From Your Screenshot)

```
❌ https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/mRECQerveGCsOat7d/products
                                                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                            This path doesn't exist!
```

**Result:** 
```json
{
  "error": "Not found"
}
```
**HTTP Status:** 404

---

## ✅ CORRECT URLS

### Option 1: Using `/server/` path (Recommended)

```
✅ https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/health
✅ https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products
✅ https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-raw
✅ https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/kv-products
```

### Option 2: Using `/make-server-5cb00c7d/` path (From client config)

```
✅ https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
✅ https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products
✅ https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-raw
✅ https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/kv-products
```

**Result:** 
```json
{
  "success": true,
  "products": [...861 products...],
  "count": 861
}
```
**HTTP Status:** 200 OK

---

## 📊 URL Anatomy Breakdown

```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products
│                                                           │      │
│                                                           │      └─ Endpoint path
│                                                           └─ Edge Function name
└─ Your Supabase project domain
```

### Key Parts:

1. **Base URL:** `https://trtqbruuzdvlmzrzwrot.supabase.co`
   - Your Supabase project domain
   - Project ID: `trtqbruuzdvlmzrzwrot`

2. **Functions Path:** `/functions/v1`
   - Standard Supabase Edge Functions route
   - `v1` is the API version

3. **Function Name:** `/server` or `/make-server-5cb00c7d`
   - Matches the folder name in `/supabase/functions/`
   - Your code is in `/supabase/functions/server/index.tsx`
   - So function name is `server`

4. **Endpoint Path:** `/sanity-products`, `/health`, etc.
   - Defined in your Edge Function code
   - Different routes handle different requests

---

## 🎯 Quick Copy-Paste URLs

### For Browser Testing:

**Health Check:**
```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/health
```

**Get All Products:**
```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products
```

**Debug Raw Data:**
```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-raw
```

### For cURL Testing:

```bash
# Health Check
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/health

# Get Products (with auth)
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ" \
  https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products
```

---

## 🔍 How to Find Your Edge Function Name

### Method 1: Check Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select project: **trtqbruuzdvlmzrzwrot**
3. Click **Edge Functions** in sidebar
4. Look at the list - the name shown is what you use in the URL

### Method 2: Check Your File Structure
```
/supabase/functions/
  └── server/              ← This folder name = function name
      └── index.tsx
```

The folder name `server` means your function URL includes `/server/`

### Method 3: Check Deployment Logs
When you deploy, Supabase shows:
```
Deployed function server
URL: https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server
```

---

## 📝 Common Mistakes

### ❌ Wrong Endpoint Name
```
https://.../functions/v1/server/products  ← Wrong! Should be "sanity-products"
```

### ❌ Wrong Function Name
```
https://.../functions/v1/mRECQerveGCsOat7d/...  ← This doesn't exist
```

### ❌ Missing /functions/v1
```
https://.../server/sanity-products  ← Missing /functions/v1
```

### ❌ Wrong HTTP Method
Using GET when endpoint expects POST, etc.

---

## ✅ Verification Checklist

Before testing, verify:

- [ ] Project ID is correct: `trtqbruuzdvlmzrzwrot`
- [ ] Using `/functions/v1/` in path
- [ ] Function name matches folder: `server`
- [ ] Endpoint name is correct: `sanity-products`
- [ ] Full URL: `https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products`
- [ ] Authorization header included (for protected endpoints)
- [ ] Using correct HTTP method (GET for products)

---

## 🎨 Visual Comparison

### Your Test (404 Error) vs Correct URL

```diff
- https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/mRECQerveGCsOat7d/products
+ https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products

- HTTP 404 Not Found
+ HTTP 200 OK

- { "error": "Not found" }
+ { "success": true, "products": [...], "count": 861 }
```

---

## 🚀 Next Steps

1. **Copy the correct URL** from above
2. **Paste into browser** or your test tool
3. **Add Authorization header** (for authenticated endpoints)
4. **Verify you get 200 OK** with products data

Or simply:

**Visit your app with `?test-edge=true` and click "Test All Endpoints"** 🎯

---

## 📞 Still Not Working?

If you still get errors after using the correct URLs:

1. **Check Supabase Dashboard**
   - Verify function is deployed
   - Check function logs for errors
   - Verify project ID

2. **Use the Built-in Tester**
   - Visit `?test-edge=true`
   - It will test ALL possible paths
   - Shows which one works

3. **Check Browser Console**
   - Look for CORS errors
   - Check network tab for actual request
   - Verify Authorization header is present

---

## 💡 Pro Tip

The built-in Edge Function Tester (`?test-edge=true`) automatically tests all these paths for you and shows which one is working. Use it instead of manual testing!

---

**Bottom Line:** Change `mRECQerveGCsOat7d` to `server` and you're golden! ✨
