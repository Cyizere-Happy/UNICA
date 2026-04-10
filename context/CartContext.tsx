'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FoodItem } from '@/lib/gatepass/types';

interface CartItem extends FoodItem {
  cartQuantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  updateCart: (item: FoodItem, change: number) => void;
  removeFromCart: (itemId: string) => void;
  toggleCart: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('unica-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('unica-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateCart = (item: FoodItem, change: number) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      
      if (existing) {
        return prev.map(i => {
          if (i.id === item.id) {
            const newQty = Math.max(0, i.cartQuantity + change);
            return { ...i, cartQuantity: newQty };
          }
          return i;
        }).filter(i => i.cartQuantity > 0);
      }
      
      if (change > 0) {
        return [...prev, { ...item, cartQuantity: change }];
      }
      
      return prev;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const clearCart = () => setCartItems([]);

  const getSubtotal = () => cartItems.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      updateCart,
      removeFromCart,
      toggleCart,
      clearCart,
      getSubtotal
    }}>
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
