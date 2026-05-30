# MANYARA Product Data Reference

## Quick Reference for Sanity CMS Product Management

### Product Interface (TypeScript)

```typescript
interface Product {
  id: string;                    // Sanity _id
  name: string;                  // Product name
  price: number;                 // Price in KSh
  priceFormatted: string;        // "KSh 2,500"
  sizes: string[];               // ["S", "M", "L", "XL"]
  colors: string[];              // ["Black", "Nude", "Red"]
  category: string;              // Category title
  categorySlug: string;          // Category slug
  imageUrl: string;              // Main product image (optimized)
  additionalImages: string[];    // Additional product images
  shortDescription: string;      // Brief product description
  longDescription: string;       // Detailed product description
  inStock: boolean;              // Availability status
  featured: boolean;             // Show on homepage
  slug: string;                  // Product URL slug
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

---

## Example Product in Sanity Studio

### Product: "Luxury Lace Bra"

```javascript
{
  _id: "product-123",
  _type: "product",
  name: "Luxury Lace Bra",
  slug: { current: "luxury-lace-bra" },
  
  mainImage: {
    _type: "image",
    asset: {
      _ref: "image-abc123..."
    }
  },
  
  additionalImages: [
    {
      _type: "image",
      asset: { _ref: "image-def456..." }
    },
    {
      _type: "image",
      asset: { _ref: "image-ghi789..." }
    }
  ],
  
  category: {
    _type: "reference",
    _ref: "category-bras-001"
  },
  
  price: 2500,
  
  colors: ["Black", "Nude", "Red", "White"],
  
  sizes: ["32A", "32B", "34A", "34B", "36B", "36C"],
  
  shortDescription: "Delicate lace bra with underwire support and adjustable straps for all-day comfort.",
  
  longDescription: "Our Luxury Lace Bra combines elegance with exceptional support. Crafted from premium French lace with underwire cups and fully adjustable straps. The soft microfiber backing ensures comfort while the intricate lace overlay adds a touch of sophistication. Perfect for everyday wear or special occasions.",
  
  inStock: true,
  
  featured: true
}
```

---

## Category Examples

### Common Categories for MANYARA

1. **Bras**
   - Slug: `bras`
   - Description: "Supportive and elegant bras for every occasion"

2. **Panties**
   - Slug: `panties`
   - Description: "Comfortable and stylish underwear essentials"

3. **Lingerie Sets**
   - Slug: `lingerie-sets`
   - Description: "Coordinated sets for a complete look"

4. **Sleepwear**
   - Slug: `sleepwear`
   - Description: "Luxurious nightwear for restful sleep"

5. **Bodyshapers**
   - Slug: `bodyshapers`
   - Description: "Smoothing shapewear for a confident silhouette"

6. **Bodystocking**
   - Slug: `bodystocking`
   - Description: "Alluring full-body pieces"

7. **Swimwear**
   - Slug: `swimwear`
   - Description: "Stylish swimsuits and beachwear"

8. **Accessories**
   - Slug: `accessories`
   - Description: "Complete your look with our accessories"

---

## Standard Size Options

### Bras
```javascript
sizes: [
  "32A", "32B", "32C", "32D",
  "34A", "34B", "34C", "34D",
  "36A", "36B", "36C", "36D",
  "38B", "38C", "38D",
  "40B", "40C", "40D"
]
```

### Panties
```javascript
sizes: ["XS", "S", "M", "L", "XL", "XXL"]
```

### Bodyshapers
```javascript
sizes: ["S", "M", "L", "XL", "XXL"]
```

### Lingerie Sets
```javascript
sizes: [
  "S (32A-32B)",
  "M (34A-34C)",
  "L (36B-36D)",
  "XL (38B-38D)"
]
```

### Sleepwear
```javascript
sizes: ["XS", "S", "M", "L", "XL", "XXL"]
```

### Bodystocking
```javascript
sizes: ["One Size", "Plus Size"]
```

---

## Standard Color Options

### Classic Colors
```javascript
colors: ["Black", "White", "Nude", "Beige"]
```

### Romantic Colors
```javascript
colors: ["Red", "Pink", "Rose", "Burgundy Wine"]
```

### Luxury Colors
```javascript
colors: ["Champagne Gold", "Ivory Pearl", "Olive Sage", "Deep Purple"]
```

### Full Palette
```javascript
colors: [
  "Black", "White", "Nude", "Beige",
  "Red", "Burgundy Wine", "Pink", "Rose",
  "Purple", "Navy Blue", "Emerald Green",
  "Champagne Gold", "Ivory Pearl", "Olive Sage"
]
```

---

## Price Ranges (in KSh)

### Budget-Friendly
- Panties: 500 - 1,000
- Basic Bras: 1,000 - 1,500

### Mid-Range
- Lace Bras: 1,500 - 2,500
- Lingerie Sets: 2,000 - 3,500
- Sleepwear: 1,500 - 2,500

### Premium
- Designer Bras: 2,500 - 4,000
- Luxury Sets: 3,500 - 6,000
- Bodyshapers: 2,000 - 3,500

### Special Occasion
- Bridal Lingerie: 4,000 - 8,000
- Bodystocking: 2,500 - 5,000

---

## Product Description Templates

### Short Description (100-150 characters)
```
Template: "[Style] [Product Type] with [Key Feature] for [Benefit]."

