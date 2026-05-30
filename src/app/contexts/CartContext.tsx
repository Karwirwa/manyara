import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string; // unique cart item ID
  productId: number;
  productName: string;
  size: string;
  color: string;
  unitPrice: string;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on init
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('manyara_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('manyara_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    console.log('CartContext: addToCart called with:', item);
    
    // Check if item with same product, size, and color exists
    const existingItemIndex = cartItems.findIndex(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.size === item.size &&
        cartItem.color === item.color
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      console.log('CartContext: Updated existing item quantity:', updatedItems[existingItemIndex]);
      setCartItems(updatedItems);
    } else {
      // Add new item with unique ID
      const newItem: CartItem = {
        ...item,
        id: `${item.productId}-${item.size}-${item.color}-${Date.now()}`,
      };
      console.log('CartContext: Adding new item:', newItem);
      setCartItems([...cartItems, newItem]);
    }
    
    console.log('CartContext: Cart items after update:', cartItems);
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.unitPrice.replace(/[^0-9.]/g, ''));
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}