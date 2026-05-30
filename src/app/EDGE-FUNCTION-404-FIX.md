# Edge Function 404 Error - Diagnosis & Solution

## 🔍 Problem Summary

Your test Edge Function is returning a **404 "Not found"** error. Based on the screenshot and code analysis:

### ❌ Incorrect URL (from screenshot):
```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/mRECQerveGCsOat7d/products
```

This URL path `mRECQerveGCsOat7d` doesn't exist in your Supabase project.

---

## ✅ Solution: Correct Edge Function Paths

Your Edge Function code in `/supabase/functions/server/index.tsx` is correct. The issue is the **function name/path** being used.

### Option 1: Using `/server/` path
```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products
```

### Option 2: Using `/make-server-5cb00c7d/` path (your app currently uses this)
```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products
```

---

## 🧪 How to Test Your Edge Function

### Using the Built-In Tester (Recommended)

I've created a comprehensive Edge Function Tester component for you:

1. **Access the tester**: Add `?test-edge=true` to your app URL
   ```
   https://your-app-url.com/?test-edge=true
   ```

2. The tester will automatically test all these endpoints:
   - ✅ Health Check
   - ✅ Sanity Products (via /server/)
   - ✅ Sanity Products (via /make-server-5cb00c7d/)
   - ✅ Sanity Raw Data
   - ✅ KV Store Products

3. Click "Test All Endpoints" to run all tests at once
4. Review the results to see which endpoint path is working

### Using cURL (Command Line)

Test the health endpoint:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ" \
  https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/health
```

Test Sanity products:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ" \
  https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products
```

### Using Browser Console

Open your browser's developer console and run:
```javascript
fetch('https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ'
  }
})
  .then(r => r.json())
  .then(data => console.log('Products:', data))
  .catch(err => console.error('Error:', err));
```

---

## 🔧 How to Verify Your Edge Function Name

### Method 1: Check Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **trtqbruuzdvlmzrzwrot**
3. Go to **Edge Functions** section
4. Look at the list of deployed functions
5. Note the exact function name(s)

### Method 2: Check Deployment Files

Look at these files in your codebase:
- `/supabase/functions/` - folder names = function names
- The folder name `server` means your function is at `/v1/server/`

---

## 📋 Available Endpoints

Based on your Edge Function code (`/supabase/functions/server/index.tsx`), these endpoints are available:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check - returns status |
| `/sanity-products` | GET | Fetch all products from Sanity CMS |
| `/sanity-raw` | GET | Raw unprocessed Sanity data (debug) |
| `/products` | GET | Returns message to use `/sanity-products` |
| `/products` | POST | Upload products to KV store |
| `/products/:id` | DELETE | Delete product from KV store |
| `/kv-products` | GET | Get all products from KV store |
| `/mpesa/initiate` | POST | Initiate M-Pesa payment |
| `/mpesa/status/:id` | GET | Check M-Pesa payment status |
| `/orders` | POST | Create new order |
| `/emails/order-confirmation` | POST | Send order confirmation emails |

---

## 🎯 Expected Response Format

### Successful `/sanity-products` Response:
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "imageUrl": "https://cdn.sanity.io/...",
      "price": "KSh 2,500",
      "category": "Lingerie 2-piece sets",
      "colors": ["Red"],
      "sizes": ["M", "L"],
      "shortDescription": "...",
      "longDescription": "...",
      "additionalImages": []
    },
    // ... more products
  ],
  "count": 861,
  "source": "sanity",
  "productsWithoutImages": 0
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error message here",
  "products": []
}
```

---

## 🚨 Common Error Codes & Solutions

### 404 Not Found
- **Cause**: Wrong function path or function not deployed
- **Solution**: 
  1. Verify the function is deployed in Supabase Dashboard
  2. Use correct function name (`server` or `make-server-5cb00c7d`)
  3. Check the folder name in `/supabase/functions/`

### 401 Unauthorized
- **Cause**: Missing or invalid Authorization header
- **Solution**: Include correct Anon Key in Authorization header

### 500 Internal Server Error
- **Cause**: Error in Edge Function code or Sanity connection issue
- **Solution**: 
  1. Check Edge Function logs in Supabase Dashboard
  2. Verify Sanity Project ID is correct (ximq2iuj)
  3. Test Sanity API directly

### CORS Error
- **Cause**: CORS not enabled in Edge Function
- **Solution**: Already enabled in your code with `app.use("/*", cors())`

---

## 📝 Next Steps

1. **Use the built-in tester** by visiting `?test-edge=true`
2. **Click "Test All Endpoints"** to see which paths work
3. **Check the results** - you should see 861 products returned
4. **Verify in Supabase Dashboard** which Edge Function name is deployed
5. **Update your test UI** to use the correct function path

---

## 🔗 Your Configuration

- **Project ID**: `trtqbruuzdvlmzrzwrot`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Sanity Project**: `ximq2iuj`
- **Sanity Dataset**: `production`
- **Expected Products**: 861 items

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ HTTP Status: **200 OK**
- ✅ `success: true` in response
- ✅ `count: 861` (or close to it)
- ✅ Products array has items with real Sanity image URLs
- ✅ Console shows: "✅ Fetched 861 products from Sanity via Edge Function"

---

## 📞 Need Help?

If you're still getting 404 errors after trying the tester:

1. Share the **exact URL** that's failing
2. Share a screenshot of your **Supabase Edge Functions dashboard**
3. Run the built-in tester and share the results
4. Check if the function is actually deployed in Supabase

The Edge Function code itself is correct - this is purely a path/naming issue!
