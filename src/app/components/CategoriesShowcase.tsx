import { useEffect, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { fetchCategoriesWithCount } from "../utils/sanity/categoryService";
import type { CategoryWithCount } from "../utils/sanity/categoryService";

interface CategoryCardProps {
  name: string;
  description: string;
  imageUrl: string;
  onClick: () => void;
}

function CategoryCard({ name, description, imageUrl, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer h-full"
    >
      {/* Floating glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5DC]/15 via-[#800020]/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl scale-105 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

      {/* Main glass card */}
      <div className="relative glass-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl hover:shadow-[#800020]/20 transition-all duration-500 hover:bg-[#F5F5DC]/15 h-full flex flex-col">
        {/* Inner gradient glow */}
        <div className="absolute inset-0 manyara-gradient rounded-2xl sm:rounded-3xl opacity-30"></div>

        {/* Category image container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Image glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/20 to-[#556B2F]/15 z-10"></div>

          <ImageWithFallback
            src={imageUrl}
            alt={name}
            className="relative w-full h-full object-cover object-center filter brightness-75 contrast-110 group-hover:brightness-90 group-hover:scale-110 transition-all duration-700"
          />

          {/* Overlay gradient for glass effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-20"></div>

          {/* Category name overlay */}
          <div className="absolute inset-0 flex items-end p-4 sm:p-5 md:p-6 z-30">
            <div className="relative">
              <h3
                className="text-xl sm:text-2xl text-[#FFFFF0] tracking-wide mb-2 group-hover:text-[#F5F5DC] transition-colors duration-300"
                style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 400 }}
              >
                {name}
                {/* Text glow */}
                <span
                  className="absolute inset-0 text-xl sm:text-2xl text-[#FFFFF0]/30 blur-sm"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 400 }}
                >
                  {name}
                </span>
              </h3>
            </div>
          </div>
        </div>

        {/* Category details */}
        <div className="relative p-4 sm:p-5 md:p-6 flex-grow flex flex-col">
          <p className="text-[#FFFFF0]/70 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-grow">
            {description}
          </p>

          {/* Shop Now indicator */}
          <div className="flex items-center text-[#800020] group-hover:text-[#FFFFF0] transition-colors duration-300">
            <span className="text-xs sm:text-sm tracking-[0.15em] uppercase font-medium">Shop Now</span>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoriesShowcaseProps {
  onCategoryClick: (category: string) => void;
}

