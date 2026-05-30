/**
 * Sanity CMS Client Configuration
 * 
 * This file configures the connection to Sanity CMS and provides
 * utility functions for fetching data and building optimized image URLs.
 */

import { createClient } from '@sanity/client';

/**
 * Sanity project configuration
 */
export const SANITY_PROJECT_ID = 'ximq2iuj';
export const SANITY_DATASET = 'production';
export const SANITY_API_VERSION = '2023-05-03'; // Stable API version

/**
 * Type definitions for Sanity image sources
 */
export type SanityImageSource = 
  | string 
  | { 
      asset: { 
        _ref: string;
        url?: string;
      } | string;
    }
  | undefined;

/**
 * Sanity client instance with public access
 * No authentication required for public data (products, categories)
 */
export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true, // Use CDN for faster response times
  perspective: 'published', // Only fetch published documents
});

/**
 * Fetch data from Sanity using GROQ queries
 * 
 * @param query - GROQ query string
 * @param params - Optional query parameters
 * @returns Promise with query results
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

/**
 * Build optimized Sanity image URL with transformation parameters
 * @param source - Sanity image source object or asset reference
 * @param options - Image transformation options
 * @returns Optimized image URL
 */
export function buildOptimizedSanityImageUrl(
  source: SanityImageSource | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  } = {}
): string {
  // Return placeholder if no source
  if (!source) {
    return 'https://images.unsplash.com/photo-1575272775908-7332223be38a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }

  // If source is already a full URL string (from mainImage.asset->url), return it directly
  if (typeof source === 'string') {
    if (source.startsWith('http://') || source.startsWith('https://')) {
      // It's already a full CDN URL, optionally add transformations
      if (options.width || options.height || options.quality) {
        const url = new URL(source);
        if (options.width) url.searchParams.set('w', options.width.toString());
        if (options.height) url.searchParams.set('h', options.height.toString());
        if (options.quality) url.searchParams.set('q', options.quality.toString());
        if (options.format) url.searchParams.set('fm', options.format);
        if (options.fit) url.searchParams.set('fit', options.fit);
        return url.toString();
      }
      return source;
    }
    
    // It's a Sanity asset reference (e.g., "image-abc123-800x600-jpg")
    // Build URL from reference
    const parts = source.split('-');
    if (parts.length >= 4 && parts[0] === 'image') {
      const assetId = parts[1];
      const dimensions = parts[2];
      const format = parts[3];
      let url = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${source}.${format}`;
      
      // Add transformations
      const params: string[] = [];
      if (options.width) params.push(`w=${options.width}`);
      if (options.height) params.push(`h=${options.height}`);
      if (options.quality) params.push(`q=${options.quality}`);
      if (options.format) params.push(`fm=${options.format}`);
      if (options.fit) params.push(`fit=${options.fit}`);
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      
      return url;
    }
  }

  // If source has asset reference (legacy format)
  if (source && typeof source === 'object' && 'asset' in source) {
    const assetRef = source.asset;
    
    // If asset is a reference object
    if (assetRef && typeof assetRef === 'object' && '_ref' in assetRef) {
      const ref = assetRef._ref;
      
      // Parse Sanity asset reference format: image-{assetId}-{width}x{height}-{format}
      const match = ref.match(/^image-([a-z0-9]+)-(\d+)x(\d+)-(\w+)$/);
      
      if (match) {
        const [, assetId, width, height, format] = match;
        
        // Build base URL
        let url = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/image-${assetId}-${width}x${height}-${format}.${format}`;
        
        // Add transformations
        const params: string[] = [];
        
        if (options.width) params.push(`w=${options.width}`);
        if (options.height) params.push(`h=${options.height}`);
        if (options.quality) params.push(`q=${options.quality}`);
        if (options.format) params.push(`fm=${options.format}`);
        if (options.fit) params.push(`fit=${options.fit}`);
        
        if (params.length > 0) {
          url += '?' + params.join('&');
        }
        
        return url;
      }
    }
    
    // If asset has a url property (already dereferenced)
    if (assetRef && typeof assetRef === 'object' && 'url' in assetRef && assetRef.url) {
      return assetRef.url as string;
    }
  }

  // Fallback to placeholder
  console.warn('Could not process Sanity image:', source);
  return 'https://images.unsplash.com/photo-1575272775908-7332223be38a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
}
