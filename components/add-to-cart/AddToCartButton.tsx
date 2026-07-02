'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { addProductToCart } from './addToCart';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
}

export function AddToCartButton({ 
  product, 
  quantity = 1,
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setError('Please login to add items to cart');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await addProductToCart(product, quantity);
      setIsAdded(true);
      
      // Reset the "added" state after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      setError(error.message || 'Failed to add to cart');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleAddToCart}
        disabled={isLoading || product.stock === 0}
        variant={variant}
        size={size}
        className={className}
      >
        {showIcon && (
          isAdded ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )
        )}
        {isLoading 
          ? 'Adding...' 
          : isAdded 
          ? 'Added!' 
          : product.stock === 0 
          ? 'Out of Stock'
          : 'Add to Cart'
        }
      </Button>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
