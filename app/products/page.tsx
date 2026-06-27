'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getProductsByType } from '@/lib/products';
import { formatPrice } from '@/lib/currency';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

type ProductTypeFilter = 'all' | 'perfume' | 'tea' | 'coffee' | 'toy' | 'accessory' | 'bottle' | 'study';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<ProductTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'newest'>('name');
  const allProducts = getProducts();

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && ['perfume', 'tea', 'coffee', 'toy', 'accessory', 'bottle', 'study'].includes(filterParam)) {
      setFilter(filterParam as ProductTypeFilter);
    }
    
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let products = filter === 'all' 
      ? allProducts 
      : getProductsByType(filter);

    // Apply search filter
    if (searchQuery.trim()) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        products.sort((a, b) => (a.specialPrice || a.price) - (b.specialPrice || b.price));
        break;
      case 'price-desc':
        products.sort((a, b) => (b.specialPrice || b.price) - (a.specialPrice || a.price));
        break;
      case 'newest':
        products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
    }

    return products;
  }, [allProducts, filter, searchQuery, sortBy]);

  const productTypes = [
    { value: 'all', label: 'All Products' },
    { value: 'perfume', label: 'Perfumes' },
    { value: 'tea', label: 'Tea' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'toy', label: 'Toys' },
    { value: 'accessory', label: 'Handkerchiefs' },
    { value: 'bottle', label: 'Water Bottles' },
    { value: 'study', label: 'Study Materials' }
  ] as const;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">All Products</h1>
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search products by name, description, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 py-6 text-lg"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters and Sort */}
      <div className="mb-8 space-y-4">
        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Filter by Category:</h3>
          <div className="flex flex-wrap gap-3">
            {productTypes.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFilter(type.value as ProductTypeFilter)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  filter === type.value
                    ? 'bg-black text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-gray-700">Sort by:</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="newest">Newest First</option>
          </select>
          <span className="text-sm text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </span>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-2">No products found</p>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow h-full bg-white">
                <div className="aspect-square relative mb-4 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNewArrival && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
                      New
                    </span>
                  )}
                  {product.specialPrice && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-semibold">
                      Sale
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</span>
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-2">
                  {product.specialPrice ? (
                    <>
                      <p className="text-xl font-bold text-red-600">{formatPrice(product.specialPrice)}</p>
                      <p className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</p>
                      <span className="text-xs text-red-600 font-semibold">
                        {Math.round((1 - product.specialPrice / product.price) * 100)}% OFF
                      </span>
                    </>
                  ) : (
                    <p className="text-xl font-bold">{formatPrice(product.price)}</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