export function CategoriesShowcase({ onCategoryClick }: CategoriesShowcaseProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategoriesWithCount();
        
        // Filter categories with at least 1 product
        const activeCategories = categoriesData.filter(cat => cat.productCount > 0);
        
        setCategories(activeCategories);
        console.log(`✅ Loaded ${activeCategories.length} active categories`);
        console.log('📸 Categories with images:', activeCategories.map(cat => ({
          title: cat.title,
          hasImages: !!cat.sampleProduct?.images?.length,
          imageCount: cat.sampleProduct?.images?.length || 0
        })));
      } catch (error) {
        console.error('❌ Error loading categories:', error);
        // Set empty array on error
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryTitle: string) => {
    console.log('Category clicked:', categoryTitle);
    
    // Scroll to collection section
    const collectionsSection = document.getElementById('collections');
    if (collectionsSection) {
      collectionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Call the parent's handler
    onCategoryClick(categoryTitle);
  };

  // Extract image URL from Sanity image object
  const extractImageUrl = (images: any[] | undefined): string | null => {
    if (!images || images.length === 0) return null;
    
    const firstImage = images[0];
    
    // Skip empty/invalid entries (only have _key)
    if (!firstImage || (firstImage._key && Object.keys(firstImage).length === 1)) {
      return null;
    }
    
    // Check if image is nested (has .image property)
    const imageObj = firstImage?.image || firstImage;
    
    // Direct URL
    if (typeof imageObj === 'string') return imageObj;
    
    // asset.url
    if (imageObj?.asset?.url) return imageObj.asset.url;
    
    // asset._ref - convert to CDN URL
    if (imageObj?.asset?._ref) {
      const ref = imageObj.asset._ref;
      // Format: image-{assetId}-{width}x{height}-{format}
      const withoutPrefix = ref.replace('image-', '');
      const parts = withoutPrefix.split('-');
      
      if (parts.length >= 2) {
        const assetId = parts[0];
        const dimensions = parts[1];
        const format = parts[2] || 'jpg';
        return `https://cdn.sanity.io/images/ximq2iuj/production/${assetId}-${dimensions}.${format}`;
      }
    }
    
    return null;
  };

  // Get category image - use real product image if available, fallback to Unsplash
  const getCategoryImage = (category: CategoryWithCount): string => {
    // Try to get real product image first
    const productImage = extractImageUrl(category.sampleProduct?.images);
    if (productImage) {
      console.log(`✅ Using real product image for ${category.title}:`, productImage);
      return productImage;
    }
    
    // Fallback to curated Unsplash images
    const categoryImages: Record<string, string> = {
      'Bras': 'https://images.unsplash.com/photo-1566206388-d427a6c2dc12?w=800&h=600&fit=crop',
      'Panties': 'https://images.unsplash.com/photo-1583900264724-a31d9e1e6bc0?w=800&h=600&fit=crop',
      'Sleepwear': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=600&fit=crop',
      'Bodyshapers': 'https://images.unsplash.com/photo-1646932520067-81bdc09af07a?w=800&h=600&fit=crop',
      'Lingerie Sets': 'https://images.unsplash.com/photo-1582552938357-32b906a5dc7e?w=800&h=600&fit=crop',
      'Bodystocking': 'https://images.unsplash.com/photo-1738789646880-4588ebf14dd5?w=800&h=600&fit=crop',
      'Swimwear': 'https://images.unsplash.com/photo-1582552938357-32b906a5dc7e?w=800&h=600&fit=crop',
      'Accessories': 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800&h=600&fit=crop',
      'default': 'https://images.unsplash.com/photo-1566206388-d427a6c2dc12?w=800&h=600&fit=crop'
    };
    
    console.log(`⚠️ Using fallback image for ${category.title}`);
    return categoryImages[category.title] || categoryImages['default'];
  };

  const getCategoryDescription = (categoryTitle: string): string => {
    const descriptions: Record<string, string> = {
      'Bras': 'Experience unparalleled comfort and support with our curated collection of luxury bras, designed for the modern woman.',
      'Panties': 'Discover elegance in every detail with our range of premium panties, combining comfort with sophisticated design.',
      'Sleepwear': 'Indulge in luxurious nightwear that makes every evening feel special. Comfort meets elegance.',
      'Bodyshapers': 'Sculpt and enhance your natural silhouette with our premium shapewear collection.',
      'Lingerie Sets': 'Complete your intimate wardrobe with our exquisitely coordinated lingerie sets.',
      'Bodystocking': 'Embrace elegance with our delicate bodystockings, perfect for special moments.',
      'Swimwear': 'Make waves in our sophisticated swimwear collection, where style meets functionality.',
      'Accessories': 'Enhance your lingerie with our carefully selected accessories and finishing touches.',
      'default': 'Explore our curated collection of premium intimate apparel.'
    };
    
    return descriptions[categoryTitle] || descriptions['default'];
  };

  if (loading) {
    return (
      <section className="relative min-h-screen manyara-bg overflow-hidden py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFFFF0] mx-auto"></div>
            <p className="text-[#FFFFF0]/60 mt-4">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen manyara-bg overflow-hidden py-12 sm:py-16 md:py-20">
      {/* Background texture and ambient lighting */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-[#F5F5DC]/2 to-transparent kenyan-pattern"></div>

        {/* Ambient light effects */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#800020]/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#556B2F]/6 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header section */}
        <div className="mb-10 sm:mb-12 md:mb-16 text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFFFF0] tracking-[0.05em] mb-4 relative inline-block"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
          >
            Explore Categories
            <span
              className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFFFF0]/20 blur-sm"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
            >
              Explore Categories
            </span>
          </h2>

          <div className="w-20 sm:w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-[#FFFFF0]/40 to-transparent mx-auto mt-4 sm:mt-5 md:mt-6 mb-3 sm:mb-4"></div>

          <p className="text-[#FFFFF0]/60 tracking-[0.1em] sm:tracking-[0.15em] font-thin uppercase text-xs sm:text-sm">
            Discover Your Perfect Style
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              name={category.title}
              description={getCategoryDescription(category.title)}
              imageUrl={getCategoryImage(category)}
              onClick={() => handleCategoryClick(category.title)}
            />
          ))}
        </div>

        {/* Decorative elements */}
        <div className="hidden md:block absolute top-1/4 right-1/6 w-2 h-2 bg-[#FFFFF0]/20 rounded-full animate-pulse"></div>
        <div className="hidden md:block absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-[#800020]/30 rounded-full animate-pulse delay-700"></div>
      </div>
    </section>
  );
}
