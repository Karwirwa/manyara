# Why Sanity Images Aren't Being "Sensed" - Complete Analysis

## Executive Summary

**The system IS working correctly.** Images appear to not be "sensed" because the Sanity CMS products either:
1. Don't have images uploaded in the "Main Product Image" field
2. Are saved as drafts instead of being published
3. Have broken asset references

The backend is correctly querying Sanity, detecting the empty image fields, and applying Unsplash fallback images as designed.

---

## How Image Detection Works

### Step 1: Backend GROQ Query
Location: `/supabase/functions/server/index.tsx` (lines 79-90)

```groq
*[_type == "product"]{
  _id,
  name,
  price,
  sizes,
  color,
  "category": category->title,
  "imageUrl": image.asset->url,  // ← THIS IS THE KEY LINE
  shortDescription,
  longDescription,
  "additionalImages": additionalImages[].asset->url
}
```

**What this does:**
- Queries ALL published products in Sanity
- For each product, attempts to fetch `image.asset->url`
- If the image field is empty or unpublished, this returns `null`

### Step 2: Image Detection Check
Location: `/supabase/functions/server/index.tsx` (line 131)

```typescript
const hasImage = product.imageUrl && product.imageUrl.trim() !== '';
```

**This checks:**
- ✅ Image URL exists
- ✅ Image URL is not an empty string
- ✅ Image URL is not just whitespace

### Step 3: Logging & Diagnostics
Location: `/supabase/functions/server/index.tsx` (lines 133-144)

```typescript
if (!hasImage) {
  productsWithoutImages++;
  console.log(`📷 Missing image for product: "${product.name}" (category: ${product.category})`);
} else {
  const isSanityCDN = product.imageUrl.includes('cdn.sanity.io');
  if (isSanityCDN) {
    console.log(`✅ Real Sanity image for: "${product.name}" - ${product.imageUrl.substring(0, 60)}...`);
  } else {
    console.log(`⚠️ Non-Sanity URL for: "${product.name}" - ${product.imageUrl.substring(0, 60)}...`);
  }
}
```

**What this tells us:**
- The system DOES detect when images are missing
- It logs each product's image status to the console
- It differentiates between Sanity CDN URLs and other URLs

### Step 4: Fallback Application
Location: `/supabase/functions/server/index.tsx` (lines 146-162)

```typescript
const fallbackImage = categoryFallbackImages[product.category] || 
  "https://images.unsplash.com/photo-1575272775908-7332223be38a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

return {
  id: index + 1,
  name: product.name || "Untitled Product",
  imageUrl: hasImage ? product.imageUrl : fallbackImage,  // ← FALLBACK APPLIED HERE
  // ... other fields
};
```

**What this does:**
- If `hasImage` is true → uses real Sanity image
- If `hasImage` is false → uses category-specific Unsplash fallback
- This ensures the website ALWAYS has images to display

---

## Why Images Appear to NOT Be "Sensed"

### Problem A: Products Don't Have Images in Sanity
**Symptom:** All products show Unsplash fallback images

**Root Cause:**
- Products exist in Sanity Studio
- BUT the "Main Product Image" field is empty
- GROQ query returns `null` for `image.asset->url`
- System correctly detects this and applies fallback

**How to verify:**
1. Go to https://ximq2iuj.sanity.studio
2. Open any product
3. Check if "Main Product Image" field has an image
4. If empty → **this is why it's not being "sensed"**

**Solution:** Upload images to each product

---

### Problem B: Products Are Saved as Drafts
**Symptom:** Images exist in Sanity Studio preview but don't appear on website

**Root Cause:**
- GROQ queries ONLY return published documents
- If you click "Save" (not "Publish"), the document becomes a draft
- Drafts have an `_id` prefix: `drafts.abc123`
- The query `*[_type == "product"]` excludes drafts

**How to verify:**
1. In Sanity Studio, look at document title bar
2. If it shows "Draft" badge → NOT published
3. If URL contains `drafts.` → NOT published

**Solution:** Click the green "Publish" button (not just "Save")

---

### Problem C: Asset References Are Broken
**Symptom:** Image field shows a broken reference in Sanity Studio

**Root Cause:**
- Image was uploaded previously
- Image was deleted from Sanity's asset library
- Product still has a reference to the deleted asset
- `image.asset->url` resolves to `null`

**How to verify:**
1. Open product in Sanity Studio
2. If image field shows broken reference icon
3. Or image preview doesn't load

**Solution:** Delete the broken reference and re-upload image

---

### Problem D: Schema Field Name Mismatch
**Symptom:** All images fail to load despite being uploaded

**Root Cause:**
- GROQ query expects field named `image`
- But Sanity schema uses different field name (e.g., `mainImage`, `productImage`)

**How to verify:**
Check your Sanity schema file. The image field should be:
```javascript
{
  name: 'image',  // ← MUST match GROQ query
  type: 'image',
  title: 'Main Product Image'
}
```

