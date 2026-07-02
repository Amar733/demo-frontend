'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import CartItem from '@/components/CartItem';
import { useCart } from '@/components/add-to-cart';
import { updateCartItemQuantity, removeFromCart, clearCart } from '@/components/add-to-cart/addToCart';
import { formatPrice } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const { cart, itemCount, total, isLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      alert('Please login to update cart');
      return;
    }

    try {
      await updateCartItemQuantity(productId, quantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
      alert('Failed to update cart item. Please try again.');
    }
  };

  const handleRemove = async (productId: string) => {
    if (!isAuthenticated) {
      alert('Please login to modify cart');
      return;
    }

    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  const handleClearCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to clear cart');
      return;
    }

    if (confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Failed to clear cart. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Loading your cart...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-600 mb-8">You need to be logged in to view your cart.</p>
        <Link
          href="/"
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition inline-block"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <Link
          href="/products"
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition inline-block"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
        <Button 
          variant="outline" 
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <CartItem
              key={item.product.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="border rounded-lg p-6 h-fit bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax</span>
              <span className="font-semibold">Calculated at checkout</span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800 transition font-semibold mb-3"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/products"
            className="block w-full text-center py-2 text-gray-600 hover:text-gray-900 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
