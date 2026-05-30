# MANYARA - Sanity CMS Integration Guide

## Overview

The MANYARA e-commerce website now uses **Sanity CMS (Project ID: ximq2iuj)** as the single source of truth for all product and category data, with **Supabase** handling orders, authentication, and backend operations.

---

## Architecture

### Data Flow
```
┌─────────────────┐
│   Sanity CMS    │ ← Product & Category Management
│  (ximq2iuj)     │
└────────┬────────┘
         │
         │ GROQ API
         │
         ▼
┌─────────────────┐
│  React Frontend │ ← Product Display & Shopping
│   (Figma Make)  │
└────────┬────────┘
         │
         │ REST API
         │
         ▼
┌─────────────────┐
│    Supabase     │ ← Order Management & Backend
│ (trtqbruuzdvl…) │
└─────────────────┘
```

### Responsibilities

**Sanity CMS** (Project ID: ximq2iuj)
- Product catalog (name, price, images, descriptions)
- Category management
- Product metadata (colors, sizes, availability)
- Image hosting via Sanity CDN

**Supabase** (Project ID: trtqbruuzdvlmzrzwrot)
- Order storage and management
- Customer data
- Payment tracking (M-Pesa, Bank Transfer, COD)
- Admin authentication

---

## File Structure

```
/utils/sanity/
├── client.ts              # Sanity client & image URL builders
├── types.ts               # TypeScript interfaces for Sanity data
├── productService.ts      # Product data fetching
├── categoryService.ts     # Category data fetching
└── index.ts              # Central exports

/utils/supabase/
├── info.tsx              # Supabase credentials (auto-generated)
└── orderService.ts       # Order management functions

/components/
├── CollectionPage.tsx    # Product listing (uses Sanity)
├── CategoriesShowcase.tsx # Category display (uses Sanity)
├── ProductCard.tsx       # Product card component
├── ProductModal.tsx      # Product detail modal
├── CheckoutPage.tsx      # Checkout & payment (uses Supabase)
└── AdminPage.tsx         # Admin dashboard
```

---

## Key Features

### 1. Product Management

Products are fetched directly from Sanity using GROQ queries:

```typescript
import { fetchProducts } from '../utils/sanity/productService';

const products = await fetchProducts();
```

**Available Functions:**
- `fetchProducts()` - Get all products
- `fetchFeaturedProducts()` - Get featured products only
- `fetchProductsByCategory(slug)` - Get products in a category
- `fetchProductBySlug(slug)` - Get single product

### 2. Category Management

Categories are dynamically loaded from Sanity:

```typescript
import { fetchCategories, getCategoryTitles } from '../utils/sanity/categoryService';

const categories = await fetchCategories();
const categoryNames = await getCategoryTitles();
```

### 3. Image Handling

Sanity images are automatically optimized:

```typescript
import { buildOptimizedSanityImageUrl } from '../utils/sanity/client';

const imageUrl = buildOptimizedSanityImageUrl(product.mainImage, {
  width: 800,
  quality: 85
});
```

### 4. Order Management

Orders are stored in Supabase:

```typescript
import { createOrder } from '../utils/supabase/orderService';

const order = await createOrder({
  customerName: 'Jane Doe',
  customerEmail: 'jane@example.com',
  customerPhone: '0712345678',
  deliveryAddress: 'Nairobi, Kenya',
  paymentMethod: 'mpesa',
  totalAmount: 5000,
  items: orderItems
});
```

---

## Sanity Schema Requirements

### Product Schema
```javascript
{
  name: 'product',
  type: 'document',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'mainImage', type: 'image' },
    { name: 'additionalImages', type: 'array', of: [{ type: 'image' }] },
    { name: 'category', type: 'reference', to: [{ type: 'category' }] },
    { name: 'price', type: 'number' },
    { name: 'colors', type: 'array', of: [{ type: 'string' }] },
    { name: 'sizes', type: 'array', of: [{ type: 'string' }] },
    { name: 'shortDescription', type: 'text' },
    { name: 'longDescription', type: 'text' },
    { name: 'inStock', type: 'boolean' },
    { name: 'featured', type: 'boolean' }
  ]
}
```