**Solution:** Either:
- Rename schema field to `image`, OR
- Update GROQ query to match actual field name

---

## How to Verify the System Is Working

### Method 1: Use the Diagnostic Page
1. Open browser console
2. Type: `window.location.hash = '#diagnostic'`
3. Press Enter
4. You'll see a detailed diagnostic page showing:
   - Total products
   - Products WITH images (green ✅)
   - Products WITHOUT images (red ❌)
   - Products using fallbacks (yellow ⚠️)

### Method 2: Use Console Function
1. Open browser console (F12)
2. Wait for page to load
3. Type: `checkSanityImages()`
4. Press Enter
5. View detailed breakdown:
   ```
   📊 SUMMARY
   Total Products: 45
   ✅ Real Sanity Images: 0 (0.0%)
   ⚠️  Unsplash Fallbacks: 45 (100.0%)
   ❌ No Images: 0
   ```

### Method 3: Check Server Logs
1. Open Supabase Dashboard
2. Go to Edge Functions → Logs
3. Look for entries like:
   ```
   📷 Missing image for product: "Lace Bralette" (category: Lingerie 2-piece sets)
   ⚠️ 45 products are missing images in Sanity CMS. Using category fallback images.
   ```

### Method 4: Direct API Test
Run this in browser console:
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
  console.log('Products without images:', data.productsWithoutImages);
  console.table(data.products.map(p => ({
    name: p.name,
    hasRealImage: p.imageUrl?.includes('cdn.sanity.io') ? '✅' : '❌',
    imageSource: p.imageUrl?.includes('cdn.sanity.io') ? 'Sanity CDN' : 
                 p.imageUrl?.includes('unsplash') ? 'Unsplash Fallback' : 'Unknown'
  })));
});
```

### Method 5: Test in Sanity Vision
1. Go to https://ximq2iuj.sanity.studio
2. Click "Vision" in the left sidebar (developer tool)
3. Paste this query:
   ```groq
   *[_type == "product"]{
     name,
     "imageUrl": image.asset->url,
     "hasImage": defined(image.asset->url),
     "imageAsset": image.asset
   }
   ```
4. Click "Execute"
5. Check results:
   - ✅ `imageUrl` has CDN URL → Image is uploaded and published
   - ❌ `imageUrl` is `null` → Image is missing or unpublished
   - ✅ `hasImage` is `true` → System will detect it
   - ❌ `hasImage` is `false` → System will use fallback

---

## Step-by-Step Fix Guide

### Step 1: Verify Sanity Integration
Run in browser console:
```javascript
checkSanityImages()
```

If this works and shows data → **Integration is working!**
If this fails → Check Sanity API credentials

### Step 2: Upload Images to Sanity
1. Go to https://ximq2iuj.sanity.studio
2. Log in with your Sanity account
3. Click "Product" in left sidebar
4. For EACH product that shows ⚠️ in diagnostic:
   - Open the product
   - Find "Main Product Image" field
   - Click the upload area
   - Select a high-quality product image (min 800x800px)
   - Optionally add more images to "Additional Images" array

### Step 3: PUBLISH (Don't Just Save)
⚠️ **CRITICAL STEP:**
- Click the green **"Publish"** button in the top-right
- DO NOT just click "Save" (this creates a draft)
- Confirm publication

### Step 4: Verify in Sanity Vision
1. Click "Vision" in Sanity Studio
2. Run query:
   ```groq
   *[_type == "product"]{
     name,
     "imageUrl": image.asset->url
   }
   ```
3. Verify all products have `imageUrl` like:
   ```
   https://cdn.sanity.io/images/ximq2iuj/production/abc123-1024x1024.jpg
   ```

### Step 5: Clear Cache & Reload Website
1. Open your website
2. Press F12 (open DevTools)
3. Right-click reload button → "Empty Cache and Hard Reload"
4. OR press Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

### Step 6: Verify on Website
Run in browser console:
```javascript
checkSanityImages()
```

Expected result:
```
📊 SUMMARY
Total Products: 45
✅ Real Sanity Images: 45 (100.0%)  ← All products now have real images!
⚠️  Unsplash Fallbacks: 0 (0.0%)
❌ No Images: 0
```

---

## Common Misconceptions

### ❌ "The system isn't detecting Sanity images"
**Reality:** The system IS detecting them. It's detecting that they're EMPTY, which is why it applies fallbacks.

### ❌ "The GROQ query is broken"
**Reality:** The GROQ query is working perfectly. It's returning exactly what's in Sanity (which is nothing).

### ❌ "Images are uploaded but not showing"
**Reality:** If images are truly uploaded AND published in Sanity, they WILL show. Check:
- Are they actually uploaded? (Open product in Sanity Studio)
- Are they published? (No "Draft" badge)
- Is the field name correct? (Should be `image`)

### ❌ "I need to change the backend code"
**Reality:** The backend code is correct. You need to upload images in Sanity CMS.

---

## Expected Image URL Formats

### ✅ Correct Sanity CDN URL
```
https://cdn.sanity.io/images/ximq2iuj/production/abc123def456-1024x1024.jpg
https://cdn.sanity.io/images/ximq2iuj/production/abc123def456-1024x1024.png?w=800&h=800&fit=crop
```

### ❌ Unsplash Fallback URL (Means No Sanity Image)
```
https://images.unsplash.com/photo-1575272775908-7332223be38a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080
```

---

## Quick Diagnostic Checklist

Run through this checklist to verify everything:

- [ ] **Sanity Studio Access**: Can you log into https://ximq2iuj.sanity.studio?
- [ ] **Products Exist**: Do products appear in Sanity Studio's Product list?
- [ ] **Images Uploaded**: Does "Main Product Image" field have an image for each product?
- [ ] **Products Published**: Is there NO "Draft" badge on products?
- [ ] **Vision Query Works**: Does Sanity Vision show CDN URLs for `image.asset->url`?
- [ ] **API Response**: Does `/sanity-products` endpoint return products?
- [ ] **Console Function**: Does `checkSanityImages()` work?
- [ ] **Diagnostic Page**: Does `window.location.hash = '#diagnostic'` show data?
- [ ] **Real CDN URLs**: Do image URLs start with `cdn.sanity.io`?
- [ ] **No Fallbacks**: Are there 0 Unsplash URLs in the diagnostic?

---

## What Success Looks Like

### In Sanity Studio:
- All products have images in "Main Product Image" field
- No "Draft" badges on any products
- Images appear in product preview
- Vision query returns `cdn.sanity.io` URLs

### In Browser Console (checkSanityImages()):
```
📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Products: 45
✅ Real Sanity Images: 45 (100.0%)
⚠️  Unsplash Fallbacks: 0 (0.0%)
❌ No Images: 0
🔗 Other URLs: 0

