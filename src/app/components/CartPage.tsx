import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const DELIVERY_FEE = 300; // KSh 300 flat rate

export function CartPage({ onCheckout }: { onCheckout: () => void }) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const total = subtotal + DELIVERY_FEE;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0A0A] to-[#0A0A0A] pt-24 sm:pt-28 md:pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12">
            <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-[#FFFFF0]/20 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-3xl text-[#FFFFF0] mb-3 sm:mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Your Cart is Empty
            </h2>
            <p className="text-sm sm:text-base text-[#FFFFF0]/60 mb-6 sm:mb-8">
              Discover our exquisite collection of luxury lingerie
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0A0A] to-[#0A0A0A] pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFFFF0] mb-3 sm:mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Shopping Cart
          </h1>
          <p className="text-sm sm:text-base text-[#FFFFF0]/60">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:bg-[#F5F5DC]/12 transition-all">
                <div className="flex gap-3 sm:gap-4 md:gap-6">
                  {/* Product Image */}
                  <div className="w-20 h-24 sm:w-24 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg text-[#FFFFF0] mb-2 truncate">
                      {item.productName}
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <span className="px-2 sm:px-3 py-1 bg-[#800020]/20 text-[#F5F5DC] text-xs sm:text-sm rounded-full">
                        Size: {item.size}
                      </span>
                      <span className="px-2 sm:px-3 py-1 bg-[#556B2F]/20 text-[#F5F5DC] text-xs sm:text-sm rounded-full">
                        Color: {item.color}
                      </span>
                    </div>
                    <p className="text-lg sm:text-xl text-[#F5F5DC]">
                      {item.unitPrice}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                      <div className="flex items-center gap-1 sm:gap-2 bg-[#FFFFF0]/5 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 sm:p-2 hover:bg-[#FFFFF0]/10 rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFFFF0]" />
                        </button>
                        <span className="text-[#FFFFF0] min-w-[1.75rem] sm:min-w-[2rem] text-center text-sm sm:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 sm:p-2 hover:bg-[#FFFFF0]/10 rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFFFF0]" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 sm:p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFFFF0]/40 group-hover:text-red-400 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-xl sm:text-2xl text-[#FFFFF0] mb-4 sm:mb-6" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base text-[#FFFFF0]/80">
                  <span>Subtotal</span>
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-[#FFFFF0]/80">
                  <span>Delivery Fee</span>
                  <span>KSh {DELIVERY_FEE.toLocaleString()}</span>
                </div>
                <div className="h-px bg-[#FFFFF0]/10"></div>
                <div className="flex justify-between text-lg sm:text-xl text-[#FFFFF0]">
                  <span>Total</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#800020] to-[#556B2F] text-[#FFFFF0] rounded-xl hover:shadow-lg hover:shadow-[#800020]/20 transition-all flex items-center justify-center gap-2 sm:gap-3 group text-sm sm:text-base"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Trust Badges */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#FFFFF0]/10 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#FFFFF0]/60">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F5F5DC] rounded-full"></div>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#FFFFF0]/60">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F5F5DC] rounded-full"></div>
                  <span>Discreet Packaging</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#FFFFF0]/60">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F5F5DC] rounded-full"></div>
                  <span>M-Pesa, Cards & Multiple Payment Options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
