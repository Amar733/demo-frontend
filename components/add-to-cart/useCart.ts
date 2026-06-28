'use client';

import { useState, useEffect } from 'react';
import { Cart, CartItem } from '@/types';
import { getCartFromStorage } from './addToCart';

/**
 * Custom hook to manage cart state and listen to cart updates
 */
export function useCart() {
  const [cart, setCart] = useState<Cart>(() => getCartFromStorage());
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Initialize cart from storage
    const currentCart = getCartFromStorage();
    setCart(currentCart);
    setItemCount(currentCart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0));

    // Listen for cart updates from other components
    const handleCartUpdate = (event: CustomEvent) => {
      setCart(event.detail);
      setItemCount(event.detail.items.reduce((total: number, item: CartItem) => total + item.quantity, 0));
    };

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, []);

  return {
    cart,
    itemCount,
    total: cart.total
  };
}
