# Complete Guide: Why Sanity Images Aren't Loading & How to Fix

## 🔍 The Problem

Your MANYARA website is showing **Unsplash placeholder images** instead of real product images from Sanity CMS.

## ✅ What's Actually Working

1. ✅ Backend successfully connects to Sanity CMS
2. ✅ Products are being fetched from Sanity
3. ✅ Categories are loading correctly
4. ✅ Fallback system is working (prevents broken images)

## ❌ Why Real Images Aren't Showing

The GROQ query in your backend (`/supabase/functions/server/index.tsx`) correctly requests images:

```groq
"imageUrl": image.asset->url
```

**However, this returns `null` or empty string when:**

### Reason 1: Images Not Uploaded (Most Common)
- Products exist in Sanity but have no images attached
- The "Main Product Image" field is empty

### Reason 2: Products Not Published
- Images are uploaded but product is saved as **DRAFT**
- GROQ queries only fetch **PUBLISHED** documents
- You must click "Publish" not just "Save"

### Reason 3: Wrong Schema Field Name
- Schema uses different field name than `image`
- Query looks for `image` but field is called something else

### Reason 4: Broken Asset References
- Images were deleted from Sanity asset library
- References point to non-existent files

## 🛠️ Diagnostic Tools Available

### Tool 1: Browser Console Command
After the site loads, open browser console (F12) and run:
```javascript
checkSanityImages()
```

This will show you:
- ✅ How many products have real Sanity images
- ⚠️ How many are using fallback images
- ❌ Which products are missing images
- 💡 Step-by-step fix instructions

### Tool 2: Backend Logs
When products load, check Supabase Edge Function logs:
- Go to Supabase Dashboard
- Functions → make-server-5cb00c7d → Logs
- Look for:
  ```
  ✅ Real Sanity image for: "Product Name"
  📷 Missing image for product: "Product Name"
  ⚠️ X products are missing images in Sanity CMS
  ```

### Tool 3: Visual Diagnostic Page
Add to your URL: `#diagnostic` and reload
(Note: This requires adding a navigation button)

### Tool 4: Direct API Test
Run in browser console:
```javascript
fetch('https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyNTIxMjYsImV4cCI6MjA1MjgyODEyNn0.hZKGjIUq8TJzcF5yTKjnFb9WMUC2OsJkVTi-kUqLdC0',
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => {
  console.log('Products:', data.products.length);
  console.log('Missing images:', data.productsWithoutImages);
  console.table(data.products.map(p => ({
    name: p.name,
    hasRealImage: p.imageUrl?.includes('cdn.sanity.io') ? '✅' : '❌',
    url: p.imageUrl?.substring(0, 50)
  })));
});
```

## 📝 Step-by-Step Fix

### Step 1: Access Sanity Studio
1. Navigate to: **https://ximq2iuj.sanity.studio**
2. Log in with your Sanity credentials

### Step 2: Check Existing Products
1. Click **"Product"** in the left sidebar
2. You should see your product list
3. Open the first product

### Step 3: Upload Images (For Each Product)
1. Scroll to **"Main Product Image"** field
2. Click the upload area
3. Select a high-quality product photo
4. **CRITICAL**: Click the green **"Publish"** button (NOT "Save as draft")

### Step 4: Verify Images in Sanity
1. In Sanity Studio, click **"Vision"** tool (developer menu)
2. Paste this GROQ query:
```groq
*[_type == "product"] | order(name asc) {
  name,
  "imageUrl": image.asset->url,
  "imageId": image.asset->_id,
  "hasImage": defined(image.asset->url),
  _updatedAt
}
```
3. Click **"Execute"**
4. Check results:
   - ✅ `hasImage: true` + URL starts with `https://cdn.sanity.io/` = **GOOD**
   - ❌ `hasImage: false` or `imageUrl: null` = **NEEDS FIX**

### Step 5: Verify on Website
1. Go back to your MANYARA website
2. Open browser console (F12)
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. Run: `checkSanityImages()`
5. Confirm you see:
   ```
   ✅ Real Sanity Images: XX (increasing number)
   ⚠️ Unsplash Fallbacks: XX (decreasing number)
   ```

