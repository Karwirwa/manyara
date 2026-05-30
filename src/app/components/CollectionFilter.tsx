import { Button } from "./ui/button";

interface CollectionFilterProps {
  categories: string[]; // Dynamically extracted from Sanity CMS products (always includes "All" as first item)
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * CollectionFilter Component
 * 
 * Displays category filter buttons that are dynamically populated from Sanity CMS.
 * Categories are extracted from product data via the `category->title` reference in Sanity.
 * The "All" category is always present as the default option.
 * 
 * @param categories - Array of category names from CMS (e.g., ["All", "Corsets", "Bodyshapers", ...])
 * @param activeCategory - Currently selected category
 * @param onCategoryChange - Callback when category is changed
 */
export function CollectionFilter({ categories, activeCategory, onCategoryChange }: CollectionFilterProps) {
  return (
    <div className="relative mb-16">
      {/* Filter container with glass morphism */}
      <div className="relative glass-panel rounded-2xl p-6 shadow-xl">
        {/* Inner gradient glow */}
        <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-20"></div>
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Filter label */}
          <div className="flex items-center space-x-4">
            <h3 
              className="text-[#FFFFF0]/80 tracking-wide text-lg"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Collections
            </h3>
            <div className="w-12 h-px bg-gradient-to-r from-[#FFFFF0]/30 to-transparent"></div>
          </div>

          {/* Category buttons */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => onCategoryChange(category)}
                variant="ghost"
                className={`relative px-8 py-3 rounded-full transition-all duration-500 flex-1 min-w-[120px] max-w-[160px] ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-[#800020]/20 to-[#800020]/30 text-[#FFFFF0] border border-[#800020]/30'
                    : 'bg-[#F5F5DC]/5 text-[#FFFFF0]/70 border border-[#F5F5DC]/10 hover:bg-[#F5F5DC]/10 hover:text-[#FFFFF0]'
                }`}
              >
                {/* Active category glow */}
                {activeCategory === category && (
                  <div className="absolute inset-0 bg-[#800020]/10 rounded-full blur-sm"></div>
                )}
                
                <span className="relative tracking-wide text-center">{category}</span>
              </Button>
            ))}
          </div>

          {/* Sort dropdown placeholder */}
          <div className="flex items-center space-x-2 text-[#FFFFF0]/60 text-sm">
            <span className="tracking-wide">Sort by:</span>
            <Button
              variant="ghost"
              className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] border border-[#F5F5DC]/10 hover:bg-[#F5F5DC]/5 rounded-lg px-3 py-1"
            >
              Featured ↓
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#800020]/20 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#556B2F]/25 rounded-full animate-pulse delay-500"></div>
    </div>
  );
}