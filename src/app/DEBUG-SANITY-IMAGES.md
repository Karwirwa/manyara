# DEBUG: Why Are Sanity Images Not Being Detected?

## Quick Test (Do This First!)

Open your browser console and run:

```javascript
fetch('https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-raw', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyNTIxMjYsImV4cCI6MjA1MjgyODEyNn0.hZKGjIUq8TJzcF5yTKjnFb9WMUC2OsJkVTi-kUqLdC0'
  }
})
.then(r => r.json())
.then(data => {
  console.log('🔍 RAW SANITY DATA:');
  console.log('Total products:', data.productCount);
  console.log('First product:', data.firstProduct);
  console.log('\n📷 IMAGE CHECK:');
  console.log('imageUrl field:', data.firstProduct?.imageUrl);
  console.log('Has image?:', !!data.firstProduct?.imageUrl);
  console.log('\n📦 Full raw data:', data.rawData);
});
```

## What You're Looking For

### ✅ **If images WERE working before:**

The `firstProduct.imageUrl` should show something like:
```
https://cdn.sanity.io/images/ximq2iuj/production/abc123def456-1024x1024.jpg
```

### ❌ **If images are NOT being detected:**

The `firstProduct.imageUrl` will show:
```
null
```
OR
```
undefined
```

## Enhanced Logging

I've added comprehensive logging to the backend. Check Supabase Edge Function logs:

1. Go to Supabase Dashboard
2. Click "Edge Functions"
3. Click "Logs"
4. Look for these messages:

### **If Images ARE in Sanity:**
```
✅ Real Sanity image for: "Product Name" - https://cdn.sanity.io/images/...
✅ All 45 products have images!
```

### **If Images are NOT in Sanity:**
```
📷 Missing image for product: "Product Name" (category: Lingerie 2-piece sets)
⚠️ 45 products are missing images in Sanity CMS. Using category fallback images.
```

## What Changed?

### Changes I Just Made:

1. **Added `perspective=published`** to bypass CDN cache
2. **Added detailed logging** for every product's image status
3. **Created `/sanity-raw` endpoint** to see unprocessed Sanity data
4. **Added first product debug info** to see exactly what Sanity returns

### Possible Reasons Images Stopped Working:

1. **Products became unpublished (drafts)**
   - Someone clicked "Save" instead of "Publish"
   - GROQ queries only return published documents
   - Fix: Re-publish all products in Sanity Studio

2. **Sanity API permissions changed**
   - Project visibility was set to private
   - Fix: Go to Sanity project settings → API → Make dataset public

3. **Images were deleted from Sanity asset library**
   - Someone cleaned up "unused" assets
   - Fix: Re-upload images

4. **CDN caching issue**
   - Sanity's CDN was caching old (empty) data
   - Fix: Now using `perspective=published` to bypass cache

5. **Dataset changed**
   - Currently using: `production`
   - Maybe images are in a different dataset?
   - Check in Sanity Studio which dataset is active

## Immediate Actions

### Action 1: Check Sanity Studio
1. Go to https://ximq2iuj.sanity.studio
2. Click "Product" in sidebar
3. Open any product
4. Check if "Main Product Image" field has an image
5. Check if there's a "Draft" badge at the top

### Action 2: Run Diagnostic
Open console and run:
```javascript
checkSanityImages()
```

Look at the output:
- If "Unsplash Fallbacks" = 100% → Images are NOT in Sanity
- If "Real Sanity Images" > 0% → Some images ARE being detected

### Action 3: Check Raw API Response
```javascript
// Direct Sanity API test (no backend processing)
fetch('https://ximq2iuj.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=="product"]{name,"imageUrl":image.asset->url}')
.then(r => r.json())
.then(data => {
  console.log('📊 Products from Sanity:', data.result.length);
  console.table(data.result.map(p => ({
    name: p.name,
    hasImage: !!p.imageUrl,
    imageUrl: p.imageUrl?.substring(0, 50)
  })));
});
```

This bypasses the entire backend and queries Sanity directly.

## Decision Tree

```
START: Were images working before?
├─ YES
│  ├─ Check Sanity Studio → Are products still PUBLISHED?
│  │  ├─ YES → Images deleted from asset library
│  │  │       └─ Re-upload images
│  │  └─ NO → Products became drafts
│  │         └─ Re-publish all products
│  │
│  └─ Check Sanity API permissions
│     └─ Dataset might have become private
│
└─ NO (images never worked)
   └─ Images were never uploaded to Sanity
      └─ Upload images and publish
```

## What The Backend Is Doing NOW

### Step 1: Fetch from Sanity with fresh data
```typescript
const sanityUrl = `https://ximq2iuj.api.sanity.io/v2024-01-01/data/query/production
  ?query=*[_type=="product"]{...}
  &perspective=published`;  // ← NEW: Bypass CDN cache
```

### Step 2: Log what Sanity returns
```typescript
console.log('📦 Sanity raw response:', data);
console.log('📷 First product image check:', {
  name: data.result[0].name,
  imageUrl: data.result[0].imageUrl,  // ← This is what you need to check
  hasImageUrl: !!data.result[0].imageUrl
});
```

### Step 3: Detect missing images
```typescript
const hasImage = product.imageUrl && product.imageUrl.trim() !== '';
if (!hasImage) {
  console.log(`📷 Missing image for product: "${product.name}"`);
}
```

### Step 4: Apply fallback if missing
```typescript
return {
  imageUrl: hasImage ? product.imageUrl : fallbackImage
};
```

## What To Do Next

1. **Run the quick test** (at top of this file)
2. **Check Supabase logs** to see what's being logged
3. **Go to Sanity Studio** and verify:
   - Products exist
   - Products are published (no "Draft" badge)
   - Images are uploaded
4. **Report back** what you see in the raw Sanity data

## The Key Question

**Does the `/sanity-raw` endpoint show `imageUrl` as:**
- `null` → Images are NOT in Sanity (never were, or were deleted)
- `"https://cdn.sanity.io/..."` → Images ARE in Sanity (backend issue)

This will tell us if the problem is in Sanity CMS or in the backend processing.

---

**Run this NOW:**
```javascript
fetch('https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-raw', {
  headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyNTIxMjYsImV4cCI6MjA1MjgyODEyNn0.hZKGjIUq8TJzcF5yTKjnFb9WMUC2OsJkVTi-kUqLdC0'}
}).then(r => r.json()).then(console.log);
```

**Tell me what `firstProduct.imageUrl` shows!**
