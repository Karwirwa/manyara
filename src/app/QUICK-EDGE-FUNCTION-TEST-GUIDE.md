# 🚀 Quick Edge Function Testing Guide

## One-Minute Quick Test

### Step 1: Access the Tester
Add `?test-edge=true` to your app URL:
```
https://your-manyara-app.com/?test-edge=true
```

### Step 2: Click "Test All Endpoints"
The tester will automatically check all possible Edge Function paths.

### Step 3: Look for Green Success ✅
- You should see **"✅ Success (200)"** 
- Products Found: **861 products** (or similar number)
- Response will show actual product data

---

## What You're Looking For

### ✅ Success Response:
```json
{
  "success": true,
  "products": [...861 products...],
  "count": 861,
  "source": "sanity"
}
```

### ❌ Error Response (404):
```json
{
  "error": "Not found",
  "availableEndpoints": [...]
}
```

---

## The Issue Explained Simply

**The problem in your screenshot:**
- ❌ URL used: `...functions/v1/mRECQerveGCsOat7d/products`
- ✅ Should be: `...functions/v1/server/sanity-products`

The function name `mRECQerveGCsOat7d` doesn't exist in your project!

---

## Manual Test (if you prefer)

Open browser console and paste:

```javascript
// Test 1: Health Check
fetch('https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/health', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ'
  }
})
.then(r => r.json())
.then(d => console.log('Health:', d));

// Test 2: Get Products
fetch('https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ'
  }
})
.then(r => r.json())
.then(d => console.log('Products:', d.count, 'items'));
```

---

## Expected Result

When working correctly, you'll see:
```
Health: { status: "ok", message: "MANYARA Backend API", timestamp: "..." }
Products: 861 items
```

---

## If Still Getting 404

Check your Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Select project: **trtqbruuzdvlmzrzwrot**
3. Navigate to **Edge Functions**
4. Verify the function name listed there
5. Use THAT exact name in the URL

---

## File Structure

Your Edge Function is defined in:
```
/supabase/functions/server/index.tsx
```

The folder name `server` = the function path `/server/`

So your full URL should be:
```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products
                                                          ^^^^^^
                                                       folder name
```

---

## TL;DR

1. Visit app with `?test-edge=true`
2. Click "Test All Endpoints"
3. Look for the one that returns 200 with 861 products
4. That's your correct URL! ✅
