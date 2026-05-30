# MANYARA Lingerie - Sanity CMS Schema Guide

## Quick Setup Instructions

This guide will help you set up your Sanity CMS with the correct product categories and schemas for MANYARA.

---

## Categories to Create in Sanity

Create a **Category** document type with these 10 categories:

### 1. Bodyshapers
- **Title**: `Bodyshapers`
- **Slug**: `bodyshapers`
- **Description**: Smooth silhouette enhancing bodyshapers with comfortable all-day wear

### 2. Bodystocking
- **Title**: `Bodystocking`
- **Slug**: `bodystocking`
- **Description**: Delicate lace and mesh bodystockings for intimate moments

### 3. Bridal Lingerie
- **Title**: `Bridal Lingerie`
- **Slug**: `bridal-lingerie`
- **Description**: Elegant lace lingerie sets for your special night

### 4. Corsets
- **Title**: `Corsets`
- **Slug**: `corsets`
- **Description**: Premium quality corsets with steel boning for excellent waist cinching

### 5. Leather Lingerie
- **Title**: `Leather Lingerie`
- **Slug**: `leather-lingerie`
- **Description**: Edgy vegan leather lingerie with adjustable straps and metal hardware

### 6. Lingerie 2 Piece Set
- **Title**: `Lingerie 2 Piece Set`
- **Slug**: `lingerie-2-piece-set`
- **Description**: Classic lace lingerie sets for everyday luxury

### 7. Nightgowns
- **Title**: `Nightgowns`
- **Slug**: `nightgowns`
- **Description**: Elegant silk and lace nightgowns for luxurious sleep

### 8. Shapewear
- **Title**: `Shapewear`
- **Slug**: `shapewear`
- **Description**: Comfortable tummy control shapewear with seamless design

### 9. Sissy Lingerie
- **Title**: `Sissy Lingerie`
- **Slug**: `sissy-lingerie`
- **Description**: Silky satin and lace pieces with ultra-feminine styling

### 10. Thongs
- **Title**: `Thongs`
- **Slug**: `thongs`
- **Description**: Essential lace and satin thongs with no visible panty lines

---

## Sanity Schema Files

### 1. Category Schema (`schemas/category.ts`)

```typescript
export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
};
```

### 2. Product Schema (`schemas/product.ts`)

```typescript
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price (KSh)',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'image',
      title: 'Main Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'additionalImages',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'One Size', value: 'One Size' },
          { title: 'Plus Size', value: 'Plus Size' },
          { title: 'XS', value: 'XS' },
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
        ],
      },
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'color',
      title: 'Available Color',
      type: 'string',
      options: {
        list: [
          { title: 'Black', value: 'Black' },
          { title: 'White', value: 'White' },
          { title: 'Red', value: 'Red' },
          { title: 'Nude', value: 'Nude' },
          { title: 'Burgundy', value: 'Burgundy' },
          { title: 'Navy', value: 'Navy' },
          { title: 'Purple', value: 'Purple' },
          { title: 'Pink', value: 'Pink' },
          { title: 'Champagne', value: 'Champagne' },
          { title: 'Ivory', value: 'Ivory' },
          { title: 'Emerald', value: 'Emerald' },
          { title: 'Lavender', value: 'Lavender' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.required().max(200),
    },
    {
      name: 'longDescription',
      title: 'Detailed Description',
      type: 'text',
      rows: 6,
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    },
  ],
};
```

### 3. Main Schema Index (`schemas/index.ts`)

```typescript
import category from './category';
import product from './product';

export const schemaTypes = [category, product];
```

---

## Important Notes

1. **Sanity Project ID**: `ximq2iuj`
2. **Dataset**: `production`
3. **API Version**: `2024-01-01`

### To Deploy Your Schemas:

1. In your Sanity project directory, run:
   ```bash
   sanity deploy
   ```

2. Create all 10 categories first (they're referenced by products)

3. Then create your products, making sure to:
   - Select the correct category
   - Upload high-quality images
   - Add all available sizes
   - Set the price in KSh (Kenyan Shillings)
   - Write compelling descriptions
   - Mark as "In Stock" and optionally "Featured"

4. **Publish** all documents (not just drafts!)

---

## Test Your Integration

Once products are published in Sanity, your MANYARA website will automatically fetch them via the Supabase Edge Function at:

```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products
```

Check your browser console for:
- ✅ `Loaded X products from Sanity CMS` - Success!
- ❌ Error messages - Check Sanity API permissions

---

## Business Contact Details (Already Configured)

- **Email**: rispahkarwirwa@gmail.com
- **Phone**: +254 797 040 512
- **M-Pesa Till**: 7121042
- **Instagram**: https://www.instagram.com/manyara_intimates/
- **Facebook**: https://web.facebook.com/profile.php?id=61574430731029

---

## Payment Methods Now Available

1. **M-Pesa** (Till 7121042) - Instant confirmation
2. **Bank Transfer** - Contact 0797040512, send proof to rispahkarwirwa@gmail.com
3. **Cash on Delivery** - Available in Nairobi & major towns

Both customer and business receive order confirmation emails with receipts! 📧
