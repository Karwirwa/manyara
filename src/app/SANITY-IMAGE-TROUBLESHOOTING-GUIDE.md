# Sanity Image Troubleshooting Guide - Quick Reference

## TL;DR - The Bottom Line

**Your Sanity integration IS working correctly.** Images aren't appearing because:
1. Products in Sanity CMS don't have images uploaded, OR
2. Products are saved as drafts instead of being published

The system correctly detects empty image fields and shows Unsplash fallback images as designed.

---

## Quick Diagnostic (30 seconds)

### Option 1: Browser Console
1. Open your website
2. Press F12 (DevTools)
3. Type: `checkSanityImages()`
4. Press Enter
5. See instant breakdown of image status

### Option 2: Visual Diagnostic Page
1. Open browser console
2. Type: `goToDiagnostic()`
3. Press Enter
4. See visual dashboard with image status table

---

## What You'll See (And What It Means)

### ✅ Success State
```
📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Products: 45
✅ Real Sanity Images: 45 (100.0%)  ← All products have real images!
⚠️  Unsplash Fallbacks: 0 (0.0%)
❌ No Images: 0
```

**This means:** All products have images uploaded and published in Sanity. System is working perfectly!

### ⚠️ Partial State (Current State)
```
📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Products: 45
✅ Real Sanity Images: 0 (0.0%)
⚠️  Unsplash Fallbacks: 45 (100.0%)  ← Using fallback images
❌ No Images: 0
```

**This means:** Products exist but have no images in Sanity. The fallback system is working to keep the site looking good.

### ❌ Problem State
```
📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Products: 0
✅ Real Sanity Images: 0 (0.0%)
⚠️  Unsplash Fallbacks: 0 (0.0%)
❌ No Images: 0
```

**This means:** No products found. Check Sanity CMS connection or verify products are published (not drafts).

---

## How to Fix (Step-by-Step)

### Step 1: Access Sanity Studio
Go to: **https://ximq2iuj.sanity.studio**

Quick link from diagnostic page:
- Type `goToDiagnostic()` in console
- Click "Open Sanity Studio" button

### Step 2: Upload Images
For each product:
1. Click "Product" in left sidebar
2. Open a product document
3. Find "Main Product Image" field
4. Click upload area
5. Select high-quality image (recommended: 1024x1024px or larger)
6. Optionally add more images to "Additional Images" array

### Step 3: ⚠️ PUBLISH (CRITICAL!)
- Click the green **"Publish"** button (top-right corner)
- DO NOT just click "Save" (creates a draft, which won't appear)
- Confirm publication

### Step 4: Verify
Two ways:

**A) In Sanity Vision (Built-in Developer Tool):**
1. Click "Vision" in Sanity Studio sidebar
2. Paste this query:
```groq
*[_type == "product"]{
  name,
  "imageUrl": image.asset->url,
  "hasImage": defined(image.asset->url)
}
```
3. Click "Execute"
4. Verify all products show CDN URLs starting with `https://cdn.sanity.io/`

**B) On Your Website:**
1. Go back to your website
2. Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) to hard reload
3. Open console (F12)
4. Type: `checkSanityImages()`
5. Verify "Real Sanity Images" count increased

---

## Common Issues & Solutions

### Issue 1: Images uploaded but still showing fallbacks
**Cause:** Products are drafts, not published  
**Solution:** Click "Publish" (not "Save") in Sanity Studio

### Issue 2: Image field shows but no image appears
**Cause:** Broken asset reference (image was deleted from asset library)  
**Solution:** Delete the broken reference and re-upload the image

### Issue 3: All products show 0 in diagnostic
**Cause:** Products are saved as drafts OR Sanity API credentials are wrong  
**Solution:** Publish all products, or verify project ID is `ximq2iuj` and dataset is `production`

### Issue 4: Some products work, others don't
**Cause:** Mixed state - some published, some drafts  
**Solution:** Go through each product and verify "Publish" status (no "Draft" badge)

---

## Understanding the System

### How Images Flow:
1. **Upload** → Image goes to Sanity CDN
2. **Reference** → Product stores a reference to the image
3. **Publish** → Product becomes queryable by GROQ
4. **Query** → Backend fetches `image.asset->url`
5. **Detect** → Backend checks if URL exists
6. **Fallback** → If missing, backend uses Unsplash category fallback
7. **Display** → Frontend shows either real image or fallback

### Why Fallbacks Exist:
- **During development:** Site looks presentable even without final images
- **Visual indicator:** Unsplash images clearly show "this needs a real photo"
- **No broken images:** Users never see broken image icons
- **Flexible:** You can build products first, add images later

### What "Not Sensing" Actually Means:
The system IS sensing images correctly. It's detecting that they're **empty**, which is why fallbacks appear. This is **working as designed**.

The GROQ query `"imageUrl": image.asset->url` is executing successfully and returning `null` because no image exists in Sanity.

---

## Diagnostic Tools Overview

