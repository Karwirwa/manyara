# Sanity Schema Setup for MANYARA

**Complete schema configuration for your Sanity Studio**

---

## 📋 Overview

This guide shows you exactly how to configure your Sanity Studio schemas for the MANYARA e-commerce site.

---

## 🗂️ Schema Files

Create these files in your Sanity Studio project:

```
sanity-studio/
└── schemas/
    ├── product.js      # Product schema
    ├── category.js     # Category schema
    └── index.js        # Schema registry
```

---

## 1️⃣ Product Schema

**File:** `schemas/product.js`

```javascript
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: Rule => Rule.required().max(100),
      description: 'Enter the product name (e.g., "Luxury Lace Bra")'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'Auto-generated from product name'
    },
    {
      name: 'mainImage',
      title: 'Main Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        }
      ],
      validation: Rule => Rule.required(),
      description: 'Primary product photo (front view recommended)'
    },
    {
      name: 'additionalImages',
      title: 'Additional Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }
          ],
        }
      ],
      options: {
        layout: 'grid',
      },
      description: 'Add 2-4 more photos (back view, details, lifestyle)'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: Rule => Rule.required(),
      description: 'Select the product category'
    },
    {
      name: 'price',
      title: 'Price (KSh)',
      type: 'number',
      validation: Rule => Rule.required().min(0),
      description: 'Price in Kenyan Shillings (numbers only, no commas)'
    },
    {
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Add color options (e.g., Black, Nude, Red)',
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Add size options (e.g., S, M, L, XL or 32A, 34B)',
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      validation: Rule => Rule.required().max(150),
      description: 'Brief product description (1-2 sentences, max 150 chars)'
    },
    {
      name: 'longDescription',
      title: 'Detailed Description',
      type: 'text',
      rows: 5,
      validation: Rule => Rule.required().max(500),
      description: 'Full product description with features, materials, care instructions'
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck if product is out of stock'
    },
    {
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
      description: 'Check to display on homepage and featured sections'
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'mainImage',
      subtitle: 'category.title',
      price: 'price',
      inStock: 'inStock'
    },
    prepare(selection) {
      const {title, media, subtitle, price, inStock} = selection;
      return {
        title: title,
        subtitle: `${subtitle || 'No category'} - KSh ${price ? price.toLocaleString() : '0'} ${!inStock ? '(Out of Stock)' : ''}`,
        media: media
      };
    }
  }
}
```

---

## 2️⃣ Category Schema

**File:** `schemas/category.js`

```javascript
export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: Rule => Rule.required().max(50),
      description: 'Category name (e.g., "Bras", "Panties", "Sleepwear")'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'Auto-generated from category name'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of this category (optional)'
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description'
    }
  }
}
```

---

## 3️⃣ Schema Registry

**File:** `schemas/index.js`

```javascript
import product from './product'
import category from './category'

export default [product, category]
```

---

## 4️⃣ Configure Sanity Studio

**File:** `sanity.config.js` (or `sanity.json` for older versions)

```javascript
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import schemas from './schemas'

export default defineConfig({
  name: 'default',
  title: 'MANYARA Lingerie',
  
  projectId: 'ximq2iuj',
  dataset: 'production',
  
  plugins: [
    deskTool(),
    visionTool(),
  ],
  
  schema: {
    types: schemas,
  },
})
```

---

## 📝 Default Categories to Create

Create these categories in your Sanity Studio:

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

## 🎨 Example Product Entry

Here's a complete example product to create in Sanity:

```javascript
{
  name: "Luxury Lace Bralette",
  slug: { current: "luxury-lace-bralette" },
  
  // Upload images via Sanity Studio interface
  mainImage: [Upload image],
  additionalImages: [Upload 2-3 more images],
  
  category: [Select "Bras" from dropdown],
  
  price: 2500,
  
  colors: ["Black", "Nude", "Burgundy Wine", "White"],
  
  sizes: ["32A", "32B", "34A", "34B", "36B", "36C"],
  
  shortDescription: "Delicate lace bralette with wireless design and adjustable straps for all-day comfort and style.",
  
  longDescription: "Our Luxury Lace Bralette combines elegance with exceptional comfort. Crafted from premium French lace with a wireless design for natural shape and support. Fully adjustable straps ensure a perfect fit. The soft microfiber lining provides comfort while the intricate lace overlay adds sophistication. Perfect for everyday wear or special occasions. Hand wash recommended.",
  
  inStock: true,
  
  featured: true
}
```

---

## 🚀 Deployment Steps

### 1. Install Sanity CLI
```bash
npm install -g @sanity/cli
```

### 2. Login to Sanity
```bash
sanity login
```

### 3. Navigate to Your Project
```bash
cd /path/to/your/sanity-studio
```

### 4. Deploy Schema
```bash
sanity deploy
```

### 5. Open Studio
```bash
sanity start
```

Then go to `http://localhost:3333`

---

## 🔑 GROQ Query Examples

### Fetch All Products
```groq
*[_type == "product"] | order(_createdAt desc) {
  _id,
  name,
  slug,
  mainImage,
  "category": category->title,
  price,
  colors,
  sizes,
  inStock,
  featured
}
```

### Fetch Products by Category
```groq
*[_type == "product" && category->slug.current == "bras"] {
  _id,
  name,
  mainImage,
  price
}
```

### Fetch Featured Products
```groq
*[_type == "product" && featured == true] {
  _id,
  name,
  mainImage,
  price
}
```

---

## ✅ Validation Checklist

Before going live, verify:

- [ ] Product schema is deployed
- [ ] Category schema is deployed
- [ ] At least 5-10 products created
- [ ] All products have images
- [ ] All products have categories assigned
- [ ] Prices are numbers (not text)
- [ ] Colors and sizes are arrays
- [ ] Featured products are marked
- [ ] All products are published (not drafts)

---

## 🔧 Troubleshooting

### Schema not updating
```bash
sanity deploy --force
```

### Can't see products on website
1. Check if products are published (not drafts)
2. Verify "In Stock" is checked
3. Check browser console for GROQ errors

### Images not loading
1. Ensure images uploaded to Sanity (not URLs)
2. Check asset references are valid
3. Verify CDN is accessible

---

## 📞 Support

- **Sanity Docs**: https://www.sanity.io/docs
- **GROQ Docs**: https://www.sanity.io/docs/groq
- **Community**: https://slack.sanity.io

---

**You're ready to build your product catalog! 🎉**
