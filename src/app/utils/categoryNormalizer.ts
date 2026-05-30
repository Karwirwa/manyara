/**
 * Category Normalizer Utility
 * 
 * This utility ensures consistent category naming across:
 * - Sanity CMS data
 * - Frontend category filters
 * - Category showcase cards
 * - Product filtering
 */

// Canonical category names (the "source of truth")
export const CANONICAL_CATEGORIES = {
  BODYSHAPERS: "Bodyshapers",
  BODYSTOCKINGS: "Bodystockings",
  BRAS: "Bras",
  BRIDAL_LINGERIE: "Bridal Lingerie",
  CORSETS: "Corsets",
  LEATHER_LINGERIE: "Leather Lingerie",
  LINGERIE_SETS: "Lingerie 2-piece sets",
  NIGHTGOWNS: "Nightgowns",
  PANTIES: "Panties",
  SHAPEWEAR: "Shapewear",
  SISSY_LINGERIE: "Sissy Lingerie",
  SLEEPWEAR: "Sleepwear",
  THONGS: "Thongs",
  UNCATEGORIZED: "Uncategorized"
} as const;

// Mapping of variations to canonical names
const CATEGORY_ALIASES: Record<string, string> = {
  // Bodyshapers variations
  "Bodyshapers": CANONICAL_CATEGORIES.BODYSHAPERS,
  "Body Shapers": CANONICAL_CATEGORIES.BODYSHAPERS,
  "Bodyshaper": CANONICAL_CATEGORIES.BODYSHAPERS,
  "Body Shaper": CANONICAL_CATEGORIES.BODYSHAPERS,
  
  // Bodystockings variations
  "Bodystockings": CANONICAL_CATEGORIES.BODYSTOCKINGS,
  "Bodystocking": CANONICAL_CATEGORIES.BODYSTOCKINGS,
  "Body Stockings": CANONICAL_CATEGORIES.BODYSTOCKINGS,
  "Body Stocking": CANONICAL_CATEGORIES.BODYSTOCKINGS,
  
  // Bras variations
  "Bras": CANONICAL_CATEGORIES.BRAS,
  "Bra": CANONICAL_CATEGORIES.BRAS,
  
  // Bridal variations
  "Bridal Lingerie": CANONICAL_CATEGORIES.BRIDAL_LINGERIE,
  "Bridal": CANONICAL_CATEGORIES.BRIDAL_LINGERIE,
  "Bridal lingerie": CANONICAL_CATEGORIES.BRIDAL_LINGERIE,
  
  // Corsets variations
  "Corsets": CANONICAL_CATEGORIES.CORSETS,
  "Corset": CANONICAL_CATEGORIES.CORSETS,
  
  // Leather variations
  "Leather Lingerie": CANONICAL_CATEGORIES.LEATHER_LINGERIE,
  "Leather lingerie": CANONICAL_CATEGORIES.LEATHER_LINGERIE,
  "Leather": CANONICAL_CATEGORIES.LEATHER_LINGERIE,
  
  // Lingerie sets variations
  "Lingerie 2-piece sets": CANONICAL_CATEGORIES.LINGERIE_SETS,
  "Lingerie 2 piece sets": CANONICAL_CATEGORIES.LINGERIE_SETS,
  "Lingerie 2-Piece Sets": CANONICAL_CATEGORIES.LINGERIE_SETS,
  "Lingerie 2 Piece Set": CANONICAL_CATEGORIES.LINGERIE_SETS,
  "Lingerie Sets": CANONICAL_CATEGORIES.LINGERIE_SETS,
  "2-piece sets": CANONICAL_CATEGORIES.LINGERIE_SETS,
  "2 piece sets": CANONICAL_CATEGORIES.LINGERIE_SETS,
  
  // Nightgowns variations
  "Nightgowns": CANONICAL_CATEGORIES.NIGHTGOWNS,
  "Nightgown": CANONICAL_CATEGORIES.NIGHTGOWNS,
  "Night Gowns": CANONICAL_CATEGORIES.NIGHTGOWNS,
  "Night Gown": CANONICAL_CATEGORIES.NIGHTGOWNS,
  
  // Panties variations
  "Panties": CANONICAL_CATEGORIES.PANTIES,
  "Panty": CANONICAL_CATEGORIES.PANTIES,
  
  // Shapewear variations
  "Shapewear": CANONICAL_CATEGORIES.SHAPEWEAR,
  "Shape Wear": CANONICAL_CATEGORIES.SHAPEWEAR,
  "Shape wear": CANONICAL_CATEGORIES.SHAPEWEAR,
  
  // Sissy variations
  "Sissy Lingerie": CANONICAL_CATEGORIES.SISSY_LINGERIE,
  "Sissy lingerie": CANONICAL_CATEGORIES.SISSY_LINGERIE,
  "Sissy": CANONICAL_CATEGORIES.SISSY_LINGERIE,
  
  // Sleepwear variations
  "Sleepwear": CANONICAL_CATEGORIES.SLEEPWEAR,
  "Sleepwear Set": CANONICAL_CATEGORIES.SLEEPWEAR,
  "Sleepwear set": CANONICAL_CATEGORIES.SLEEPWEAR,
  
  // Thongs variations
  "Thongs": CANONICAL_CATEGORIES.THONGS,
  "Thong": CANONICAL_CATEGORIES.THONGS,
  
  // Uncategorized
  "Uncategorized": CANONICAL_CATEGORIES.UNCATEGORIZED,
  "": CANONICAL_CATEGORIES.UNCATEGORIZED,
  "undefined": CANONICAL_CATEGORIES.UNCATEGORIZED,
  "null": CANONICAL_CATEGORIES.UNCATEGORIZED,
};

/**
 * Normalizes a category name to its canonical form
 * @param category - The category name to normalize
 * @returns The canonical category name
 */
export function normalizeCategory(category: string | null | undefined): string {
  if (!category || category.trim() === '') {
    return CANONICAL_CATEGORIES.UNCATEGORIZED;
  }
  
  const trimmed = category.trim();
  
  // Special case: "All" is a UI filter, not a product category
  if (trimmed === "All") {
    return "All";
  }
  
  // Try exact match first
  if (CATEGORY_ALIASES[trimmed]) {
    return CATEGORY_ALIASES[trimmed];
  }
  
  // Try case-insensitive match
  const lowerCategory = trimmed.toLowerCase();
  for (const [alias, canonical] of Object.entries(CATEGORY_ALIASES)) {
    if (alias.toLowerCase() === lowerCategory) {
      return canonical;
    }
  }
  
  // If no match found, return original (trimmed)
  console.warn(`⚠️ Unknown category: "${trimmed}" - keeping as-is. Consider adding to CATEGORY_ALIASES.`);
  return trimmed;
}

/**
 * Checks if two category names match (after normalization)
 * @param category1 - First category name
 * @param category2 - Second category name
 * @returns True if categories match after normalization
 */
export function categoriesMatch(category1: string | null | undefined, category2: string | null | undefined): boolean {
  return normalizeCategory(category1) === normalizeCategory(category2);
}

/**
 * Gets all canonical category names
 * @returns Array of canonical category names
 */
export function getAllCanonicalCategories(): string[] {
  return Object.values(CANONICAL_CATEGORIES);
}

/**
 * Normalizes products array to use canonical category names
 * @param products - Array of products with category field
 * @returns Array of products with normalized category names
 */
export function normalizeProducts<T extends { category: string }>(products: T[]): T[] {
  return products.map(product => ({
    ...product,
    category: normalizeCategory(product.category)
  }));
}