# 🧪 Test Edge Function - Quick Guide

## ✅ Correct Test Code

Use this code in your browser console to test the Edge Function:

```javascript
fetch("https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products", {
  headers: {
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ"
  }
})
  .then(res => res.json())
  .then(data => {
    console.log('📦 Products:', data);
    return data;
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });
```

## 🔍 What Changed

### ❌ Wrong Endpoint (Your Code):
```javascript
fetch(".../products", ...)  // ❌ This returns error message
```

### ✅ Correct Endpoint:
```javascript
fetch(".../sanity-products", ...)  // ✅ This fetches from Sanity
```

## 📋 Available Endpoints

### Public Endpoints (No Auth Needed)
```
GET  /health              → Check if Edge Function is running
```

### Authenticated Endpoints (Require Bearer Token)
```
GET  /sanity-products     → Fetch products from Sanity CMS ✅ USE THIS
GET  /sanity-categories   → Fetch categories from Sanity CMS

GET  /products            → Returns error (use /sanity-products instead)
POST /products            → Upload products to KV store (Admin)
GET  /kv-products         → Get products from KV store (Admin)
DELETE /products/:id      → Delete product from KV store (Admin)

POST /mpesa-stk-push      → Initiate M-Pesa payment
POST /orders              → Create new order
GET  /orders              → Get all orders (Admin)
GET  /orders/:id          → Get single order
PUT  /orders/:id          → Update order status
```

## 🧪 Test Commands

### 1. Test Health (No Auth)
```bash
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
```

**Expected:**
```json
{
  "status": "ok",
  "message": "MANYARA Backend API",
  "timestamp": "2026-01-16T..."
}
```

### 2. Test Products (With Auth) ✅
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ" \
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products
```

**Expected (with products in Sanity):**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Lace Bralette",
      "price": "KSh 1,200",
      "category": "Bras",
      ...
    }
  ],
  "count": 23,
  "source": "sanity"
}
```

**Expected (no products in Sanity):**
```json
{
  "success": true,
  "products": [],
  "count": 0,
  "source": "sanity",
  "message": "No products found in Sanity CMS"
}
```

### 3. Test Categories (With Auth)
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ" \
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-categories
```

## 🎯 Testing in Browser Console

### Quick Test Script
Open your browser console (F12) and paste:

```javascript
// Test function
async function testEdgeFunction() {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ";
  const baseUrl = "https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d";
  
  console.log('🧪 Testing Edge Function...\n');
  
  // Test 1: Health
  console.log('1️⃣ Testing /health endpoint...');
  try {
    const health = await fetch(`${baseUrl}/health`);
    const healthData = await health.json();
    console.log('✅ Health:', healthData);
  } catch (err) {
    console.error('❌ Health failed:', err);
  }
  
  // Test 2: Products
  console.log('\n2️⃣ Testing /sanity-products endpoint...');
  try {
    const products = await fetch(`${baseUrl}/sanity-products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const productsData = await products.json();
    console.log('✅ Products:', productsData);
    console.log(`📦 Found ${productsData.count || 0} products`);
  } catch (err) {
    console.error('❌ Products failed:', err);
  }
  
  // Test 3: Categories
  console.log('\n3️⃣ Testing /sanity-categories endpoint...');
  try {
    const categories = await fetch(`${baseUrl}/sanity-categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const categoriesData = await categories.json();
    console.log('✅ Categories:', categoriesData);
  } catch (err) {
    console.error('❌ Categories failed:', err);
  }
  
  console.log('\n🎉 Testing complete!');
}

// Run test
testEdgeFunction();
```

## 🔍 Understanding Responses

### ✅ Success Response
```json
{
  "success": true,
  "products": [...],
  "count": 23,
  "source": "sanity"
}
```

### ❌ 401 Error (Not Deployed Yet)
```
Error: Edge Function error: 401 Unauthorized
```
**Fix:** Deploy the Edge Function (see `/DEPLOY-EDGE-FUNCTION-NOW.md`)

### ⚠️ No Products (Empty Sanity)
```json
{
  "success": true,
  "products": [],
  "count": 0,
  "source": "sanity",
  "message": "No products found in Sanity CMS"
}
```
**Note:** This is normal if you haven't added products to Sanity yet

### ❌ Wrong Endpoint (/products)
```json
{
  "success": false,
  "message": "Please use /sanity-products endpoint",
  "products": []
}
```
**Fix:** Use `/sanity-products` instead of `/products`

## 📊 What Your Site Uses

Your MANYARA site automatically uses the correct endpoint:

```typescript
// In /utils/sanity/client.ts
const url = `${EDGE_FUNCTION_URL}/sanity-products`;  // ✅ Correct!
```

So you don't need to change anything in your code. Just test manually to verify the Edge Function is working.

## 🎯 Expected Flow

1. **Frontend calls:** `/sanity-products` with Authorization header
2. **Edge Function receives:** Request with Bearer token
3. **Edge Function fetches:** Products from Sanity CMS
4. **Edge Function transforms:** Sanity data to app format
5. **Edge Function returns:** JSON response with products
6. **Frontend displays:** Products in the UI

## ✅ Checklist

- [ ] Edge Function deployed (see `/DEPLOY-EDGE-FUNCTION-NOW.md`)
- [ ] Test `/health` endpoint (no auth needed)
- [ ] Test `/sanity-products` endpoint (with auth)
- [ ] Check browser console for errors
- [ ] Verify products display on site

## 📞 Quick Reference

**Base URL:**
```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d
```

**Your Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ
```

**Correct Endpoints:**
- ✅ `/sanity-products` - Fetch products
- ✅ `/sanity-categories` - Fetch categories
- ✅ `/health` - Check status

---

**Created:** January 16, 2026  
**Status:** Ready to test  
**Next:** Deploy Edge Function to fix 401 errors