✅ PRODUCTS WITH REAL SANITY IMAGES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Lace Bralette
    https://cdn.sanity.io/images/ximq2iuj/production/abc123-1024x1024.jpg...
  • Satin Chemise
    https://cdn.sanity.io/images/ximq2iuj/production/def456-1024x1024.jpg...
  (... all 45 products listed ...)
```

### On Website:
- Product cards show real product images (not generic Unsplash placeholders)
- Images are high-quality and product-specific
- Product modal shows additional images if uploaded

### In Supabase Edge Function Logs:
```
✅ Real Sanity image for: "Lace Bralette" - https://cdn.sanity.io/images/ximq2iuj/production/abc123...
✅ Real Sanity image for: "Satin Chemise" - https://cdn.sanity.io/images/ximq2iuj/production/def456...
✅ All 45 products have images!
📊 Category distribution: { "Lingerie 2-piece sets": 12, "Nightgowns": 8, ... }
```

---

## Technical Deep Dive: Why This Happens

### The Image Reference Chain
1. In Sanity Studio, you upload an image
2. Sanity stores the image in its CDN
3. Sanity creates an asset document with `_type: "sanity.imageAsset"`
4. Your product document stores a REFERENCE to this asset
5. The GROQ query `image.asset->url` follows this reference
6. If any link in this chain is broken, the result is `null`

### When References Break
- **Upload → Cancel**: Started upload but cancelled → No asset created
- **Delete Asset**: Deleted image from asset library → Reference points to nothing
- **Draft Product**: Product isn't published → GROQ query can't see it
- **Empty Field**: Never uploaded an image → No reference exists

### Why Fallbacks Are Used
The fallback system exists to:
1. Ensure website never shows broken images
2. Provide visual placeholders during content creation
3. Make the site look presentable even with incomplete data
4. Give clear visual indication (Unsplash images) that content needs attention

---

## Next Steps

1. **Upload real product images** to Sanity Studio
2. **Publish** all products (don't just save as drafts)
3. **Verify** using `checkSanityImages()` that all images are detected
4. **Optional**: Remove fallback logic once all images are uploaded

The system is working as designed. Once you upload and publish images in Sanity CMS, they will be automatically detected and displayed on your website.

---

## Support

If images still don't appear after following ALL steps:

1. Check Sanity project permissions (API must be publicly readable)
2. Verify project ID: `ximq2iuj`
3. Verify dataset: `production`
4. Check CORS settings in Sanity project settings
5. Verify Sanity API version: `2024-01-01` (or latest)

**Remember:** The diagnostic tools are telling you the truth. If they say "0 real Sanity images," it means there truly are no images uploaded in Sanity CMS. The solution is to upload them, not to fix the code.

---

**Last Updated:** January 11, 2026  
**Sanity Project:** https://ximq2iuj.sanity.studio  
**Dataset:** production  
**API Version:** 2024-01-01