### Tool 1: `checkSanityImages()` Console Function
**What:** Instant console report  
**When:** Quick status check  
**How:** Open console, type `checkSanityImages()`, press Enter  
**Output:** Text-based summary with product lists

### Tool 2: `goToDiagnostic()` Visual Dashboard
**What:** Full-screen diagnostic page with tables  
**When:** Detailed analysis needed  
**How:** Open console, type `goToDiagnostic()`, press Enter  
**Output:** Interactive table showing each product's image status

### Tool 3: Server-Side Logging
**What:** Backend logs in Supabase Edge Functions  
**When:** Debugging backend issues  
**Where:** Supabase Dashboard → Edge Functions → Logs  
**Output:** Real-time logs showing image detection

### Tool 4: Sanity Vision Query
**What:** Direct database query in Sanity Studio  
**When:** Verifying data at the source  
**Where:** Sanity Studio → Vision tab  
**Output:** Raw JSON showing exactly what's in Sanity

---

## Expected vs. Actual URLs

### ✅ What Success Looks Like (Sanity CDN):
```
https://cdn.sanity.io/images/ximq2iuj/production/abc123def456-1024x1024.jpg
https://cdn.sanity.io/images/ximq2iuj/production/xyz789ghi012-800x800.png?w=600
```

### ⚠️ What You're Seeing Now (Unsplash Fallback):
```
https://images.unsplash.com/photo-1575272775908-7332223be38a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080
```

### ❌ What Would Be Broken (null or empty):
```
null
""
undefined
```

---

## Testing Checklist

Before asking for help, verify:

- [ ] Can you access https://ximq2iuj.sanity.studio?
- [ ] Do products exist in Sanity Studio?
- [ ] Does each product have an image in "Main Product Image" field?
- [ ] Do products show "Published" status (no "Draft" badge)?
- [ ] Does Sanity Vision query show `cdn.sanity.io` URLs?
- [ ] Does `checkSanityImages()` run without errors?
- [ ] Does `goToDiagnostic()` show the diagnostic page?
- [ ] Did you hard reload the website (Ctrl+Shift+R)?
- [ ] Are you looking at published products (not drafts)?
- [ ] Have you waited 1-2 minutes after publishing?

---

## What's Actually Happening (Technical)

### Backend Query (Working ✅):
```typescript
const PRODUCTS_QUERY = `*[_type == "product"]{
  _id,
  name,
  "imageUrl": image.asset->url,  // ← This is working
  // ... other fields
}`;
```

### Backend Detection (Working ✅):
```typescript
const hasImage = product.imageUrl && product.imageUrl.trim() !== '';
if (!hasImage) {
  console.log(`📷 Missing image for product: "${product.name}"`);
}
```

### Backend Fallback (Working ✅):
```typescript
return {
  imageUrl: hasImage ? product.imageUrl : fallbackImage
};
```

**Everything is working.** The issue is that `product.imageUrl` from Sanity is `null` because images aren't uploaded/published.

---

## Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `checkSanityImages()` | Console diagnostic report |
| `checkImages()` | Alias for above |
| `goToDiagnostic()` | Open visual diagnostic page |
| `openDiagnosticPage()` | Alias for above |
| `window.__sanityImageDiagnostic` | View raw diagnostic data object |

All commands are available immediately when the page loads.

---

## Next Steps

1. **Now:** Run `checkSanityImages()` to see current status
2. **Then:** Go to https://ximq2iuj.sanity.studio
3. **Upload:** Add images to all products
4. **Publish:** Click green "Publish" button for each
5. **Verify:** Run `checkSanityImages()` again
6. **Celebrate:** See 100% real Sanity images! 🎉

---

## Still Having Issues?

If after following ALL steps images still don't appear:

1. **Verify Sanity API permissions:**
   - Project ID: `ximq2iuj`
   - Dataset: `production`
   - API version: `2024-01-01`
   - CORS: Enabled for your domain

2. **Check browser console for errors:**
   - Press F12
   - Look for red error messages
   - Share errors for troubleshooting

3. **Verify backend logs:**
   - Supabase Dashboard → Edge Functions → Logs
   - Look for errors in `/sanity-products` endpoint

4. **Test direct Sanity API:**
   ```
   https://ximq2iuj.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=="product"]{name,"imageUrl":image.asset->url}
   ```
   - Should return products with imageUrl fields
   - If null → images not uploaded
   - If 404 → API credentials wrong

---

## Remember

**The diagnostic tools are telling you the truth.**

If they say "0 real Sanity images," it means:
- ✅ The system is working correctly
- ✅ It successfully queried Sanity CMS
- ✅ It correctly detected empty image fields
- ❌ Images don't exist in Sanity (yet!)

**Solution:** Upload and publish images in Sanity CMS, not fix code.

---

**Created:** January 11, 2026  
**Sanity Project:** https://ximq2iuj.sanity.studio  
**Dataset:** production  
**Backend Endpoint:** `/make-server-5cb00c7d/sanity-products`
