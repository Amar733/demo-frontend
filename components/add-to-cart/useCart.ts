'use client';

import { useState, useEffect } from 'react';
import { Cart, CartItem } from '@/types';
import { getCart } from './addToCart';

/**
 * Custom hook to manage cart state and listen to cart updates
 */
export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch cart from backend on mount
    const loadCart = async () => {
      try {
        const fetchedCart = await getCart();
        setCart(fetchedCart);
        setItemCount(fetchedCart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0));
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();

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
    total: cart.total,
    isLoading
  };
}
