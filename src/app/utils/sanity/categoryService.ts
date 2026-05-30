/**
 * Sanity Category Service
 * Fetches categories directly from Sanity CMS (Project ID: ximq2iuj)
 */

import { fetchFromSanity } from './client';
import type { SanityCategory } from './types';

/**
 * GROQ Query to fetch all categories
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
 * GROQ Query to get categories with product counts and sample images
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
 * Fetch all categories from Sanity CMS
 */
export async function fetchCategories(): Promise<SanityCategory[]> {
  console.log('📂 Fetching categories from Sanity CMS...');
  
  const categories = await fetchFromSanity<SanityCategory[]>(CATEGORIES_QUERY);
  
  if (!categories || !Array.isArray(categories)) {
    console.warn('⚠️ No categories found in Sanity CMS');
    return [];
  }
  
  console.log(`�� Loaded ${categories.length} categories from Sanity`);
  return categories;
}

/**
 * Fetch categories with product counts from Sanity CMS
 */
export async function fetchCategoriesWithCount(): Promise<CategoryWithCount[]> {
  console.log('📊 Fetching categories with product counts...');
  
  const categories = await fetchFromSanity<CategoryWithCount[]>(CATEGORIES_WITH_COUNT_QUERY);
  
  if (!categories || !Array.isArray(categories)) {
    console.warn('⚠️ No categories found in Sanity CMS');
    return [];
  }
  
  console.log(`✅ Loaded ${categories.length} categories with counts`);
  return categories;
}

/**
 * Get category titles as array (for filters) from Sanity CMS
 */
export async function getCategoryTitles(): Promise<string[]> {
  const categories = await fetchCategories();
  return categories.map(cat => cat.title);
}
