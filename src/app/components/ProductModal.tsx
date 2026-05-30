import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, ShoppingBag, CheckCircle, Heart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import type { Product } from "../utils/sanity/types";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(() => {
    // Check if product is already liked in localStorage
    const likedProducts = JSON.parse(localStorage.getItem('manyara_liked') || '[]');
    return likedProducts.includes(product.id);
  });
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== Add to Cart Debug ===');
    console.log('Product ID:', product.id);
    console.log('Selected size:', selectedSize);
    console.log('Selected color:', selectedColor);
    
    if (!selectedSize || !selectedColor) {
      toast.error('Please select both size and color before adding to cart.');
      return;
    }
    
    try {
      const cartItem = {
        productId: parseInt(product.id) || 0,
        productName: product.name,
        unitPrice: product.priceFormatted || `KSh ${product.price}`,
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
        imageUrl: product.imageUrl
      };
      
      console.log('Adding cart item:', cartItem);
      addToCart(cartItem);
      
      console.log('✓ Cart item added successfully');
      toast.success(`${product.name} added to cart!`);
      
      // Reset selections and close
      setSelectedSize('');
      setSelectedColor('');
      onClose();
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  const handleToggleLike = () => {
    const likedProducts = JSON.parse(localStorage.getItem('manyara_liked') || '[]');
    
    if (isLiked) {
      // Remove from liked
      const updated = likedProducts.filter((id: number) => id !== product.id);
      localStorage.setItem('manyara_liked', JSON.stringify(updated));
      setIsLiked(false);
      toast.success('Removed from favorites');
    } else {
      // Add to liked
      likedProducts.push(product.id);
      localStorage.setItem('manyara_liked', JSON.stringify(likedProducts));
      setIsLiked(true);
      toast.success('Added to favorites');
    }
  };

  const defaultSizes = ["XS", "S", "M", "L", "XL"];
  const defaultColors = ["Burgundy Wine", "Ivory Pearl", "Champagne Gold", "Olive Sage"];
  
  const sizes = product.sizes || defaultSizes;
  const colors = product.colors || defaultColors;
  
  // Combine main image with additional images
  const allImages = [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean);
  const currentImage = allImages[selectedImageIndex] || product.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5DC]/10 via-[#F5F5DC]/5 to-transparent rounded-3xl blur-xl scale-105"></div>
        
        {/* Main modal content */}
        <div className="relative glass-card rounded-3xl p-8 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-[#F5F5DC]/10 hover:bg-[#F5F5DC]/20 transition-all duration-300 group"
          >
            <X className="w-5 h-5 text-[#FFFFF0]/70 group-hover:text-[#FFFFF0]" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="relative space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                {/* Image glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/10 to-[#556B2F]/10 rounded-2xl"></div>
                
                {currentImage ? (
                  <ImageWithFallback
                    src={currentImage}
                    alt={product.name}
                    className="relative w-full h-full object-cover rounded-2xl filter brightness-90 contrast-110"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#800020]/20 to-[#556B2F]/20 rounded-2xl">
                    <div className="text-[#FFFFF0]/50 text-center">
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-lg">[Product Image]</p>
                    </div>
                  </div>
                )}
                
                {/* Overlay gradient for glass effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/10 rounded-2xl"></div>
              </div>

              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImageIndex === index 
                          ? 'border-[#800020]/60' 
                          : 'border-[#FFFFF0]/20 hover:border-[#FFFFF0]/40'
                      }`}
                    >
                      {img ? (
                        <ImageWithFallback
                          src={img}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#800020]/20 to-[#556B2F]/20 flex items-center justify-center">
                          <span className="text-[#FFFFF0]/50 text-xs">📸</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <h2 
                  className="text-4xl text-white/90 tracking-wide mb-4" 
                  style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
                >
                  {product.name}
                </h2>
                
                <p className="text-white/60 tracking-[0.1em] font-thin text-xl mb-6">
                  {product.price}
                </p>

                {/* Short Description */}
                <div className="mb-4">
                  <p className="text-white/70 leading-relaxed">
                    {product.shortDescription || "[Short product description goes here]"}
                  </p>
                </div>

                {/* Long Description */}
                <div className="space-y-3">
                  <h4 className="text-white/80 tracking-wide" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                    Product Details
                  </h4>
                  <p className="text-white/60 leading-relaxed text-sm">
                    {product.longDescription || "[Detailed product description with features, materials, and care instructions goes here]"}
                  </p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-4">
                <h3 className="text-white/80 tracking-wide" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Size<span className="text-[#800020] ml-1">*</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                        selectedSize === size
                          ? 'bg-pink-500/20 border-pink-500/50 text-white'
                          : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-4">
                <h3 className="text-white/80 tracking-wide" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Color<span className="text-[#800020] ml-1">*</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <Badge
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-2 transition-all duration-300 ${
                        selectedColor === color
                          ? 'bg-pink-500/20 border-pink-500/50 text-white'
                          : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <div className="relative flex-1">
                  {/* Button glow */}
                  <div className="absolute inset-0 bg-[#800020]/20 rounded-full blur-sm"></div>
                  
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!selectedSize || !selectedColor}
                    className="relative w-full bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] text-[#FFFFF0] border-0 rounded-full py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#800020]/25 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
                
                <Button 
                  variant="outline"
                  className="px-6 bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0]/80 hover:bg-[#F5F5DC]/10 hover:border-[#F5F5DC]/30 hover:text-[#FFFFF0] rounded-full"
                  onClick={handleToggleLike}
                >
                  {isLiked ? <Heart className="w-4 h-4 fill-red-500" /> : <Heart className="w-4 h-4" />}
                </Button>
              </div>

              {/* Product Features */}
              <div className="pt-6 border-t border-white/10">
                <div className="space-y-3 text-sm text-white/60">
                  <div className="flex justify-between">
                    <span>Crafted in Kenya</span>
                    <span>✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sustainable Materials</span>
                    <span>✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Free Shipping</span>
                    <span>✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30-Day Returns</span>
                    <span>✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
