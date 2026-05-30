# 🔍 Analysis: Why Categories Are NOT Being Detected from Sanity

## 📋 The Problem

Your MANYARA website is not detecting the 10 product categories from Sanity CMS:
1. Bodyshapers
2. Bodystocking
3. Bridal Lingerie
4. Corsets
5. Leather Lingerie
6. Lingerie 2 Piece Set
7. Nightgowns
8. Shapewear
9. Sissy Lingerie
10. Thongs

---

## 🎯 Root Cause Analysis

### ❌ PRIMARY CAUSE: Edge Function Not Deployed (403 Error)

**The main issue is**: Your Supabase Edge Function has a **403 deployment error**, which means:

```
Sanity CMS ❌ --> Edge Function (NOT DEPLOYED) ❌ --> Website ❌
```

Since the edge function isn't deployed, the website **cannot connect to Sanity at all**, so it:
1. ✅ Tries to fetch from Sanity → **FAILS** (edge function not deployed)
2. ✅ Falls back to 30 local products → **SUCCEEDS** (shows fallback categories)
3. ❌ Never actually loads real Sanity products or categories

**Result**: The website shows **fallback categories** (all 10 exist in local data), but your **real Sanity categories** are never loaded.

---

## 🔍 Secondary Issues (IF Edge Function Were Deployed)

Even after deploying the edge function, categories might not appear if:

### Issue #1: Categories Not Published in Sanity ⚠️

**Problem**: Categories might exist as **drafts** but not **published** in Sanity.

**How GROQ Queries Work**:
- By default, GROQ queries fetch **ONLY published documents**
- If your categories are drafts (they have `drafts.` prefix in Sanity), they won't be returned

**Solution**:
1. Log into Sanity Studio: https://manyara.sanity.studio (or your studio URL)
2. Go to **"Category"** documents
3. For EACH of the 10 categories:
   - Open the category
   - Check if it shows **"DRAFT"** badge
   - If yes, click **"Publish"** button
   - Verify it shows **"Published"** status

---

### Issue #2: Products Not Linked to Categories 🔗

**Problem**: Products might exist but the `category` field might not be properly linked to a category document.

**In Sanity**, the product schema has:
```typescript
{
  name: 'category',
  title: 'Category',
  type: 'reference',
  to: [{ type: 'category' }],
}
```

**This means**: Each product must have a **reference** to a category document, not just a text string.

**Solution**:
1. Open any product in Sanity Studio
2. Check the **"Category"** field
3. It should show a **dropdown** with category options
4. If it's empty or says "No options", then:
   - Your categories aren't published (see Issue #1)
   - Or the reference is broken

**Fix**:
1. Publish all 10 categories first
2. Then edit each product
3. Select the correct category from the dropdown
4. Click **"Publish"** on the product

---

### Issue #3: GROQ Query Syntax Error 📝

**Current Query** (in `/supabase/functions/server/index.tsx`):
```groq
*[_type == "product"]{
  _id,
  name,
  price,
  sizes,
  color,
  "category": category->title,
  "imageUrl": image.asset->url,
  shortDescription,
  longDescription,
  "additionalImages": additionalImages[].asset->url
}
```

**This query is CORRECT** ✅

**What it does**:
- Fetches all documents where `_type == "product"`
- Uses `category->title` to follow the reference and get the category's title
- This is the proper syntax for GROQ references

**However**, this query **only fetches published products**. If you want to also fetch drafts (during development):

```groq
*[_type == "product" && !(_id in path("drafts.**"))]{
  _id,
  name,
  price,
  sizes,
  color,
  "category": category->title,
  "imageUrl": image.asset->url,
  shortDescription,
  longDescription,
  "additionalImages": additionalImages[].asset->url
}
```

Or to fetch ONLY published:
```groq
*[_type == "product" && !(_id in path("drafts.**")) && defined(category)]{
  ...
}
```

---

### Issue #4: Sanity API Token Permissions 🔐

**Problem**: The API might not have read permissions.

