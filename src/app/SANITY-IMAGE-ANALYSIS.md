# Sanity Image Loading Analysis

## Problem
The website is not displaying real product images from Sanity CMS. Instead, it's showing Unsplash fallback images.

## Root Cause Analysis

### 1. **How Images Are Fetched**

The backend GROQ query (`/supabase/functions/server/index.tsx`, line 79-90) fetches images like this:

```groq
*[_type == "product"]{
  _id,
  name,
  price,
  sizes,
  color,
  "category": category->title,
  "imageUrl": image.asset->url,  // ← This is the key line
  shortDescription,
  longDescription,
  "additionalImages": additionalImages[].asset->url
}
```

### 2. **Why Images Might Not Load**

The `image.asset->url` query will return `null` or empty string if:

#### ❌ **Problem A: Images Not Uploaded**
- Products exist in Sanity but have no images attached
- **Solution**: Upload images to each product in Sanity Studio

#### ❌ **Problem B: Images Not Published**
- Images are uploaded but the product document is saved as a DRAFT
- GROQ queries only return PUBLISHED documents
- **Solution**: Click "Publish" (not just "Save") in Sanity Studio

#### ❌ **Problem C: Image Field Misconfigured**
- The field name in Sanity schema doesn't match the GROQ query
- Schema expects `image` but actual field is named differently
- **Solution**: Verify schema field names match

#### ❌ **Problem D: Asset References Broken**
- Images were deleted from Sanity's asset library
- References exist but point to non-existent assets
- **Solution**: Re-upload images

### 3. **Current Fallback System**

When `imageUrl` is empty, the backend automatically uses category-based Unsplash fallbacks (lines 114-139):

```typescript
const categoryFallbackImages = {
  "Bodyshapers": "https://images.unsplash.com/photo-1646932520067...",
  "Bodystockings": "https://images.unsplash.com/photo-1738789646880...",
  // ... etc
};

const hasImage = product.imageUrl && product.imageUrl.trim() !== '';
const fallbackImage = categoryFallbackImages[product.category] || "...";

return {
  imageUrl: hasImage ? product.imageUrl : fallbackImage  // ← Fallback applied here
};
```

### 4. **How to Verify What Sanity Is Returning**

#### Option 1: Use the Diagnostic Page
Navigate to the diagnostic page by opening browser console and running:
```javascript
// Temporarily switch to diagnostic view
window.location.hash = '#diagnostic';
```

#### Option 2: Check Browser Console
The backend logs information about missing images:
```
⚠️ X products are missing images in Sanity CMS. Using category fallback images.
💡 To fix: Upload images to these products in Sanity Studio (https://ximq2iuj.sanity.studio)
```

#### Option 3: Direct API Test
Open browser console and run:
```javascript
fetch('https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyNTIxMjYsImV4cCI6MjA1MjgyODEyNn0.hZKGjIUq8TJzcF5yTKjnFb9WMUC2OsJkVTi-kUqLdC0',
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => {
  console.log('Total products:', data.products?.length);
  console.log('Products WITHOUT images:', data.productsWithoutImages);
  console.table(data.products.map(p => ({
    name: p.name,
    hasImage: !!p.imageUrl && !p.imageUrl.includes('unsplash'),
    imageUrl: p.imageUrl?.substring(0, 60)
  })));
});
```

## Step-by-Step Fix

### Step 1: Access Sanity Studio
1. Go to https://ximq2iuj.sanity.studio
2. Log in with your Sanity account

### Step 2: Check Product Documents
1. Click on "Product" in the left sidebar
2. Open any product document
3. Look for the "Main Product Image" field

### Step 3: Upload Images
For each product:
1. Click the "Main Product Image" upload area
2. Upload a high-quality product image
3. Optionally add more images to "Additional Images"
4. **IMPORTANT**: Click "Publish" (green button), NOT just "Save"

### Step 4: Verify in Sanity Vision
1. In Sanity Studio, click "Vision" (developer tool)
2. Paste this query:
```groq
*[_type == "product"]{
  name,
  "imageUrl": image.asset->url,
  "hasImage": defined(image.asset->url)
}
```
3. Click "Execute"
4. Verify that `imageUrl` fields contain actual CDN URLs like:
   - ✅ `https://cdn.sanity.io/images/ximq2iuj/production/xxx.jpg`
   - ❌ NOT `null` or empty

### Step 5: Clear Cache & Reload
1. In your website, open browser DevTools (F12)
2. Right-click the reload button → "Empty Cache and Hard Reload"
3. Check the console for:
   ```
   ✅ Loaded X products from Sanity CMS
   ```

## Expected Image URLs

**Correct Sanity Image URL format:**
```
https://cdn.sanity.io/images/ximq2iuj/production/[image-hash].[ext]?[params]
```

**Incorrect (fallback) URL format:**
```
https://images.unsplash.com/photo-...
```

## Debugging Checklist

- [ ] Products exist in Sanity Studio
- [ ] Products are PUBLISHED (not drafts)
- [ ] "Main Product Image" field is filled
- [ ] Images show in Sanity Studio preview
- [ ] Vision query returns actual CDN URLs
- [ ] Backend console shows 0 products without images
- [ ] Frontend console shows products loaded from Sanity
- [ ] Product cards display Sanity CDN URLs (not Unsplash)

## Quick Test

Run this in browser console after page loads:
```javascript
const products = window.__products;
if (products) {
  const sanityImages = products.filter(p => p.imageUrl?.includes('cdn.sanity.io'));
  const fallbackImages = products.filter(p => p.imageUrl?.includes('unsplash'));
  console.log(`✅ Real Sanity images: ${sanityImages.length}`);
  console.log(`⚠️ Fallback images: ${fallbackImages.length}`);
  console.log('Sample product:', products[0]);
} else {
  console.error('Products not loaded yet. Wait a moment and try again.');
}
```

## Contact Support

If images still don't load after following all steps:
1. Check Sanity project permissions (API must be publicly readable)
2. Verify Sanity project ID: `ximq2iuj`
3. Verify dataset: `production`
4. Check CORS settings in Sanity project settings

---

**Last Updated**: January 2026
**Sanity Project**: https://ximq2iuj.sanity.studio
**Dataset**: production
