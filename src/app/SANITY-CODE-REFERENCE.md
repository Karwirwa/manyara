# MANYARA - Category & Image Access Code Reference
## Copy-Paste Ready Code Snippets

---

## 📋 Table of Contents
1. [Sanity Client Configuration](#1-sanity-client-configuration)
2. [Fetching Categories](#2-fetching-categories)
3. [Fetching Products](#3-fetching-products)
4. [Image URL Building](#4-image-url-building)
5. [GROQ Queries](#5-groq-queries)
6. [TypeScript Types](#6-typescript-types)

---

## 1. Sanity Client Configuration

### File: `/utils/sanity/client.ts`

```typescript
import { createClient } from '@sanity/client';

/**
 * Sanity project configuration
 */
export const SANITY_PROJECT_ID = 'ximq2iuj';
export const SANITY_DATASET = 'production';
export const SANITY_API_VERSION = '2023-05-03';

/**
 * Sanity client instance
 */
export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true, // Use CDN for faster response
  perspective: 'published', // Only fetch published documents
});

/**
 * Generic fetch function from Sanity
 */
export async function fetchFromSanity<T = any>(
  query: string,
  params: Record<string, any> = {}
): Promise<T> {
  try {
    const result = await sanityClient.fetch<T>(query, params);
    return result;
  } catch (error: any) {
    console.error('Sanity fetch error:', error);
    throw new Error(`Failed to fetch from Sanity: ${error.message}`);
  }
}
```

---

## 2. Fetching Categories

### File: `/utils/sanity/categoryService.ts`

#### Basic Category Fetch
```typescript
import { fetchFromSanity } from './client';
import { SanityCategory } from './types';

/**
 * GROQ Query to get all categories
 */
const CATEGORIES_QUERY = `
  *[_type == "category"] | order(title asc) {
    _id,
    _type,
    title,
    slug,
    description
  }
`;

/**
 * Fetch all categories from Sanity CMS
 */
export async function fetchCategories(): Promise<SanityCategory[]> {
  console.log('📂 Fetching categories from Sanity CMS...');
  
  const categories = await fetchFromSanity<SanityCategory[]>(CATEGORIES_QUERY);
  
  if (!categories || !Array.isArray(categories)) {
    console.warn('⚠️ No categories found in Sanity CMS');
    return [];
  }
  
  console.log(`✅ Loaded ${categories.length} categories from Sanity`);
  return categories;
}
```

#### Categories with Product Count
```typescript
/**
 * GROQ Query to get categories with product counts
 */
const CATEGORIES_WITH_COUNT_QUERY = `
  *[_type == "category"] | order(title asc) {
    _id,
    _type,
    title,
    slug,
    description,
    "productCount": count(*[_type == "product" && references(^._id)]),
    "sampleProduct": *[_type == "product" && references(^._id)][0]{
      images
    }
  }
`;

export interface CategoryWithCount extends SanityCategory {
  productCount: number;
  sampleProduct?: {
    images?: any[];
  };
}

/**
 * Fetch categories with product counts
 */
export async function fetchCategoriesWithCount(): Promise<CategoryWithCount[]> {
  console.log('📊 Fetching categories with product counts...');
  
  const categories = await fetchFromSanity<CategoryWithCount[]>(
    CATEGORIES_WITH_COUNT_QUERY
  );
  
  if (!categories || !Array.isArray(categories)) {
    console.warn('⚠️ No categories found in Sanity CMS');
    return [];
  }
  
  console.log(`✅ Loaded ${categories.length} categories with counts`);
  return categories;
}
```

#### Get Category Titles (for filters)
```typescript
/**
 * Get category titles as array (for filters)
 */
export async function getCategoryTitles(): Promise<string[]> {
  const categories = await fetchCategories();
  return categories.map(cat => cat.title);
}
```

---

## 3. Fetching Products

### File: `/utils/sanity/productService.ts`

#### GROQ Query for Products
```typescript
import { fetchFromSanity } from './client';
import { SanityProductWithCategory, Product } from './types';

/**
 * GROQ Query to fetch all products with category details
 */
const PRODUCTS_QUERY = `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    name,
    slug,
    images,
    "category": category->{
      _id,
      title,
      slug,
      description
    },
    price,
    color,
    sizes,
    shortDescription,
    longDescription,
    inStock,
    featured
  }
`;
```

#### Fetch Products Function
```typescript
/**
 * Fetch all products from Sanity CMS
 */
export async function fetchProducts(): Promise<Product[]> {
  console.log('📦 Fetching products from Sanity CMS...');
  
  const sanityProducts = await fetchFromSanity<SanityProductWithCategory[]>(
    PRODUCTS_QUERY
  );
  
  if (!sanityProducts || !Array.isArray(sanityProducts) || sanityProducts.length === 0) {
    console.warn('⚠️ No products found in Sanity CMS');
    return [];
  }
  
  console.log(`✅ Found ${sanityProducts.length} products in Sanity`);
  
  // Normalize each product
  const products = sanityProducts.map(normalizeProduct);
  
  console.log(`✅ Successfully normalized ${products.length} products`);
  return products;
}
```

#### Normalize Product Function (with Image Extraction)
```typescript
/**
 * Normalize Sanity product to app Product format
 * Extracts images from Sanity structure and converts to CDN URLs
 */
function normalizeProduct(sanityProduct: SanityProductWithCategory): Product {
  // Get raw images array from Sanity
  const rawImages = (sanityProduct as any).images || [];
  
  console.log('🔬 DEBUG - Raw images structure:', {
    productName: sanityProduct.name,
    rawImagesCount: rawImages.length,
    firstRawImage: rawImages[0],
  });
  
  // Extract URLs from raw image objects
  // Sanity image structure: { _key: "...", image: { asset: { _ref: "..." } }, view: "..." }
  const finalImages: string[] = rawImages.map((img: any) => {
    // Skip empty/invalid entries
    if (!img || (img._key && Object.keys(img).length === 1)) {
      return '';
    }
    
    // Check if image is nested (has .image property)
    const imageObj = img?.image || img;
    
    // Direct URL
    if (typeof imageObj === 'string') return imageObj;
    
    // asset.url (already dereferenced)
    if (imageObj?.asset?.url) {
      console.log('✅ Found asset.url:', imageObj.asset.url);
      return imageObj.asset.url;
    }
    
    // asset._ref - convert to CDN URL
    if (imageObj?.asset?._ref) {
      const ref = imageObj.asset._ref;
      console.log('📝 Converting asset._ref:', ref);
      
      // Format: image-{assetId}-{width}x{height}-{format}
      const withoutPrefix = ref.replace('image-', '');
      const parts = withoutPrefix.split('-');
      
      if (parts.length >= 2) {
        const assetId = parts[0];
        const dimensions = parts[1];
        const format = parts[2] || 'jpg';
        
        // Build Sanity CDN URL
        const url = `https://cdn.sanity.io/images/ximq2iuj/production/${assetId}-${dimensions}.${format}`;
        console.log('🎨 Generated URL:', url);
        return url;
      }
    }
    
    return '';
  }).filter(Boolean); // Remove empty strings
  
  console.log('✅ Extracted image URLs:', finalImages);
  
  // Main image is first, rest are additional
  const mainImageUrl = finalImages[0] || '';
  const additionalImageUrls = finalImages.slice(1) || [];
  
  // Optimize image URLs with transformations
  const optimizeImageUrl = (url: string): string => {
    if (!url) return '';
    if (!url.startsWith('http')) return url;
    
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', '800');
      urlObj.searchParams.set('h', '1000');
      urlObj.searchParams.set('fit', 'crop');
      urlObj.searchParams.set('q', '80');
      return urlObj.toString();
    } catch {
      return url;
    }
  };
  
  // Get colors (can be string or array)
  const color = (sanityProduct as any).color || 'Standard';
  const colors = Array.isArray(color) ? color : [color];
  
  // Get sizes
  const sizes = sanityProduct.sizes || ['One Size'];
  
  // Return normalized product
  return {
    id: sanityProduct._id,
    name: sanityProduct.name,
    price: sanityProduct.price || 0,
    priceFormatted: `KSh ${(sanityProduct.price || 0).toLocaleString()}`,
    sizes: sizes,
    colors: colors,
    category: sanityProduct.category?.title || 'Uncategorized',
    categorySlug: sanityProduct.category?.slug?.current,
    imageUrl: optimizeImageUrl(mainImageUrl),
    additionalImages: additionalImageUrls.map(optimizeImageUrl),
    shortDescription: sanityProduct.shortDescription || '',
    longDescription: sanityProduct.longDescription || sanityProduct.shortDescription || '',
    inStock: sanityProduct.inStock !== false,
    featured: sanityProduct.featured || false,
    slug: sanityProduct.slug?.current || '',
    createdAt: sanityProduct._createdAt,
    updatedAt: sanityProduct._updatedAt,
  };
}
```

#### Fetch Single Product by Slug
```typescript
/**
 * Fetch single product by slug
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const query = `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      name,
      slug,
      images,
      "category": category->{
        _id,
        title,
        slug,
        description
      },
      price,
      color,
      sizes,
      shortDescription,
      longDescription,
      inStock,
      featured
    }
  `;
  
  const sanityProduct = await fetchFromSanity<SanityProductWithCategory>(query, { slug });
  
  if (!sanityProduct) {
    return null;
  }
  
  return normalizeProduct(sanityProduct);
}
```

#### Fetch Products by Category
```typescript
/**
 * Fetch products by category slug
 */