**Check**:
1. Go to Sanity dashboard: https://sanity.io/manage
2. Navigate to your project: **ximq2iuj**
3. Click **"API"** → **"Tokens"**
4. Verify you have a token with **"Viewer"** or **"Editor"** permissions
5. Check if CORS origins are configured:
   - Add `https://trtqbruuzdvlmzrzwrot.supabase.co` (your Supabase URL)
   - Add `http://localhost:3000` (for local testing)

**Note**: For **public reads**, Sanity allows unauthenticated requests by default, but you may need to enable this:
- Go to **API** → **Settings**
- Enable **"Allow anonymous access for read operations"**

---

### Issue #5: Category Field Name Mismatch 🔤

**In Sanity Schema**, the category document has:
```typescript
{
  name: 'title',
  title: 'Category Name',
  type: 'string',
}
```

**In GROQ Query**, we fetch:
```groq
"category": category->title
```

**This is correct** ✅ - We're following the `category` reference and getting its `title` field.

**Frontend expects** (in CollectionPage.tsx):
```typescript
category: string
```

**Transformation in backend**:
```typescript
category: product.category || "Uncategorized"
```

**This matches perfectly** ✅

---

## 🛠️ Complete Fix Checklist

### Step 1: Deploy the Edge Function First! ⚡
**Without this, NOTHING will work**

```bash
# Use Supabase CLI
supabase login
supabase link --project-ref trtqbruuzdvlmzrzwrot
supabase functions deploy make-server

# Test it
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
```

See `/ERROR-403-QUICK-FIX.md` for detailed instructions.

---

### Step 2: Verify Sanity Setup 🏗️

#### 2A. Check Sanity Schemas Are Deployed
```bash
cd your-sanity-project
sanity deploy
```

#### 2B. Create and Publish All 10 Categories

In Sanity Studio:

1. **Create Category Documents**:
   - Click **"+ Create"** → **"Category"**
   - Create each of these:

| Title | Slug | Description |
|-------|------|-------------|
| Bodyshapers | bodyshapers | Smooth silhouette enhancing bodyshapers |
| Bodystocking | bodystocking | Delicate lace and mesh bodystockings |
| Bridal Lingerie | bridal-lingerie | Elegant lace lingerie sets |
| Corsets | corsets | Premium quality corsets with steel boning |
| Leather Lingerie | leather-lingerie | Edgy vegan leather lingerie |
| Lingerie 2 Piece Set | lingerie-2-piece-set | Classic lace lingerie sets |
| Nightgowns | nightgowns | Elegant silk and lace nightgowns |
| Shapewear | shapewear | Comfortable tummy control shapewear |
| Sissy Lingerie | sissy-lingerie | Silky satin and lace pieces |
| Thongs | thongs | Essential lace and satin thongs |

2. **IMPORTANT**: Click **"Publish"** on EACH category! 🟢
   - Not just "Save draft"
   - Look for the green **"Published"** indicator

---

#### 2C. Create Products and Link Categories

For each product:
1. Fill in all required fields (name, price, sizes, color, etc.)
2. **Category field**: Select from dropdown (categories must be published first!)
3. Upload main image
4. Add additional images (optional)
5. Write descriptions
6. Check **"In Stock"** ✅
7. Click **"Publish"** 🟢

---

### Step 3: Test Sanity API Directly 🧪

Test the Sanity API to verify data is there:

```bash
# Fetch categories directly
curl "https://ximq2iuj.api.sanity.io/v2024-01-01/data/query/production?query=*%5B_type%20%3D%3D%20%22category%22%5D%7Btitle%2Cslug%7D"

# Fetch products with categories
curl "https://ximq2iuj.api.sanity.io/v2024-01-01/data/query/production?query=*%5B_type%20%3D%3D%20%22product%22%5D%7Bname%2C%20%22category%22%3A%20category-%3Etitle%7D"
```

**Expected response**:
```json
{
  "result": [
    {
      "name": "Seamless Body Shaper",
      "category": "Bodyshapers"
    },
    ...
  ]
}
```

If you get empty results, categories/products aren't published.

---

