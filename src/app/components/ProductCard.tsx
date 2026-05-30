import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { useState } from "react";

interface ProductCardProps {
  name: string;
  imageUrl: string;
  additionalImages?: string[];
  price?: string | number;
  className?: string;
  onViewProduct?: () => void;
  availableColors?: string[];
}

export function ProductCard({ name, imageUrl, additionalImages, price, className, onViewProduct, availableColors }: ProductCardProps) {
  const defaultColors = ["Burgundy Wine", "Ivory Pearl", "Champagne Gold"];
  const colors = availableColors || defaultColors;
  const [isHovered, setIsHovered] = useState(false);
  
  // Use the first additional image for hover effect, or fall back to main image
  const hoverImageUrl = additionalImages && additionalImages.length > 0 
    ? additionalImages[0] 
    : imageUrl;
  
  // Format price if it's a number
  const formattedPrice = typeof price === 'number' 
    ? `KSh ${price.toLocaleString()}` 
    : price;
  
  return (
    <div className={`relative group h-full ${className}`}>
      {/* Floating glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5DC]/10 via-[#F5F5DC]/5 to-transparent rounded-3xl blur-xl scale-105 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      
      {/* Main glass card */}
      <div className="relative glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-2xl hover:shadow-[#800020]/10 transition-all duration-500 hover:bg-[#F5F5DC]/12 h-full flex flex-col">
        {/* Inner gradient glow */}
        <div className="absolute inset-0 manyara-gradient rounded-2xl sm:rounded-3xl opacity-30"></div>

        {/* Product image container - consistent aspect ratio */}
        <div
          className="relative mb-3 sm:mb-4 aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/10 to-[#556B2F]/10 rounded-xl sm:rounded-2xl"></div>

          {/* Premium Imported Badge */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 px-2 sm:px-3 py-1 sm:py-1.5 glass-panel rounded-full border border-[#F5F5DC]/30">
            <span className="text-[#F5F5DC] text-[10px] sm:text-xs font-light tracking-wide">✨ Imported</span>
          </div>
          
          {imageUrl ? (
            <>
              {/* Main Image */}
              <ImageWithFallback
                src={imageUrl}
                alt={`${name} - front view`}
                className={`absolute inset-0 w-full h-full object-cover object-center rounded-2xl filter brightness-90 contrast-110 transition-all duration-700 ease-in-out ${
                  isHovered && additionalImages && additionalImages.length > 0
                    ? 'opacity-0 scale-105'
                    : 'opacity-100 scale-100 group-hover:brightness-100'
                }`}
              />
              
              {/* Hover Image - only render if additional images exist */}
              {additionalImages && additionalImages.length > 0 && (
                <ImageWithFallback
                  src={hoverImageUrl}
                  alt={`${name} - alternate view`}
                  className={`absolute inset-0 w-full h-full object-cover object-center rounded-2xl filter brightness-95 contrast-110 transition-all duration-700 ease-in-out ${
                    isHovered
                      ? 'opacity-100 scale-105 brightness-100'
                      : 'opacity-0 scale-100'
                  }`}
                />
              )}
            </>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#800020]/20 to-[#556B2F]/20 rounded-2xl">
              <div className="text-[#FFFFF0]/50 text-center">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-xs">[Product Image]</p>
              </div>
            </div>
          )}
          
          {/* Overlay gradient for glass effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5DC]/20 via-transparent to-[#F5F5DC]/10 rounded-2xl pointer-events-none"></div>
          
          {/* Image count indicator - shown when additional images exist */}
          {additionalImages && additionalImages.length > 0 && (
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-[#800020]/80 backdrop-blur-sm rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[#FFFFF0] text-[10px] sm:text-xs tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              +{additionalImages.length} {additionalImages.length === 1 ? 'image' : 'images'}
            </div>
          )}
        </div>

        {/* Product details - flex-grow to fill remaining space */}
        <div className="relative space-y-2 sm:space-y-3 flex-grow flex flex-col">
          <h3 className="text-[#FFFFF0]/90 tracking-wide font-light text-sm sm:text-base min-h-[2rem] sm:min-h-[2.5rem] flex items-center" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            {name}
          </h3>

          {formattedPrice && (
            <p className="text-[#FFFFF0]/60 tracking-[0.1em] font-thin text-xs sm:text-sm">
              {formattedPrice}
            </p>
          )}

          {/* Available Colors Preview */}
          <div className="flex items-center space-x-2 py-1 sm:py-2">
            <span className="text-[#FFFFF0]/50 text-[10px] sm:text-xs tracking-wide">Colors:</span>
            <div className="flex space-x-1 flex-wrap">
              {colors.slice(0, 3).map((color) => (
                <div
                  key={color}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-[#F5F5DC]/20 ${getColorClass(color)}`}
                  title={color}
                />
              ))}
              {colors.length > 3 && (
                <span className="text-[#FFFFF0]/40 text-[10px] sm:text-xs ml-1">+{colors.length - 3}</span>
              )}
            </div>
          </div>

          {/* View Product button - pushed to bottom */}
          <div className="relative pt-3 sm:pt-4 mt-auto">
            <div className="absolute inset-0 bg-[#800020]/20 rounded-full blur-sm scale-110"></div>

            <Button
              size="sm"
              onClick={onViewProduct}
              className="relative w-full bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] text-[#FFFFF0] border-0 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#800020]/25 text-xs sm:text-sm font-medium tracking-wide"
            >
              View Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  function getColorClass(color: string): string {
    const lowerColor = color.toLowerCase();
    if (lowerColor.includes('red') || lowerColor.includes('crimson') || lowerColor.includes('cherry') || lowerColor.includes('wine') || lowerColor.includes('burgundy')) return 'bg-red-500';
    if (lowerColor.includes('pink') || lowerColor.includes('rose') || lowerColor.includes('blush') || lowerColor.includes('coral')) return 'bg-pink-400';
    if (lowerColor.includes('purple') || lowerColor.includes('violet') || lowerColor.includes('plum') || lowerColor.includes('magenta') || lowerColor.includes('fuchsia')) return 'bg-purple-500';
    if (lowerColor.includes('blue') || lowerColor.includes('sapphire') || lowerColor.includes('navy') || lowerColor.includes('teal')) return 'bg-blue-500';
    if (lowerColor.includes('green') || lowerColor.includes('emerald') || lowerColor.includes('mint') || lowerColor.includes('sage') || lowerColor.includes('olive')) return 'bg-green-500';
    if (lowerColor.includes('yellow') || lowerColor.includes('gold') || lowerColor.includes('amber') || lowerColor.includes('honey')) return 'bg-yellow-500';
    if (lowerColor.includes('orange') || lowerColor.includes('peach') || lowerColor.includes('sunset')) return 'bg-orange-500';
    if (lowerColor.includes('black') || lowerColor.includes('charcoal') || lowerColor.includes('midnight')) return 'bg-gray-900';
    if (lowerColor.includes('white') || lowerColor.includes('ivory') || lowerColor.includes('cream') || lowerColor.includes('pearl')) return 'bg-gray-100';
    return 'bg-[#800020]'; // default burgundy
  }
}
