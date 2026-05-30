import { fetchFromSanity } from './client';
import { SanityProductWithCategory, Product } from './types';

/**
 * GROQ Query to fetch all products with category details
 * Note: We only fetch raw images since dereferencing returns nulls
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

/**
 * Normalize Sanity product to app Product format
 */
function normalizeProduct(sanityProduct: SanityProductWithCategory): Product {
  const rawImages = (sanityProduct as any).images || [];
  
  console.log('🔬 DEBUG - Raw images structure:', {
    productName: sanityProduct.name,
    rawImagesCount: rawImages.length,
    firstRawImage: rawImages[0],
  });
  
  // Extract URLs from raw image objects
  // Sanity image structure: { _key: "...", image: { asset: { _ref: "..." } }, view: "..." }
  const finalImages: string[] = rawImages.map((img: any) => {
    // Skip empty/invalid entries (only have _key)
    if (!img || (img._key && Object.keys(img).length === 1)) {
      return '';
    }
    
    // Check if image is nested (has .image property)
    const imageObj = img?.image || img;
    
    // Direct URL
    if (typeof imageObj === 'string') return imageObj;
    
    // asset.url
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
        
        const url = `https://cdn.sanity.io/images/ximq2iuj/production/${assetId}-${dimensions}.${format}`;
        console.log('🎨 Generated URL:', url);
        return url;
      }
    }
    
    return '';
  }).filter(Boolean);
  
  console.log('✅ Extracted image URLs:', finalImages);
  
  const mainImageUrl = finalImages[0] || '';
  const additionalImageUrls = finalImages.slice(1) || [];
  
  // Add image transformations via URL parameters
  const optimizeImageUrl = (url: string): string => {
    if (!url) return '';
    if (!url.startsWith('http')) return url;
    
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', '800');
      urlObj.searchParams.set('q', '85');
      urlObj.searchParams.set('auto', 'format');
      return urlObj.toString();
    } catch {
      return url;
    }
  };
  
  // Get color - it's singular "color" not "colors"
  const color = (sanityProduct as any).color || 'Standard';
  const colors = Array.isArray(color) ? color : [color];
  
  // Get sizes
  const sizes = sanityProduct.sizes || ['One Size'];
  
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

/**
 * Fetch all products from Sanity CMS
 */
export async function fetchProducts(): Promise<Product[]> {
  console.log('📦 Fetching products from Sanity CMS...');
  console.log('🔍 Using GROQ Query:', PRODUCTS_QUERY);
  
  // DIAGNOSTIC: First fetch raw product data to see actual structure
  const rawQuery = `*[_type == "product"][0]`;
  const rawProduct = await fetchFromSanity<any>(rawQuery);
  console.log('🔬 RAW PRODUCT STRUCTURE (First Product):', rawProduct);
  console.log('🔬 Available fields:', Object.keys(rawProduct || {}));
  
  const sanityProducts = await fetchFromSanity<SanityProductWithCategory[]>(PRODUCTS_QUERY);
  
  console.log('📊 Raw Sanity response:', {
    count: sanityProducts?.length || 0,
    firstProduct: sanityProducts?.[0] || null
  });
  
  // Log the raw image data for first product to debug
  if (sanityProducts && sanityProducts.length > 0) {
    const firstProduct = sanityProducts[0];
    console.log('🖼️ First Product Image Data:', {
      name: firstProduct.name,
      mainImage: firstProduct.mainImage,
      mainImageType: typeof firstProduct.mainImage,
      mainImageRef: (firstProduct as any).mainImageRef,
      hasAdditionalImages: Boolean((firstProduct as any).additionalImages),
      additionalImagesCount: (firstProduct as any).additionalImages?.length || 0
    });
  }
  
  if (!sanityProducts || !Array.isArray(sanityProducts) || sanityProducts.length === 0) {
    console.warn('⚠️ No products found in Sanity CMS');
    return [];
  }
  
  const transformedProducts = sanityProducts.map(normalizeProduct);
  console.log(`✅ Loaded ${transformedProducts.length} products from Sanity CMS`);
  console.log('📦 Sample normalized product:', transformedProducts[0]);
  
  return transformedProducts;
}

/**
 * Fetch products by category
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

  const sanityProducts = await fetchFromSanity<SanityProductWithCategory[]>(query, { categorySlug });
  
  if (!sanityProducts || !Array.isArray(sanityProducts)) {
    return [];
  }
  
  return sanityProducts.map(normalizeProduct);
}

/**
 * Fetch a single product by slug
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

/**
 * Fetch featured products
 */
export async function fetchFeaturedProducts(): Promise<Product[]> {
  const query = `
    *[_type == "product" && featured == true] | order(_createdAt desc) {
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
  
  const sanityProducts = await fetchFromSanity<SanityProductWithCategory[]>(query);
  
  if (!sanityProducts || !Array.isArray(sanityProducts)) {
    return [];
  }
  
  return sanityProducts.map(normalizeProduct);
}

/**
 * Wrapper function for backward compatibility
 */
export async function loadSanityProducts(): Promise<Product[]> {
  return fetchProducts();
}