### Step 4: Verify Website Detection 🌐

Once edge function is deployed and Sanity has published data:

1. Open your MANYARA website
2. Open **Browser Console** (F12 → Console tab)
3. Look for these messages:

**SUCCESS** ✅:
```
🔍 Fetching products from Sanity CMS...
✅ Loaded 30 products from Sanity CMS
```

**FAILURE** ❌:
```
❌ Sanity CMS fetch failed: ...
⚠️ Backend unavailable - using fallback products
```

4. Check if categories appear in the filter bar
5. Click each category - products should filter correctly

---

## 🧪 Debug: Check What's Actually Loading

Add this to your browser console to see current state:

```javascript
// Check if using fallback products
console.log('Using fallback?', window.location.href);

// Check loaded categories
const categoryButtons = document.querySelectorAll('[role="button"]');
const categories = Array.from(categoryButtons).map(btn => btn.textContent);
console.log('Detected categories:', categories);

// Check if Sanity is reachable
fetch('https://ximq2iuj.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=="category"]{title}')
  .then(r => r.json())
  .then(d => console.log('Sanity categories:', d.result))
  .catch(e => console.error('Sanity error:', e));
```

---

## 📊 Expected Flow (When Everything Works)

```
1. User opens website
   ↓
2. CollectionPage.tsx runs useEffect
   ↓
3. Fetch: /make-server-5cb00c7d/sanity-products
   ↓
4. Edge Function queries Sanity CMS
   ↓
5. Sanity returns products with category->title
   ↓
6. Edge Function transforms data
   ↓
7. Frontend receives products array
   ↓
8. Extract unique categories from products
   ↓
9. Display category filter buttons
   ↓
10. User clicks category → products filter
```

---

## 🎯 Most Likely Issues (In Order)

1. **🔴 Edge Function Not Deployed** (PRIMARY - FIX THIS FIRST!)
   - See `/ERROR-403-QUICK-FIX.md`

2. **🟡 Categories Not Published in Sanity**
   - Check all 10 categories are published, not drafts

3. **🟡 Products Not Linked to Categories**
   - Each product must reference a category document

4. **🟡 No Products in Sanity**
   - Need at least 1 published product per category

5. **🟢 CORS or API Permissions**
   - Less likely, Sanity allows public reads by default

---

## ✅ Quick Test Plan

### Test 1: Is Sanity Working?
```bash
curl "https://ximq2iuj.api.sanity.io/v2024-01-01/data/query/production?query=*[_type==%22category%22]"
```
**Expected**: Returns 10 categories  
**If empty**: Categories aren't published

### Test 2: Is Edge Function Deployed?
```bash
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
```
**Expected**: `{"status":"ok"}`  
**If 404**: Edge function not deployed

### Test 3: Can Edge Function Fetch from Sanity?
```bash
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products
```
**Expected**: Returns products with categories  
**If error**: Check Sanity has published products

### Test 4: Does Website Show Categories?
1. Open website
2. Check Collection page
3. Look for category filter buttons
4. **Should see**: All, Bodyshapers, Bodystocking, etc.

---

## 🚀 Summary

**The categories ARE in your code** - both in:
- ✅ Sanity schema guide (correct)
- ✅ Backend GROQ query (correct)
- ✅ Frontend category extraction (correct)
- ✅ Fallback products (all 10 categories included)

**The reason they're not being detected from Sanity**:
1. **Edge function isn't deployed** (403 error) ← FIX THIS FIRST
2. **Categories might not be published** in Sanity
3. **Products might not be linked** to categories

**Once you fix the 403 error and deploy the edge function**, the categories will work automatically! 🎉

---

## 📞 Need Help?

If categories still don't appear after:
- ✅ Deploying edge function successfully
- ✅ Publishing all 10 categories in Sanity
- ✅ Creating and publishing products
- ✅ Linking products to categories

Then share:
1. Browser console logs
2. Result of Test 1, 2, and 3 above
3. Screenshot of Sanity Studio showing published categories

**Contact**: rispahkarwirwa@gmail.com | +254 797 040 512
