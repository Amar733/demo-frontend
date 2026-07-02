import { Product, CartItem } from '@/types';
import { api } from '@/lib/api';

/**
 * Transform backend cart to frontend format
 */
function transformBackendCart(backendCart: any) {
  if (!backendCart || !backendCart.items) {
    return { items: [], total: 0 };
  }

  const items = backendCart.items.map((item: any) => ({
    product: {
      id: item.product._id || item.product.id,
      name: item.product.name,
      description: item.product.description || '',
      price: item.product.price,
      specialPrice: item.product.specialPrice,
      image: item.product.image,
      category: item.product.category || '',
      stock: item.product.stock,
      collection: item.product.collection,
      isNewArrival: item.product.isNewArrival,
      gender: item.product.gender,
      productType: item.product.productType,
    },
    quantity: item.quantity,
  }));

  const total = items.reduce((sum: number, item: CartItem) => {
    const price = item.product.specialPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  return { items, total };
}

/**
 * Get cart from backend API
 */
export async function getCart() {
  try {
    const response = await api.getCart();
    if (response.success && response.data) {
      const cart = transformBackendCart(response.data);
      // Dispatch event for components listening to cart updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
      }
      return cart;
    }
    return { items: [], total: 0 };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { items: [], total: 0 };
  }
}

/**
 * Add product to cart via backend API
 */
export async function addProductToCart(product: Product, quantity: number = 1) {
  try {
    const response = await api.addToCart(product.id, quantity);
    if (response.success && response.data) {
      const cart = transformBackendCart(response.data);
      // Dispatch event for components listening to cart updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
      }
      return cart;
    }
    throw new Error('Failed to add product to cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(productId: string, quantity: number) {
  try {
    const response = await api.updateCartItem(productId, quantity);
    if (response.success && response.data) {
      const cart = transformBackendCart(response.data);
      // Dispatch event for components listening to cart updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
      }
      return cart;
    }
    throw new Error('Failed to update cart item');
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(productId: string) {
  try {
    const response = await api.removeFromCart(productId);
    if (response.success && response.data) {
      const cart = transformBackendCart(response.data);
      // Dispatch event for components listening to cart updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
      }
      return cart;
    }
    throw new Error('Failed to remove item from cart');
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

/**
 * Clear entire cart
 */
export async function clearCart() {
  try {
    const response = await api.clearCart();
    if (response.success) {
      const emptyCart = { items: [], total: 0 };
      // Dispatch event for components listening to cart updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: emptyCart }));
      }
      return emptyCart;
    }
    throw new Error('Failed to clear cart');
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}
