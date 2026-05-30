# 🎯 Sanity Flow Diagram - Complete Architecture Reference

## 📍 How to Access

### Option 1: URL Parameter (Easiest)
Add `?flow-diagram=true` to your URL:
```
https://your-site.com/?flow-diagram=true
```

### Option 2: From Browser Console
```javascript
// Open browser console (F12) and run:
window.location.href = '/?flow-diagram=true';
```

### Option 3: Direct Component Access
The flow diagram is available at: `/components/SanityFlowDiagram.tsx`

---

## 🗺️ What's in the Diagram

The interactive flow diagram provides a **complete visual map** of your entire data architecture:

### **Section 1: Sanity CMS Schema Structure**
- **Category Schema**: All fields, types, and requirements
- **Product Schema**: Complete product structure with all properties
- **Image Storage Structure**: How images are stored and referenced in Sanity

### **Section 2: Actual Content in Sanity CMS**
- **Verification Checklist**: Step-by-step guide to check your Sanity Studio content
- **Example Product Data**: Real JSON structure of what should be in Sanity
- **Field Validation**: What to verify for each product field

### **Section 3: Data Flow & Transformation**
- **Step 1: Sanity Client Connection** (`/utils/sanity/client.ts`)
  - How the connection is established
  - API configuration (Project ID, API version, CDN usage)
  - `fetchFromSanity()` function details

- **Step 2: Product Service & GROQ Queries** (`/utils/sanity/productService.ts`)
  - Complete GROQ queries with annotations
  - Critical operators: `->` (dereference) and `[]` (array mapping)
  - Normalization function explained
  - Image URL optimization

- **Step 3: TypeScript Type System** (`/utils/sanity/types.ts`)
  - Before/After type transformations
  - Raw Sanity types vs. Dereferenced types vs. App types
  - Type safety throughout the pipeline

### **Section 4: Frontend Components (Data Consumers)**
- **Component Cards** for each major component:
  - `App.tsx` - Router & State Manager
  - `CollectionPage.tsx` - Product Listing
  - `ProductCard.tsx` - Product Display
  - `ProductModal.tsx` - Product Details
  - `AdminPage.tsx` - Product Management
  - `CategoriesShowcase.tsx` - Category Navigation

- **Data Access Pattern**: Code example showing typical component data flow

### **Section 5: Common Issues & Diagnostic Checklist**

#### 🖼️ Images Not Displaying
- **Issue**: Images show placeholder or 404
- **Causes**: 
  - mainImage field is empty in Sanity
  - GROQ query missing `mainImage.asset->url`
  - Image reference is broken
  - CDN URL is malformed
- **Solutions**: Complete step-by-step troubleshooting

#### 🎨 Colors & Sizes Issues
- **Issue**: Colors showing as ["Standard"] instead of actual colors
- **Causes**: Empty arrays in Sanity, missing GROQ fields
- **Solutions**: How to populate and verify arrays

#### 📂 Category Issues
- **Issue**: Category shows "Uncategorized"
- **Causes**: Null category reference, deleted categories
- **Solutions**: How to fix category references

#### 📝 Descriptions Missing
- **Issue**: Empty descriptions
- **Causes**: Unfilled fields, missing GROQ fields
- **Solutions**: Content population guide

#### 🐛 Browser Console Debugging
- What to look for in console logs
- How to read Sanity API calls
- Network tab inspection guide

#### ✅ Quick Fix Checklist
A prioritized, ordered list of checks to perform when debugging:
1. Sanity Studio Check
2. GROQ Query Check
3. TypeScript Types
4. Console Logs
5. Component Props

---

## 🔍 Key Concepts Explained

### The `->` Operator (Dereference)
```groq
"mainImage": mainImage.asset->url
```
This operator follows a reference and extracts the specified property. Without it, you'd get:
```json
{ "_ref": "image-abc123", "_type": "reference" }
```
With it, you get:
```json
"https://cdn.sanity.io/images/ximq2iuj/production/image-abc123.jpg"
```

### The `[]` Operator (Array Mapping)
```groq
"additionalImages": additionalImages[].asset->url
```
Maps over an array of image references and dereferences each one, returning an array of URL strings.

### Category Reference Expansion
```groq
"category": category->{
  _id,
  title,
  slug,
  description
}
```
Instead of just a reference ID, this expands the category into a full object with all its fields.

---

## 🎯 Use This Diagram When:

1. **Images aren't loading** → Check Section 5 (Images Not Displaying)
2. **Colors/Sizes show defaults** → Check Section 5 (Colors & Sizes Issues)
3. **Categories not working** → Check Section 5 (Category Issues)
4. **Adding new product fields** → Check Section 1 (Schema Structure) and Section 3 (GROQ Queries)
5. **Understanding data flow** → Read Section 3 (Data Flow & Transformation)
6. **Creating new components** → Check Section 4 (Frontend Components)
7. **Debugging any issue** → Follow Section 5 (Quick Fix Checklist)

---

## 📊 Data Flow Summary

```
Sanity Studio (Content Entry)
    ↓
GROQ Query (Data Fetch)
    ↓
Dereference → (References to Full Objects)
    ↓
Normalize (Sanity Format → App Format)
    ↓
Type Conversion (TypeScript Types)
    ↓
Component Props (React Components)
    ↓
UI Render (Browser Display)
```

---

## 🔗 Related Files

- **Sanity Client**: `/utils/sanity/client.ts`
- **Product Service**: `/utils/sanity/productService.ts`
- **Category Service**: `/utils/sanity/categoryService.ts`
- **Type Definitions**: `/utils/sanity/types.ts`
- **Product Card**: `/components/ProductCard.tsx`
- **Product Modal**: `/components/ProductModal.tsx`
- **Collection Page**: `/components/CollectionPage.tsx`
- **Admin Panel**: `/components/AdminPage.tsx`

---

## 💡 Pro Tips

1. **Always check Sanity Studio first** - Most issues stem from missing or incorrect content in Sanity
2. **Use console logs** - The app logs detailed information about data transformations
3. **Check browser Network tab** - Verify Sanity API calls are successful (Status 200)
4. **Verify GROQ syntax** - Missing `->` or `[]` operators cause major issues
5. **Test with one product** - Populate one product completely before scaling up
6. **Use Sanity Vision** - Available in Sanity Studio to test GROQ queries live

---

## 🚀 Quick Start Debugging

1. **Open the Flow Diagram**: `/?flow-diagram=true`
2. **Open Browser Console**: Press F12
3. **Open Sanity Studio**: https://ximq2iuj.sanity.studio
4. **Follow Section 5**: Start with the Quick Fix Checklist
5. **Check logs**: Look for red errors or warnings
6. **Verify one product**: Make sure it has all fields populated

---

## 📞 Support

If you're still stuck after using this diagram:
1. Check the console logs for specific error messages
2. Verify your Sanity Studio content is complete
3. Ensure CORS is configured in Sanity
4. Check that the Sanity API version matches (2023-05-03)

---

**Last Updated**: Based on current implementation with direct Sanity API integration, no Edge Functions, stable API version 2023-05-03.