Examples:
- "Seamless push-up bra with memory foam cups for natural lift and comfort."
- "High-waist control panties with firm compression for a smooth silhouette."
- "Luxury satin chemise with delicate lace trim for elegant evenings."
```

### Long Description (300-500 characters)
```
Template:
"Our [Product Name] [key selling point]. [Material details] [Technical features]. [Fit/Comfort]. [Styling/Occasion]. [Care instructions optional]."

Example:
"Our Luxury Lace Bra combines elegance with exceptional support. Crafted from premium French lace with underwire cups and fully adjustable straps. The soft microfiber backing ensures comfort while the intricate lace overlay adds sophistication. Perfect for everyday wear or special occasions. Available in multiple colors to match your style."
```

---

## Image Guidelines

### Image Requirements
- **Format**: JPG or PNG
- **Minimum Size**: 800x1000px
- **Aspect Ratio**: 4:5 (portrait) or 3:4
- **Background**: White or lifestyle setting
- **Quality**: High resolution, well-lit

### Recommended Images per Product
1. **Main Image**: Front view on model or mannequin
2. **Additional Image 1**: Back view
3. **Additional Image 2**: Detail shot (lace, fabric, etc.)
4. **Additional Image 3**: Lifestyle/styling shot (optional)

### Image Upload to Sanity
1. Open product in Sanity Studio
2. Click "Main Image" field
3. Upload or select from library
4. Repeat for "Additional Images"
5. Add alt text for accessibility

---

## Creating Products in Sanity Studio

### Step-by-Step Guide

1. **Open Sanity Studio**
   - Navigate to your Sanity Studio URL
   - Log in with credentials

2. **Create New Product**
   - Click "+ New Product" or similar
   - Enter product name
   - Generate slug (auto or manual)

3. **Add Images**
   - Upload main product image
   - Add 2-4 additional images
   - Add alt text to each image

4. **Set Category**
   - Select from existing categories
   - Or create new category if needed

5. **Enter Details**
   - Price (numbers only, no currency symbol)
   - Sizes (add as array items)
   - Colors (add as array items)
   - Short description (1-2 sentences)
   - Long description (2-3 paragraphs)

6. **Set Availability**
   - Check "In Stock" if available
   - Check "Featured" for homepage display

7. **Publish**
   - Click "Publish" button
   - Product appears on website immediately

---

## API Usage Examples

### Fetch All Products
```typescript
import { fetchProducts } from '../utils/sanity/productService';

const products = await fetchProducts();
// Returns: Product[]
```

### Fetch by Category
```typescript
import { fetchProductsByCategory } from '../utils/sanity/productService';

const bras = await fetchProductsByCategory('bras');
// Returns: Product[] filtered by category
```

### Fetch Single Product
```typescript
import { fetchProductBySlug } from '../utils/sanity/productService';

const product = await fetchProductBySlug('luxury-lace-bra');
// Returns: Product | null
```

### Fetch Featured Products
```typescript
import { fetchFeaturedProducts } from '../utils/sanity/productService';

const featured = await fetchFeaturedProducts();
// Returns: Product[] where featured === true
```

---

## Common Issues & Solutions

### Issue: Product not appearing on website
**Solution:**
1. Check if product is published in Sanity
2. Verify "In Stock" is checked
3. Clear browser cache
4. Check browser console for errors

### Issue: Images not loading
**Solution:**
1. Verify images are uploaded to Sanity (not external URLs)
2. Check image asset references in Sanity
3. Look for broken image URLs in console

### Issue: Wrong category
**Solution:**
1. Edit product in Sanity Studio
2. Update category reference
3. Republish product

### Issue: Price not displaying
**Solution:**
1. Ensure price is a number (not text)
2. Check for decimal places (2500, not "2,500")
3. Verify price field is not empty

---

## Best Practices

1. **Consistent Naming**
   - Use title case for product names
   - Be descriptive but concise

2. **Image Quality**
   - Use professional photos
   - Consistent lighting and backgrounds
   - Show product from multiple angles

3. **SEO-Friendly Slugs**
   - lowercase-with-hyphens
   - Include key product features
   - Keep under 60 characters

4. **Complete Descriptions**
   - Highlight key features
   - Mention materials and care
   - Be honest about fit and sizing

5. **Regular Updates**
   - Mark out-of-stock items
   - Update seasonal products
   - Refresh featured products monthly

---

## Contact for Questions

**Rispah Karwirwa**
- Email: rispahkarwirwa@gmail.com
- Phone: 0797040512
- Instagram/Facebook: @manyara_intimates
