# How to Enable Sanity CMS

Your MANYARA site is currently using **mock product data** as a fallback while your Sanity CMS is being set up.

---

## Current Status

✅ **Mock Data Active** - Site is fully functional with sample products  
⏳ **Sanity Integration Ready** - Just needs to be enabled when your Sanity project is configured

---

## Step 1: Set Up Your Sanity Project

### Option A: Use Existing Project (ximq2iuj)

If you already have access to the Sanity project `ximq2iuj`:

1. Go to https://www.sanity.io/manage
2. Open project `ximq2iuj`
3. Deploy the product and category schemas (see SANITY-SCHEMA-SETUP.md)
4. Add your products in Sanity Studio
5. Publish all products

### Option B: Create New Sanity Project

If you need to create a new Sanity project:

1. **Install Sanity CLI:**
   ```bash
   npm install -g @sanity/cli
   ```

2. **Create new project:**
   ```bash
   sanity init
   ```
   
   Follow the prompts:
   - Project name: `MANYARA Lingerie`
   - Use default dataset: `production`
   - Template: `Clean project`

3. **Copy the Project ID** from the output (e.g., `abc123xyz`)

4. **Update the project ID** in `/utils/sanity/client.ts`:
   ```typescript
   const SANITY_PROJECT_ID = 'your-new-project-id'; // Replace with your ID
   ```

5. **Deploy schemas** (see SANITY-SCHEMA-SETUP.md for schema files)

6. **Start Sanity Studio:**
   ```bash
   cd sanity-studio
   sanity start
   ```

7. **Add products** in the Studio (http://localhost:3333)

---

## Step 2: Enable Sanity Integration

Once your Sanity project has products:

### Update Feature Flag

**File:** `/utils/sanity/productService.ts`

Change line 10 from:
```typescript
const USE_SANITY = false; // Set to true when Sanity is configured
```

To:
```typescript
const USE_SANITY = true; // Sanity is now configured!
```

**File:** `/utils/sanity/categoryService.ts`

Change line 10 from:
```typescript
const USE_SANITY = false; // Set to true when Sanity is configured
```

To:
```typescript
const USE_SANITY = true; // Sanity is now configured!
```

---

## Step 3: Test the Connection

1. **Refresh your website**
2. **Open browser console** (F12)
3. **Look for these messages:**
   ```
   📦 Fetching products from Sanity CMS (ximq2iuj)...
   ✅ Loaded X products from Sanity
   ```

4. **If you see errors:**
   - Check that products are published in Sanity
   - Verify the project ID is correct
   - Ensure the dataset is `production`
   - Check browser console for specific error messages

---

## Step 4: Verify Everything Works

### Checklist:
- [ ] Products load from Sanity (not mock data)
- [ ] Categories populate from Sanity
- [ ] Product images display correctly
- [ ] Product details are accurate
- [ ] Add to cart works
- [ ] Checkout creates orders in Supabase

---

## Troubleshooting

### "Still seeing mock data"
**Solution:**
1. Clear browser cache (Ctrl+Shift+R)
2. Verify `USE_SANITY = true` in both service files
3. Check that Sanity has published products (not drafts)

### "CORS errors"
**Solution:**
1. Go to https://www.sanity.io/manage
2. Open your project → API → CORS Origins
3. Add your website URL (or `*` for all origins during development)

### "Images not loading"
**Solution:**
1. Ensure images are uploaded to Sanity (not external URLs)
2. Check that image assets have proper references
3. Verify CDN URL format in browser console

### "No products found"
**Solution:**
1. Open Sanity Studio
2. Check that products are **Published** (not drafts)
3. Verify products have the required fields:
   - name
   - slug
   - mainImage
   - category
   - price
   - inStock (checked)

---

## Switching Between Mock and Sanity

You can easily switch between mock data and Sanity:

### Use Mock Data:
```typescript
const USE_SANITY = false;
```
- Good for: Development, testing, demos
- Loads: 6 sample products instantly
- No network requests

### Use Sanity:
```typescript
const USE_SANITY = true;
```
- Good for: Production, real products
- Loads: Your actual product catalog
- Real-time updates when you edit in Sanity

---

## Hybrid Approach (Automatic Fallback)

The system is already configured to automatically fall back to mock data if Sanity fails:

```typescript
export async function fetchProducts(): Promise<Product[]> {
  try {
    // Try Sanity first
    const products = await fetchFromSanity(...);
    return products;
  } catch (error) {
    // Fall back to mock data if Sanity fails
    console.log('🔄 Falling back to mock data');
    return getMockProducts();
  }
}
```

This means:
- If Sanity is down → mock data loads
- If Sanity is misconfigured → mock data loads
- Your site always works, even if Sanity has issues

---

## Best Practice Workflow

1. **Development:** Use mock data (`USE_SANITY = false`)
   - Fast loading
   - No API calls
   - Test features quickly

2. **Staging:** Enable Sanity with test products
   - Test real API integration
   - Verify image loading
   - Check performance

3. **Production:** Enable Sanity with full catalog
   - Real products
   - Real-time updates
   - Full e-commerce functionality

---

## Need Help?

### Documentation
- **Schema Setup:** `SANITY-SCHEMA-SETUP.md`
- **Integration Guide:** `SANITY-INTEGRATION-GUIDE.md`
- **Product Reference:** `PRODUCT-DATA-REFERENCE.md`

### Support
- **Email:** rispahkarwirwa@gmail.com
- **Phone:** 0797040512

### Sanity Resources
- **Dashboard:** https://www.sanity.io/manage
- **Documentation:** https://www.sanity.io/docs
- **Community:** https://slack.sanity.io

---

## Summary

**Current Status:**  
🟡 Using mock data (fully functional, ready for Sanity)

**To Enable Sanity:**  
1. Set up Sanity project with products
2. Change `USE_SANITY = true` in service files
3. Test and verify

**Your site works perfectly with mock data right now, and will seamlessly switch to Sanity when you're ready!** 🚀
