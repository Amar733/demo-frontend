import { Cart, CartItem, Product } from '@/types';

export function addToCart(cart: Cart, product: Product, quantity: number = 1): Cart {
  const existingItem = cart.items.find(item => item.product.id === product.id);
  
  if (existingItem) {
    const updatedItems = cart.items.map(item =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
    return calculateTotal({ ...cart, items: updatedItems });
  }
  
  const newItems = [...cart.items, { product, quantity }];
  return calculateTotal({ ...cart, items: newItems });
}

export function removeFromCart(cart: Cart, productId: string): Cart {
  const updatedItems = cart.items.filter(item => item.product.id !== productId);
  return calculateTotal({ ...cart, items: updatedItems });
}

export function updateQuantity(cart: Cart, productId: string, quantity: number): Cart {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  
  const updatedItems = cart.items.map(item =>
    item.product.id === productId ? { ...item, quantity } : item
  );
  return calculateTotal({ ...cart, items: updatedItems });
}

function calculateTotal(cart: Cart): Cart {
  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return { ...cart, total };
}

export function getEmptyCart(): Cart {
  return { items: [], total: 0 };
}
