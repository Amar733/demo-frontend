'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/currency';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from './AddToCartButton';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const displayPrice = product.specialPrice || product.price;
  const hasDiscount = product.specialPrice && product.specialPrice < product.price;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.isNewArrival && (
              <Badge variant="default" className="bg-blue-500">
                New
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                Save {Math.round(((product.price - product.specialPrice!) / product.price) * 100)}%
              </Badge>
            )}
            {product.stock <= 10 && product.stock > 0 && (
              <Badge variant="secondary" className="bg-orange-500 text-white">
                Only {product.stock} left
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="bg-gray-500 text-white">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </Link>

      <CardContent className="p-4 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          {product.gender && (
            <Badge variant="outline" className="text-xs capitalize">
              {product.gender}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </CardContent>

      {showAddToCart && (
        <CardFooter className="p-4 pt-0">
          <AddToCartButton 
            product={product} 
            className="w-full"
          />
        </CardFooter>
      )}
    </Card>
  );
}
