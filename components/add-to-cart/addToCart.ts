import { Product, CartItem } from '@/types';
import { addToCart as addToCartUtil, getEmptyCart } from '@/lib/cart';

const CART_STORAGE_KEY = 'ecommerce_cart';

/**
 * Get cart from localStorage
 */
export function getCartFromStorage() {
  if (typeof window === 'undefined') return getEmptyCart();
  
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      return JSON.parse(storedCart);
    }
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
  }
  
  return getEmptyCart();
}

/**
 * Save cart to localStorage
 */
export function saveCartToStorage(cart: any) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

/**
 * Add product to cart and save to localStorage
 */
export function addProductToCart(product: Product, quantity: number = 1) {
  const currentCart = getCartFromStorage();
  const updatedCart = addToCartUtil(currentCart, product, quantity);
  saveCartToStorage(updatedCart);
  return updatedCart;
}

/**
 * Get cart item count
 */
export function getCartItemCount() {
  const cart = getCartFromStorage();
  return cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
}

/**
 * Clear entire cart
 */
export function clearCart() {
  saveCartToStorage(getEmptyCart());
}