### Category Schema
```javascript
{
  name: 'category',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'description', type: 'text' }
  ]
}
```

---

## Supabase Schema Requirements

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('mpesa', 'bank_transfer', 'cash_on_delivery')),
  total_amount NUMERIC NOT NULL,
  items JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  mpesa_transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Environment Setup

### Sanity Configuration
- **Project ID**: `ximq2iuj`
- **Dataset**: `production`
- **API Version**: `2024-01-01`
- **CDN URL**: `https://ximq2iuj.api.sanity.io/v2024-01-01/data/query/production`

### Supabase Configuration
- **Project ID**: `trtqbruuzdvlmzrzwrot`
- **URL**: `https://trtqbruuzdvlmzrzwrot.supabase.co`
- **Anon Key**: (stored in `/utils/supabase/info.tsx`)

---

## Usage Examples

### Fetching and Displaying Products

```tsx
import { useState, useEffect } from 'react';
import { fetchProducts } from '../utils/sanity/productService';

function ProductList() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <img src={product.imageUrl} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.priceFormatted}</p>
        </div>
      ))}
    </div>
  );
}
```

### Creating an Order

```tsx
import { createOrder } from '../utils/supabase/orderService';

async function handleCheckout(cartItems, customerInfo) {
  const orderItems = cartItems.map(item => ({
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    price: item.unitPrice
  }));
  
  const order = await createOrder({
    customerName: customerInfo.name,
    customerEmail: customerInfo.email,
    customerPhone: customerInfo.phone,
    deliveryAddress: customerInfo.address,
    paymentMethod: 'mpesa',
    totalAmount: calculateTotal(cartItems),
    items: orderItems
  });
  
  console.log('Order created:', order.id);
}
```

---

## Troubleshooting

### Products not loading
1. Check console for error messages
2. Verify Sanity project ID is correct (`ximq2iuj`)
3. Ensure products are published in Sanity Studio
4. Check GROQ query syntax in browser DevTools

### Images not displaying
1. Verify image asset references in Sanity
2. Check browser console for image URL format
3. Ensure images are uploaded to Sanity (not external URLs)

### Orders not saving
1. Check Supabase connection in DevTools Network tab
2. Verify `orders` table exists with correct schema
3. Check anon key permissions in Supabase dashboard

---

## Development Workflow

1. **Add Products in Sanity Studio**
   - Log into Sanity Studio
   - Create/edit products
   - Publish changes

2. **Test Product Display**
   - Products appear automatically on frontend
   - No code changes needed

3. **Monitor Orders in Supabase**
   - View orders in Supabase dashboard
   - Check order status and customer data

---

## Performance Optimization

### Image Optimization
Images are automatically optimized via Sanity CDN:
- Responsive sizing based on device
- Format conversion (WebP where supported)
- Quality adjustment (default: 85)
- Lazy loading implemented

### Caching Strategy
- Sanity CDN provides edge caching
- React state caching for loaded products
- Local storage for cart persistence

---

## Security Considerations

- Sanity API is public (read-only)
- Supabase uses Row Level Security (RLS)
- Customer data encrypted at rest
- Payment information not stored (M-Pesa handles)

---

## Contact & Support

**Business Contact:**
- Email: rispahkarwirwa@gmail.com
- Phone: 0797040512
- M-Pesa Till: 7121042

**Technical Issues:**
- Sanity Project: ximq2iuj
- Supabase Project: trtqbruuzdvlmzrzwrot

---

## Version History

- **v2.0** (January 2026) - Complete Sanity integration
- **v1.0** (December 2025) - Initial launch with hardcoded products
