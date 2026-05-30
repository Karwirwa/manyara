/**
 * TypeScript interfaces for Sanity CMS data structures
 * Based on MANYARA schema
 */

// Sanity Image Reference
export interface SanityImageRef {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

// Sanity Image Source (can be URL string or Image Reference)
export type SanityImageSource = string | SanityImageRef | {
  asset?: {
    _ref?: string;
    _type?: string;
    url?: string;
  };
};

// Sanity Category
export interface SanityCategory {
  _id: string;
  _type: 'category';
  title: string;
  slug: {
    current: string;
  };
  description?: string;
}

// Sanity Product (raw from CMS)
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

// Product with expanded category (after GROQ join)
export interface SanityProductWithCategory {
  _id: string;
  _type: 'product';
  _createdAt: string;
  _updatedAt: string;
  name: string;
  slug: {
    current: string;
  };
  mainImage: string; // Now a URL string from mainImage.asset->url
  additionalImages?: string[]; // Now an array of URL strings
  category: SanityCategory;
  price: number;
  colors?: string[];
  sizes?: string[];
  shortDescription?: string;
  longDescription?: string;
  inStock?: boolean;
  featured?: boolean;
}

// Normalized Product for app use
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

// Order interface for Supabase
export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: 'mpesa' | 'bank_transfer' | 'paypal';
  total_amount: number;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  mpesa_transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}