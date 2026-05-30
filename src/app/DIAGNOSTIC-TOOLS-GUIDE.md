# 🔧 MANYARA Diagnostic Tools Guide

## Quick Access to All Diagnostic Tools

Your MANYARA e-commerce site now has **three powerful diagnostic tools** to help you troubleshoot and verify your Sanity CMS integration.

---

## 🧪 1. Sanity Diagnostic Tool (RECOMMENDED START HERE)

**Access**: `?diagnostic=true`

**What it does**: Deep inspection of your Sanity data structure

### Tests Performed:
✅ Sanity client connection  
✅ Product count verification  
✅ Main image field structure  
✅ Additional images array  
✅ Colors array validation  
✅ Sizes array validation  
✅ Category reference dereferencing  
✅ Short description check  
✅ Long description check  
✅ GROQ query validation  
✅ CDN URL format verification  

### How to Use:
```
http://localhost:3000/?diagnostic=true
```

Or in browser console:
```javascript
window.location.href = '/?diagnostic=true';
```

### What to Look For:
- **Green ✓**: Everything working perfectly
- **Yellow ⚠**: Data exists but may need improvement
- **Red ✗**: Critical issue that needs fixing

### Quick Fixes:
Each failed test shows:
- Exact issue detected
- Where to fix it (Sanity Studio)
- What field needs attention
- Expected data format

---

## 📊 2. Product Data Test

**Access**: `?test-products=true`

**What it does**: Visual overview of all products with data completeness

### Features:
- **Dashboard**: Statistics on images, colors, sizes, descriptions
- **Product Grid**: Visual cards with ✓/✗ indicators
- **Detail View**: Click any product to see full data
- **Image Testing**: Verifies actual image loading

### How to Use:
```
http://localhost:3000/?test-products=true
```

### Best For:
- Quick visual check of all products
- Seeing which products need more data
- Verifying image URLs are working
- Testing actual product display

---

## 🌊 3. Sanity Flow Diagram

**Access**: `?flow-diagram=true`

**What it does**: Interactive architecture documentation

### Sections:
1. **Schema Structure**: Sanity document types
2. **Content Verification**: How to check data in Sanity Studio
3. **Data Flow**: Query → Transform → Display
4. **Frontend Components**: Where data is used
5. **Troubleshooting**: Common issues and solutions

### How to Use:
```
http://localhost:3000/?flow-diagram=true
```

### Best For:
- Understanding the overall architecture
- Learning how data flows
- Finding troubleshooting guides
- Onboarding new team members

---

## 🎯 Recommended Workflow

### Step 1: Run Diagnostic First
```
?diagnostic=true
```
This will tell you **exactly** what's wrong with your Sanity data.

### Step 2: Fix Issues in Sanity Studio
Based on diagnostic results, go to Sanity Studio and:
- Upload missing images
- Add colors/sizes arrays
- Fill in descriptions
- Assign categories

### Step 3: Verify with Product Test
```
?test-products=true
```
See all products visually and confirm data is displaying correctly.

### Step 4: Reference Flow Diagram
```
?flow-diagram=true
```
If you need to understand how something works or troubleshoot deeper issues.

---

## 🚨 Common Issues & Quick Fixes

### Issue: "No products found"
**Fix**: Create products in Sanity Studio (https://ximq2iuj.sanity.studio/)

### Issue: "mainImage not dereferenced"
**Fix**: Your GROQ query needs `"mainImage": mainImage.asset->url`  
**Location**: `/utils/sanity/productService.ts`

### Issue: "Colors showing as ['Standard']"
**Fix**: In Sanity Studio, edit product → colors field → add items like "Black", "Red"

### Issue: "Sizes showing as ['One Size']"
**Fix**: In Sanity Studio, edit product → sizes field → add items like "S", "M", "L"

### Issue: "Category is uncategorized"
**Fix**: In Sanity Studio, edit product → category field → select a category

### Issue: "Images not loading (404)"
**Fix**: 
1. Check image is uploaded in Sanity Studio
2. Verify GROQ query uses `mainImage.asset->url`
3. Check browser console for actual URL
4. Test URL directly in browser

---

## 📱 All Access URLs

| Tool | URL Parameter | Purpose |
|------|--------------|---------|
| **Diagnostic** | `?diagnostic=true` | Deep data inspection |
| **Product Test** | `?test-products=true` | Visual product overview |
| **Flow Diagram** | `?flow-diagram=true` | Architecture docs |
| Edge Function Test | `?test-edge=true` | Backend testing |
| Home Page | `/` | Main site |

---

## 🔍 Browser Console Commands

### Quick Navigation
```javascript
// Go to diagnostic
window.location.href = '/?diagnostic=true';

// Go to product test
window.location.href = '/?test-products=true';

// Go to flow diagram
window.location.href = '/?flow-diagram=true';

// Return to home
window.location.href = '/';
```

### Check Sanity Connection
```javascript
// Open diagnostic tool and check console output
// You'll see detailed logs about each test
```

---

## 📚 Additional Resources

### Sanity Studio
- **URL**: https://ximq2iuj.sanity.studio/
- **Project ID**: ximq2iuj
- **Dataset**: production

### API Details
- **Client**: `@sanity/client`
- **API Version**: 2023-05-03 (stable)
- **CDN**: Enabled
- **Perspective**: Published documents only

### GROQ Query Reference
```groq
*[_type == "product"] {
  _id,
  name,
  "mainImage": mainImage.asset->url,
  "additionalImages": additionalImages[].asset->url,
  "category": category->{_id, title, slug},
  colors,
  sizes,
  shortDescription,
  longDescription,
  price,
  inStock,
  featured
}
```

---

## 💡 Pro Tips

1. **Always start with diagnostic** - It will save you time
2. **Check browser console** - Lots of helpful logs
3. **Use detail views** - Click items to see raw JSON
4. **Test one product first** - Get it perfect, then replicate
5. **Keep Sanity Studio open** - Make changes and refresh to test

---

## ✅ Success Checklist

Before going live, verify:

- [ ] Diagnostic shows all green checks
- [ ] All products have main images
- [ ] Products have 2-3 additional images each
- [ ] All products have colors defined
- [ ] All products have sizes defined
- [ ] All products have short descriptions
- [ ] All products have long descriptions
- [ ] All products assigned to categories
- [ ] Image URLs load correctly (no 404s)
- [ ] Product test shows 100% completion

---

**Remember**: These tools are designed to help you quickly identify and fix issues. Start with the diagnostic, fix what it tells you, then verify with the product test!
