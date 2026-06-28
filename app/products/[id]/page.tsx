'use client';

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/currency';
import { AddToCartButton } from '@/components/add-to-cart';
import { Badge } from '@/components/ui/badge';

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const displayPrice = product.specialPrice || product.price;
  const hasDiscount = product.specialPrice && product.specialPrice < product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNewArrival && (
                <Badge variant="default" className="bg-blue-500">
                  New Arrival
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
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <Badge variant="outline" className="text-sm">
              {product.category}
            </Badge>
            {product.gender && (
              <Badge variant="outline" className="ml-2 text-sm capitalize">
                {product.gender}
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-2xl text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-red-600 font-semibold">
                  {Math.round(((product.price - product.specialPrice!) / product.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          
          <div className="prose prose-lg mb-6">
            <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="space-y-1 text-gray-700">
              <li className="flex justify-between">
                <span>Product Type:</span>
                <span className="font-medium capitalize">{product.productType}</span>
              </li>
              <li className="flex justify-between">
                <span>Category:</span>
                <span className="font-medium">{product.category}</span>
              </li>
              {product.gender && (
                <li className="flex justify-between">
                  <span>Gender:</span>
                  <span className="font-medium capitalize">{product.gender}</span>
                </li>
              )}
              {product.collection && (
                <li className="flex justify-between">
                  <span>Collection:</span>
                  <span className="font-medium capitalize">{product.collection}</span>
                </li>
              )}
            </ul>
          </div>
          
          <div className="mb-6">
            <p className="text-lg font-semibold mb-2">
              Availability: 
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? ` ${product.stock} in stock` : ' Out of stock'}
              </span>
            </p>
          </div>

          <AddToCartButton 
            product={product} 
            quantity={1}
            size="lg"
            className="w-full py-6 text-lg"
          />

          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-orange-600 text-sm mt-4 text-center">
              ⚠️ Hurry! Only {product.stock} left in stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
