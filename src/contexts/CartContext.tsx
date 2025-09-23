import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define CartItem interface locally since we're not using database
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'individual' | 'combo';
  description?: string;
  timeline?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
  syncWithLocalStorage: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem('setu-cart') || '[]');
    setCartItems(localCart);
  }, []);

  const addToCart = async (item: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const localCart = JSON.parse(localStorage.getItem('setu-cart') || '[]');
      const existingItem = localCart.find((i: any) => i.name === item.name && i.type === item.type);
      
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        localCart.push({ 
          ...item, 
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      localStorage.setItem('setu-cart', JSON.stringify(localCart));
      setCartItems(localCart);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      setLoading(true);
      const localCart = JSON.parse(localStorage.getItem('setu-cart') || '[]');
      const updatedCart = localCart.map((item: any) => 
        item.id === itemId ? { ...item, quantity, updated_at: new Date().toISOString() } : item
      );
      localStorage.setItem('setu-cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      const localCart = JSON.parse(localStorage.getItem('setu-cart') || '[]');
      const updatedCart = localCart.filter((item: any) => item.id !== itemId);
      localStorage.setItem('setu-cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('setu-cart');
      setCartItems([]);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const syncWithLocalStorage = () => {
    const localCart = JSON.parse(localStorage.getItem('setu-cart') || '[]');
    setCartItems(localCart);
  };

  const value: CartContextType = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount,
    syncWithLocalStorage
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