## 🎯 What Success Looks Like

### Before Fix
```
Total Products: 23
✅ Real Sanity Images: 0 (0%)
⚠️ Unsplash Fallbacks: 23 (100%)
```

### After Fix
```
Total Products: 23
✅ Real Sanity Images: 23 (100%)
⚠️ Unsplash Fallbacks: 0 (0%)
```

### Image URL Examples

**❌ BAD (Fallback):**
```
https://images.unsplash.com/photo-1646932520067-81bdc09af07a?crop=entropy...
```

**✅ GOOD (Real Sanity):**
```
https://cdn.sanity.io/images/ximq2iuj/production/abc123def456-1200x800.jpg
```

## 🔧 Advanced Troubleshooting

### Issue: Images Show in Sanity but Not on Website

**Check 1: Published vs Draft**
- In Sanity Studio, look for a green "Published" badge
- If you see "Draft" or no badge, click "Publish"

**Check 2: Asset Library**
- Go to Sanity Studio → Assets (in sidebar)
- Verify images appear in the list
- If missing, re-upload them

**Check 3: API Permissions**
- Go to Sanity Dashboard: https://sanity.io/manage
- Select project: `ximq2iuj`
- Settings → API → CORS Origins
- Ensure your domain is allowed (or use `*` for testing)

**Check 4: Cache**
- Clear browser cache completely
- Hard refresh: `Ctrl+Shift+R`
- Try incognito/private window

### Issue: Some Products Work, Others Don't

**Likely Cause:** Partial publishing
- Some products are published, others are drafts
- Solution: In Sanity Studio, go to each product and click "Publish"

### Issue: Images Were Uploaded But Disappeared

**Likely Cause:** Assets were deleted
- Go to Sanity Studio → Assets
- Check if images still exist
- If missing, re-upload them
- Re-publish affected products

## 📊 Understanding the Fallback System

Your site has a **smart fallback system** that prevents broken images:

```
Product has image? 
├─ YES → Is it from Sanity CDN?
│   ├─ YES → ✅ Display real image
│   └─ NO → ⚠️ Display but log warning
└─ NO → Use category-specific Unsplash fallback
```

**Fallback images by category:**
- Bodyshapers → Bodyshaper stock photo
- Corsets → Corset stock photo
- Bridal Lingerie → Bridal lingerie stock photo
- etc.

This ensures your site **never shows broken images**, but you should replace fallbacks with real product photos for best results.

## ✅ Checklist for Going Live

Before launch, ensure:
- [ ] All products have real images uploaded
- [ ] All products are PUBLISHED (not drafts)
- [ ] Run `checkSanityImages()` and confirm 100% real images
- [ ] Verify images load on mobile devices
- [ ] Check image quality (minimum 800x600px recommended)
- [ ] Ensure each product has at least 1 main image
- [ ] Add additional images for different angles (optional)

## 🆘 Still Having Issues?

If images still don't load after following all steps:

1. **Run diagnostics:**
   ```javascript
   checkSanityImages()
   ```

2. **Check Sanity Vision query:**
   - Does it return actual CDN URLs?
   - Are URLs complete and valid?

3. **Verify backend logs:**
   - Supabase Dashboard → Functions → Logs
   - Look for error messages

4. **Test direct Sanity API:**
   ```
   https://ximq2iuj.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=="product"]{name,"imageUrl":image.asset->url}
   ```
   - Should return JSON with image URLs

5. **Contact support:**
   - Sanity support if images don't appear in Vision query
   - Supabase support if backend isn't fetching data

## 📚 Additional Resources

- **Sanity Studio:** https://ximq2iuj.sanity.studio
- **Sanity Dashboard:** https://sanity.io/manage/personal/project/ximq2iuj
- **Sanity Documentation:** https://www.sanity.io/docs/image-type
- **Schema Guide:** See `/sanity-schema-guide.md` in your project

---

**Last Updated:** January 2026  
**Project ID:** ximq2iuj  
**Dataset:** production  
**API Version:** 2024-01-01
