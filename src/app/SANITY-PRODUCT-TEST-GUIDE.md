# Sanity Product Data Test Guide

## 🧪 How to Access the Product Test Page

You now have a comprehensive testing interface to verify that all product data (images, sizes, colors, descriptions) is being correctly fetched from Sanity CMS.

### Quick Access Methods

#### Method 1: URL Parameter (Recommended)
Add `?test-products=true` to your URL:
```
http://localhost:3000/?test-products=true
```

#### Method 2: Browser Console
Open your browser's developer console (F12) and paste:
```javascript
window.location.href = '/?test-products=true';
```

#### Method 3: Direct Navigation
Create a button or link somewhere in your app:
```tsx
<button onClick={() => window.location.href = '/?test-products=true'}>
  Test Sanity Products
</button>
```

## 📊 What the Test Page Shows

### Overall Statistics Dashboard
Six stat cards showing:
- **Main Images**: How many products have main images
- **Gallery Images**: How many products have additional images  
- **Colors**: How many products have color options defined
- **Sizes**: How many products have size options defined
- **Short Desc**: How many products have short descriptions
- **Long Desc**: How many products have long descriptions

### Product Cards Grid
Each product displays:
- Product image (or placeholder if missing)
- Product name and price
- Badge showing number of additional images
- ✅/❌ indicators for each data type:
  - Main Image
  - Gallery Images
  - Colors
  - Sizes
  - Short Description
  - Long Description

### Product Detail View
Click any product card to see:
- **All Images**: Main image + additional images with full URLs
- **Colors**: All available color options
- **Sizes**: All available size options
- **Descriptions**: Both short and long descriptions
- **Raw Data**: Complete JSON object for debugging

## 🔍 What Data Is Being Tested

The test queries Sanity CMS for these fields:

```groq
*[_type == "product"] {
  _id,
  name,
  "mainImage": mainImage.asset->url,
  "additionalImages": additionalImages[].asset->url,
  "category": category->{title, slug},
  price,
  colors,
  sizes,
  shortDescription,
  longDescription,
  inStock,
  featured
}
```

## ✅ Success Indicators

**Green Checkmarks (✅)** mean:
- Main Image: Product has a valid image URL
- Gallery: Product has 1+ additional images
- Colors: Product has defined colors (not just "Standard")
- Sizes: Product has defined sizes (not just "One Size")
- Short Desc: Product has text in shortDescription field
- Long Desc: Product has text in longDescription field

**Red X's (❌)** mean:
- The field is empty, undefined, or contains default placeholder values

## 🐛 Troubleshooting

### No Products Showing
1. Check that you have products in Sanity Studio (project: ximq2iuj)
2. Make sure products are published (not drafts)
3. Check browser console for error messages
4. Verify CORS settings in Sanity

### Images Not Loading
1. Check that images are uploaded in Sanity Studio
2. Verify the image URLs in the detail view
3. Look for CORS errors in browser console
4. Ensure images are in the mainImage or additionalImages fields

### Missing Colors/Sizes
1. In Sanity Studio, edit the product
2. Add items to the "colors" array field
3. Add items to the "sizes" array field
4. Publish the product

### Missing Descriptions
1. In Sanity Studio, edit the product
2. Fill in the "shortDescription" field
3. Fill in the "longDescription" field
4. Publish the product

## 📝 Console Logging

The test page logs detailed information to the browser console:
- 📦 Product fetch start
- 📊 Raw Sanity response with count
- 🔍 Individual product normalization details
- ✅ Success messages with counts
- ❌ Error messages with stack traces

Check your console (F12) for detailed debugging information.

## 🎯 Next Steps After Testing

Once you verify data is loading correctly:

1. **If Everything Works**: Your Sanity integration is perfect! 
2. **If Images Missing**: Check Sanity Studio uploads and field names
3. **If Colors/Sizes Missing**: Add them in Sanity Studio product editor
4. **If Descriptions Missing**: Fill them in Sanity Studio
5. **If Products Missing**: Create and publish products in Sanity Studio

## 🔗 Related Tools

- **Flow Diagram**: `?flow-diagram=true` - Architecture visualization
- **Edge Function Test**: `?test-edge=true` - Backend testing
- **Admin Panel**: Click Admin in navigation
- **Sanity Studio**: https://ximq2iuj.sanity.studio/

## 📱 Access URLs

| Tool | URL Parameter |
|------|--------------|
| Product Test | `?test-products=true` |
| Flow Diagram | `?flow-diagram=true` |
| Edge Function Test | `?test-edge=true` |
| Home Page | `/` (no parameter) |

---

**Project**: MANYARA Luxury Lingerie  
**Sanity Project ID**: ximq2iuj  
**Dataset**: production  
**API Version**: 2023-05-03
