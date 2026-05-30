import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, Plus, Minus, CreditCard } from 'lucide-react';
import { PaymentModal } from './PaymentModal';

export function CartSidebar() {
  const { cartItems, showCart, setShowCart, setShowCheckout, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (!showCart) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={() => setShowCart(false)}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 transform transition-transform duration-300">
        {/* Glass morphism container */}
        <div className="h-full glass-panel border-l border-[#F5F5DC]/20 shadow-2xl">
          {/* Inner gradient glow */}
          <div className="absolute inset-0 manyara-gradient opacity-20"></div>
          
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F5F5DC]/20">
              <h2 
                className="text-2xl text-[#FFFFF0]/90"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Shopping Cart ({itemCount})
              </h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 rounded-full bg-[#F5F5DC]/10 hover:bg-[#F5F5DC]/20 transition-all duration-300"
              >
                <X className="w-5 h-5 text-[#FFFFF0]/70" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-[#800020]/10 flex items-center justify-center mb-4">
                    <CreditCard className="w-8 h-8 text-[#800020]/50" />
                  </div>
                  <p className="text-[#FFFFF0]/60 mb-2">Your cart is empty</p>
                  <p className="text-[#FFFFF0]/40 text-sm">Add some beautiful lingerie to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div 
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="glass-card rounded-2xl p-4"
                    >
                      <div className="flex space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F5F5DC]/5">
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 
                            className="text-[#FFFFF0]/90 font-medium truncate mb-1"
                            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                          >
                            {item.name}
                          </h3>
                          <p className="text-[#FFFFF0]/60 text-sm mb-2">
                            {item.selectedSize} • {item.selectedColor}
                          </p>
                          <p className="text-[#800020] font-medium">
                            KES {item.price.toLocaleString()}
                          </p>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                          className="p-1 rounded-full hover:bg-[#F5F5DC]/10 transition-colors self-start"
                        >
                          <X className="w-4 h-4 text-[#FFFFF0]/50" />
                        </button>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-[#F5F5DC]/10 hover:bg-[#F5F5DC]/20 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4 text-[#FFFFF0]/70" />
                          </button>
                          <span className="text-[#FFFFF0]/90 font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-[#F5F5DC]/10 hover:bg-[#F5F5DC]/20 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#FFFFF0]/70" />
                          </button>
                        </div>
                        
                        <p className="text-[#FFFFF0]/90 font-medium">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#F5F5DC]/20">
                {/* Total */}
                <div className="flex items-center justify-between mb-6">
                  <span 
                    className="text-xl text-[#FFFFF0]/90"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    Total
                  </span>
                  <span 
                    className="text-2xl text-[#FFFFF0] font-medium"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    KES {cartTotal.toLocaleString()}
                  </span>
                </div>
                
                {/* Checkout Button */}
                <div className="relative">
                  <div className="absolute inset-0 bg-[#800020]/20 rounded-full blur-sm scale-110"></div>
                  <Button 
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="relative w-full bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] text-[#FFFFF0] border-0 rounded-full py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#800020]/25 tracking-wide"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        total={cartTotal}
      />
    </>
  );
}