export async function fetchProductsByCategory(categorySlug: string): Promise<Product[]> {
  const query = `
    *[_type == "product" && category->slug.current == $categorySlug] | order(_createdAt desc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      name,
      slug,
      images,
      "category": category->{
        _id,
        title,
        slug,
        description
      },
      price,
      color,
      sizes,
      shortDescription,
      longDescription,
      inStock,
      featured
    }
  `;
  
  const sanityProducts = await fetchFromSanity<SanityProductWithCategory[]>(
    query,
    { categorySlug }
  );
  
  if (!sanityProducts || !Array.isArray(sanityProducts)) {
    return [];
  }
  
  return sanityProducts.map(normalizeProduct);
}
```

---

## 4. Image URL Building

### Manual Sanity CDN URL Construction

```typescript
/**
 * Convert Sanity asset reference to CDN URL
 * 
 * @param assetRef - Sanity asset reference (e.g., "image-abc123xyz-1200x1600-jpg")
 * @returns Full CDN URL
 */
function buildSanityImageUrl(assetRef: string): string {
  const projectId = 'ximq2iuj';
  const dataset = 'production';
  
  // Remove "image-" prefix if present
  const withoutPrefix = assetRef.replace('image-', '');
  const parts = withoutPrefix.split('-');
  
  if (parts.length >= 2) {
    const assetId = parts[0];
    const dimensions = parts[1];
    const format = parts[2] || 'jpg';
    
    // Build URL: https://cdn.sanity.io/images/{projectId}/{dataset}/{assetId}-{dimensions}.{format}
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${format}`;
  }
  
  return '';
}

/**
 * Example usage:
 */
const assetRef = "image-abc123xyz456-1200x1600-jpg";
const imageUrl = buildSanityImageUrl(assetRef);
// Result: https://cdn.sanity.io/images/ximq2iuj/production/abc123xyz456-1200x1600.jpg
```

### Add Image Transformations

```typescript
/**
 * Add transformations to Sanity image URL
 * 
 * @param url - Base Sanity CDN URL
 * @param options - Transformation options
 * @returns URL with query parameters
 */
function addImageTransformations(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp';
    fit?: 'clip' | 'crop' | 'fill' | 'max' | 'min';
  } = {}
): string {
  try {
    const urlObj = new URL(url);
    
    if (options.width) urlObj.searchParams.set('w', options.width.toString());
    if (options.height) urlObj.searchParams.set('h', options.height.toString());
    if (options.quality) urlObj.searchParams.set('q', options.quality.toString());
    if (options.format) urlObj.searchParams.set('fm', options.format);
    if (options.fit) urlObj.searchParams.set('fit', options.fit);
    
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Example usage:
 */
const baseUrl = "https://cdn.sanity.io/images/ximq2iuj/production/abc123-1200x1600.jpg";
const optimizedUrl = addImageTransformations(baseUrl, {
  width: 800,
  height: 1000,
  quality: 80,
  fit: 'crop',
  format: 'webp'
});
// Result: https://cdn.sanity.io/images/ximq2iuj/production/abc123-1200x1600.jpg?w=800&h=1000&q=80&fit=crop&fm=webp
```

---

## 5. GROQ Queries

### All Categories
```groq
*[_type == "category"] | order(title asc) {
  _id,
  _type,
  title,
  slug,
  description
}
```

### Categories with Product Count
```groq
*[_type == "category"] | order(title asc) {
  _id,
  _type,
  title,
  slug,
  description,
  "productCount": count(*[_type == "product" && references(^._id)]),
  "sampleProduct": *[_type == "product" && references(^._id)][0]{
    images
  }
}
```

### All Products with Categories
```groq
*[_type == "product"] | order(_createdAt desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  slug,
  images,
  "category": category->{
    _id,
    title,
    slug,
    description
  },
  price,
  color,
  sizes,
  shortDescription,
  longDescription,
  inStock,
  featured
}
```

### Single Product by Slug
```groq
*[_type == "product" && slug.current == $slug][0] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  slug,
  images,
  "category": category->{
    _id,
    title,
    slug,
    description
  },
  price,
  color,
  sizes,
  shortDescription,
  longDescription,
  inStock,
  featured
}
```

### Products by Category Slug
```groq
*[_type == "product" && category->slug.current == $categorySlug] | order(_createdAt desc) {
  _id,
  name,
  slug,
  images,
  price,
  color,
  sizes,
  shortDescription,
  inStock,
  featured
}
```

### Featured Products Only
```groq
*[_type == "product" && featured == true] | order(_createdAt desc) {
  _id,
  name,
  slug,
  images,
  price,
  color,
  sizes,
  shortDescription
}
```

### Products in Stock
```groq
*[_type == "product" && inStock == true] | order(_createdAt desc) {
  _id,
  name,
  slug,
  images,
  price,
  category->{title, slug}
}
```

### Search Products by Name
```groq
*[_type == "product" && name match $searchTerm] | order(_createdAt desc) {
  _id,
  name,
  slug,
  images,
  price,
  category->{title, slug}
}
```

---

## 6. TypeScript Types

### File: `/utils/sanity/types.ts`

```typescript
/**
 * Sanity Category Interface
 */
export interface SanityCategory {
  _id: string;
  _type: 'category';
  title: string;
  slug: {
    current: string;
  };
  description?: string;
}

/**
 * Sanity Image Reference
 */
export interface SanityImageRef {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

/**
 * Sanity Product (raw from CMS)
 */
export interface SanityProductRaw {
  _id: string;
  _type: 'product';
  _createdAt: string;
  _updatedAt: string;
  name: string;
  slug: {
    current: string;
  };
  mainImage: SanityImageRef;
  additionalImages?: SanityImageRef[];
  category: {
    _ref: string;
    _type: 'reference';
  };
  price: number;
  colors?: string[];
  sizes?: string[];
  shortDescription?: string;
  longDescription?: string;
  inStock?: boolean;
  featured?: boolean;
}

/**
 * Product with expanded category (after GROQ join with ->)
 */
export interface SanityProductWithCategory {
  _id: string;
  _type: 'product';
  _createdAt: string;
  _updatedAt: string;
  name: string;
  slug: {
    current: string;
  };
  mainImage: string; // URL string from GROQ dereferencing
  additionalImages?: string[]; // Array of URL strings
  category: SanityCategory;
  price: number;
  colors?: string[];
  sizes?: string[];
  shortDescription?: string;
  longDescription?: string;
  inStock?: boolean;
  featured?: boolean;
}

/**
 * Normalized Product (for app use)
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  sizes: string[];
  colors: string[];
  category: string;
  categorySlug?: string;
  imageUrl: string;
  additionalImages: string[];
  shortDescription: string;
  longDescription: string;
  inStock: boolean;
  featured: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 7. Usage Examples

### In a React Component

```typescript
import { useEffect, useState } from 'react';
import { fetchCategories } from './utils/sanity/categoryService';
import { fetchProducts } from './utils/sanity/productService';
import { SanityCategory, Product } from './utils/sanity/types';

function MyComponent() {
  const [categories, setCategories] = useState<SanityCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch categories
        const cats = await fetchCategories();
        setCategories(cats);

        // Fetch products
        const prods = await fetchProducts();
        setProducts(prods);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Categories ({categories.length})</h2>
      {categories.map(cat => (
        <div key={cat._id}>
          <h3>{cat.title}</h3>
          <p>{cat.slug.current}</p>
        </div>
      ))}

      <h2>Products ({products.length})</h2>
      {products.map(product => (
        <div key={product.id}>
          <img src={product.imageUrl} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.priceFormatted}</p>
          <p>Category: {product.category}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 8. Key Points

### Categories:
- ✅ Fetched via `fetchCategories()` or `fetchCategoriesWithCount()`
- ✅ Accessed via GROQ: `*[_type == "category"]`
- ✅ Joined with products via: `category->` in product queries
- ✅ Each category has: `_id`, `title`, `slug`, `description`

### Images:
- ✅ Stored in Sanity as asset references
- ✅ Format: `image-{assetId}-{width}x{height}-{format}`
- ✅ Converted to CDN URLs: `https://cdn.sanity.io/images/ximq2iuj/production/...`
- ✅ Transformations added via URL params: `?w=800&h=1000&q=80&fit=crop`
- ✅ Main image: `images[0]`
- ✅ Additional images: `images.slice(1)`

### Products:
- ✅ Fetched via `fetchProducts()` or `fetchProductBySlug(slug)`
- ✅ Each product has `images` array (not `mainImage` + `additionalImages`)
- ✅ Category joined via: `"category": category->{...}`
- ✅ Colors can be string or array
- ✅ Sizes default to `['One Size']` if not set

---

## 9. Sanity Studio Schema Reference

### Category Schema
```javascript
// schemas/category.js
export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    }
  ]
}
```

### Product Schema
```javascript
// schemas/product.js
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              }
            },
            {
              name: 'view',
              title: 'View',
              type: 'string',
              options: {
                list: ['front', 'back', 'side', 'detail']
              }
            }
          ]
        }
      ]
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'price',
      title: 'Price (KSh)',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    {
      name: 'color',
      title: 'Colors',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
      }
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
      rows: 10
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false
    }
  ]
}
```

---

## ✅ Complete!

All code snippets are ready for copy-pasting. The MANYARA site uses:

1. **Sanity Project:** `ximq2iuj`
2. **Dataset:** `production`
3. **CDN Base:** `https://cdn.sanity.io/images/ximq2iuj/production/`
4. **Categories:** Fetched with GROQ `*[_type == "category"]`
5. **Products:** Fetched with GROQ `*[_type == "product"]`
6. **Images:** Extracted from `images` array, converted from asset refs to CDN URLs
