import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { forwardRef, useImperativeHandle } from "react";
import { normalizeCategory } from "../utils/categoryNormalizer";
import { fetchProducts } from "../utils/sanity/productService";
import { getCategoryTitles } from "../utils/sanity/categoryService";
import type { Product } from "../utils/sanity/types";

interface CollectionPageProps {
  initialCategory?: string;
}

export const CollectionPage = forwardRef<{ setCategory: (category: string) => void }, CollectionPageProps>(
  ({ initialCategory = "All" }, ref) => {
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Expose setCategory method through ref
    useImperativeHandle(ref, () => ({
      setCategory: (category: string) => {
        setSelectedCategory(category);
      }
    }));

    // Update category when initialCategory prop changes
    useEffect(() => {
      if (initialCategory) {
        setSelectedCategory(initialCategory);
      }
    }, [initialCategory]);

    // Fetch products from Sanity CMS
    useEffect(() => {
      const loadProducts = async () => {
        if (allProducts.length > 0) {
          console.log('📦 Products already loaded, skipping fetch');
          return;
        }

        setLoading(true);
        setError(null);
        
        try {
          console.log('🚀 Loading products...');
          
          // Fetch products from Sanity CMS
          const products = await fetchProducts();
          
          if (products.length === 0) {
            setError('No products available at this time.');
            setLoading(false);
            return;
          }
          
          setAllProducts(products);
          
          // Fetch categories
          const categoryTitles = await getCategoryTitles();
          const uniqueCategories = ["All", ...categoryTitles];
          setCategories(uniqueCategories);
          
          // Expose products to window for debugging
          (window as any).__products = products;
          console.log('✅ Successfully loaded', products.length, 'products');
          console.log('📂 Available categories:', uniqueCategories);
          
          setLoading(false);
          
        } catch (error) {
          console.error('❌ Error loading products:', error);
          setError('Failed to load products. Please refresh the page.');
          setLoading(false);
        }
      };

      loadProducts();
    }, []);

    // Filter products by selected category
    // "All" shows all products, otherwise filter by normalized category match
    const filteredProducts = selectedCategory === "All" 
      ? allProducts 
      : allProducts.filter(product => {
          const normalizedProductCategory = normalizeCategory(product.category);
          const normalizedActiveCategory = normalizeCategory(selectedCategory);
          const matches = normalizedProductCategory === normalizedActiveCategory;
          
          // Debug logging for first product to show filtering logic
          if (product === allProducts[0]) {
            console.log(`🔍 Filter Debug:`, {
              activeCategory: selectedCategory,
              normalizedActiveCategory,
              productCategory: product.category,
              normalizedProductCategory,
              matches
            });
          }
          
          return matches;
        });

    const handleViewProduct = (product: Product) => {
      setSelectedProduct(product);
    };

    const closeModal = () => {
      setSelectedProduct(null);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };

    const searchResults = filteredProducts.filter(product => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase().trim();
      const searchTerms = query.split(/\s+/); // Split by whitespace
      
      // Check if all search terms match in any of the searchable fields
      return searchTerms.every(term => {
        const matchesName = product.name.toLowerCase().includes(term);
        const matchesCategory = product.category?.toLowerCase().includes(term);
        const matchesColors = product.colors?.some((color: string) => 
          color.toLowerCase().includes(term)
        );
        const matchesDescription = product.shortDescription?.toLowerCase().includes(term) || 
                                    product.longDescription?.toLowerCase().includes(term);
        
        return matchesName || matchesCategory || matchesColors || matchesDescription;
      });
    });

    return (
      <section id="collections" className="relative min-h-screen manyara-bg overflow-hidden">
        {/* Background texture and ambient lighting */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-[#F5F5DC]/2 to-transparent kenyan-pattern"></div>
          
          {/* Ambient light effects */}
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-[#800020]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#556B2F]/8 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-[#FFFFF0]/5 rounded-full blur-2xl"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
          {/* Header section */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FFFFF0] tracking-[0.05em] leading-[0.9] relative"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
                >
                  The Collection
                  <span
                    className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FFFFF0]/20 blur-sm"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
                  >
                    The Collection
                  </span>
                </h1>

                <div className="w-16 sm:w-20 md:w-24 h-px bg-gradient-to-r from-[#FFFFF0]/40 to-transparent mt-4 sm:mt-6 md:mt-8"></div>

                <p className="text-[#FFFFF0]/60 mt-4 sm:mt-5 md:mt-6 tracking-[0.1em] sm:tracking-[0.15em] font-thin uppercase text-xs sm:text-sm">
                  Curated Elegance
                </p>

                {/* Sanity status indicator */}
                {!loading && allProducts.length > 0 && (
                  <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full bg-[#556B2F] animate-pulse`}></div>
                    <span className="text-[#FFFFF0]/40 tracking-wide">
                      Product Catalog Active
                    </span>
                  </div>
                )}
              </div>

              <div className="hidden md:block w-1 h-1 bg-[#FFFFF0]/30 rounded-full animate-pulse mt-20"></div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-6 sm:mb-8 max-w-2xl mx-auto">
            <div className="relative glass-card rounded-xl sm:rounded-2xl p-1 shadow-lg">
              <Input
                type="text"
                placeholder="Search by name, category, color..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-10 sm:px-12 py-3 sm:py-4 bg-transparent border-0 text-[#FFFFF0] placeholder-[#FFFFF0]/50 focus:outline-none focus:ring-0 text-sm sm:text-base"
              />
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#FFFFF0]/60 w-4 h-4 sm:w-5 sm:h-5" />

              {/* Clear button - only show when there's text */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-[#FFFFF0]/60 hover:text-[#FFFFF0] transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search results counter */}
            {searchQuery && (
              <div className="mt-2 sm:mt-3 text-center">
                <p className="text-[#FFFFF0]/60 text-xs sm:text-sm tracking-wide">
                  {searchResults.length === 0
                    ? 'No products found'
                    : `Found ${searchResults.length} ${searchResults.length === 1 ? 'product' : 'products'}`}
                </p>
              </div>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-20">
              <div className="glass-panel rounded-2xl p-12 inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFFFF0] mx-auto mb-4"></div>
                <p className="text-[#FFFFF0]/60 text-lg tracking-wide">Loading products from Sanity CMS...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="glass-panel rounded-2xl p-12 inline-block border-2 border-[#800020]/30">
                <p className="text-[#800020] text-lg tracking-wide mb-4">⚠️ {error}</p>
                <p className="text-[#FFFFF0]/40 text-sm tracking-wide mb-4">
                  Please ensure:
                </p>
                <ul className="text-[#FFFFF0]/60 text-sm text-left max-w-md mx-auto space-y-2">
                  <li>• Products are published in your Sanity CMS (Project: ximq2iuj)</li>
                  <li>• CORS is configured for your domain in Sanity settings</li>
                  <li>• Your Sanity project is accessible and has data</li>
                </ul>
              </div>
            </div>
          )}

          {/* Product grid - even spacing and size */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {searchResults.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  imageUrl={product.imageUrl}
                  additionalImages={product.additionalImages}
                  price={product.price}
                  availableColors={product.colors}
                  onViewProduct={() => handleViewProduct(product)}
                  className="h-full"
                />
              ))}
            </div>
          )}

          {/* No results message */}
          {!loading && !error && searchResults.length === 0 && allProducts.length > 0 && (
            <div className="text-center py-20">
              <div className="glass-panel rounded-2xl p-12 inline-block">
                <p className="text-[#FFFFF0]/60 text-lg tracking-wide mb-2">
                  {searchQuery 
                    ? `No products found matching "${searchQuery}"` 
                    : `No products in ${selectedCategory}`}
                </p>
                <p className="text-[#FFFFF0]/40 text-sm tracking-wide">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          )}

          {/* Floating decorative elements */}
          <div className="absolute top-1/3 right-1/6 w-2 h-2 bg-[#FFFFF0]/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-[#800020]/30 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#556B2F]/25 rounded-full animate-pulse delay-1000"></div>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductModal 
            isOpen={true}
            onClose={closeModal}
            product={selectedProduct}
          />
        )}
      </section>
    );
  }
);

CollectionPage.displayName = 'CollectionPage';
