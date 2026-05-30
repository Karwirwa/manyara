# Category Routing Fix - MANYARA

## Problem Identified

Your products are loading from Sanity CMS successfully, but clicking on category cards doesn't filter products correctly. This is caused by **category name mismatches** between:

1. **What's stored in Sanity CMS** (e.g., "Bodystocking", "Lingerie 2 Piece Set")
2. **What the backend expects** (e.g., "Bodystockings", "Lingerie 2-piece sets")
3. **What the frontend displays** (various formats)

## Root Cause

The filtering logic does a **strict exact match**:
```javascript
allProducts.filter(product => product.category === activeCategory)
```

If Sanity has "Bodystocking" but you click "Bodystockings", no products will match.

## Solution Implemented

I've created a **category normalization system** that:

1. **Defines canonical category names** - One official name for each category
2. **Maps variations to canonical names** - Handles different spellings/formats
3. **Normalizes on the backend** - All products get consistent category names
4. **Works seamlessly on frontend** - Category clicks and filters work automatically

### Files Modified

1. **`/utils/categoryNormalizer.ts`** - Normalization utility (NEW)
2. **`/supabase/functions/server/index.tsx`** - Backend normalization
3. **`/components/CollectionPage.tsx`** - Imports normalizer
4. **`/components/CategoriesShowcase.tsx`** - Imports normalizer

### Canonical Category Names

These are the official category names that everything maps to:

| Canonical Name | Common Variations |
|----------------|-------------------|
| **Bodyshapers** | Body Shapers, Bodyshaper, Body Shaper |
| **Bodystockings** | Bodystocking, Body Stockings, Body Stocking |
| **Bridal Lingerie** | Bridal, Bridal lingerie |
| **Corsets** | Corset |
| **Leather Lingerie** | Leather lingerie, Leather |
| **Lingerie 2-piece sets** | Lingerie 2 piece sets, Lingerie 2 Piece Set, 2-piece sets, Lingerie Sets |
| **Nightgowns** | Nightgown, Night Gowns, Night Gown |
| **Shapewear** | Shape Wear, Shape wear |
| **Sissy Lingerie** | Sissy lingerie, Sissy |
| **Thongs** | Thong |

## How to Fix Your Sanity Categories

### Option 1: Use the Diagnostic Tool (RECOMMENDED)

1. Open your browser console (F12)
2. Look for the message showing product counts per category
3. You'll see exact category names from Sanity like:
   ```
   "Bodystocking" - 50 products
   "Lingerie 2 Piece Set" - 30 products
   ```
4. In Sanity Studio, bulk-update these to match canonical names

### Option 2: Update Categories in Sanity CMS

1. **Go to Sanity Studio**: https://ximq2iuj.sanity.studio
2. **Navigate to "Categories"** section
3. **Edit each category title** to match the canonical names exactly:
   - ❌ "Bodystocking" → ✅ "Bodystockings"
   - ❌ "Lingerie 2 Piece Set" → ✅ "Lingerie 2-piece sets"
   - ❌ "Sissy" → ✅ "Sissy Lingerie"
4. **Publish changes**
5. **Refresh your website** - categories should now work!

### Option 3: Let the Normalizer Handle It (Current Implementation)

The backend now automatically normalizes category names, so even if your Sanity categories don't match exactly, they'll be converted to canonical names.

**This is already working!** 🎉

## Testing the Fix

### 1. Check Browser Console

After loading the site, you should see:
```
✅ Loaded 450 products from Sanity CMS
```

### 2. Test Category Clicking

1. Click on a category card (e.g., "Bodystockings")
2. Page scrolls to "The Collection" section
3. Filter buttons should highlight the selected category
4. Products from that category should display

### 3. Verify Filtering

- Click "All" - shows all products
- Click "Corsets" - shows only corsets
- Click "Thongs" - shows only thongs
- Search bar should also work correctly

## Common Issues & Solutions

### Issue: "No products in [Category Name]"

**Cause**: Category name in Sanity doesn't match canonical name

**Solution**: 
1. Open browser console
2. Look for the category name format in Sanity
3. Update Sanity category title to match canonical name
4. OR add the variation to `/utils/categoryNormalizer.ts`

### Issue: Categories show different names

**Cause**: Display names vs internal names mismatch

**Solution**: Ensure `CategoriesShowcase` fallback categories match canonical names

### Issue: Clicking category doesn't scroll/filter

**Cause**: JavaScript error or ref not working

**Solution**: 
1. Check browser console for errors
2. Ensure `CollectionPage` is using `forwardRef` correctly
3. Verify `handleCategoryClick` in App.tsx is called

## Advanced: Adding New Categories

To add a new category (e.g., "Babydolls"):

### 1. Add to Canonical Categories

Edit `/utils/categoryNormalizer.ts`:
```typescript
export const CANONICAL_CATEGORIES = {
  // ... existing categories
  BABYDOLLS: "Babydolls"
} as const;
```

### 2. Add Variations

```typescript
const CATEGORY_ALIASES: Record<string, string> = {
  // ... existing aliases
  "Babydolls": CANONICAL_CATEGORIES.BABYDOLLS,
  "Babydoll": CANONICAL_CATEGORIES.BABYDOLLS,
  "Baby Dolls": CANONICAL_CATEGORIES.BABYDOLLS,
};
```

### 3. Add Fallback Image

Edit `/supabase/functions/server/index.tsx`:
```typescript
const categoryFallbackImages: Record<string, string> = {
  // ... existing images
  "Babydolls": "https://images.unsplash.com/photo-[your-image-id]",
};
```

### 4. Add to Categories Showcase

Edit `/components/CategoriesShowcase.tsx`:
```typescript
const getFallbackCategories = () => [
  // ... existing categories
  {
    name: "Babydolls",
    imageUrl: "https://images.unsplash.com/photo-[your-image-id]",
    description: "Flirty babydoll lingerie sets"
  }
];
```

### 5. Create in Sanity

1. Go to Sanity Studio
2. Create new category with exact name: "Babydolls"
3. Assign products to this category

## Verification Checklist

- [ ] All categories in Sanity CMS match canonical names (or are in variation list)
- [ ] Browser console shows successful product load
- [ ] Clicking category cards scrolls to collection section
- [ ] Category filter highlights correct category
- [ ] Products filter correctly when category is selected
- [ ] "All" shows all products
- [ ] Search works within filtered categories
- [ ] No console errors when clicking categories

## Support

If categories still aren't working:

1. **Check browser console** for error messages
2. **Verify Sanity category names** match canonical names
3. **Test with fallback products** by temporarily disabling Sanity
4. **Add console.log** to track category click flow:
   ```javascript
   console.log("Category clicked:", categoryName);
   console.log("Active category:", activeCategory);
   console.log("Filtered products:", filteredProducts.length);
   ```

---

**Status**: ✅ Category normalization implemented
**Next Step**: Verify categories match in Sanity CMS
**Expected Result**: Clicking categories filters products correctly
