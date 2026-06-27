'use client';

import { useState } from 'react';
import Link from 'next/link';
import CartItem from '@/components/CartItem';
import { getEmptyCart } from '@/lib/cart';

export default function CartPage() {
  const [cart, setCart] = useState(getEmptyCart());

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    // Cart logic will be handled here
    console.log('Update quantity', productId, quantity);
  };

  const handleRemove = (productId: string) => {
    // Remove logic will be handled here
    console.log('Remove', productId);
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some perfumes to get started!</p>
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
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
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
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
