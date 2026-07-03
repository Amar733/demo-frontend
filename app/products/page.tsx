'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProductsSync, getProductsByTypeSync } from '@/lib/products';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductGrid } from '@/components/add-to-cart';
import { Product } from '@/types';
import { api } from '@/lib/api';

type ProductTypeFilter = 'all' | 'perfume' | 'tea' | 'coffee' | 'toy' | 'accessory' | 'bottle' | 'study';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<ProductTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'newest'>('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.getProducts();
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(getProductsSync()); // Fallback to local data
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    let filtered = filter === 'all' 
      ? products 
      : products.filter(p => p.productType === filter);

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.specialPrice || a.price) - (b.specialPrice || b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.specialPrice || b.price) - (a.specialPrice || a.price));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, filter, searchQuery, sortBy]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

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
          <label htmlFor="sort-select" className="text-sm font-semibold text-gray-700">Sort by:</label>
          <select
            id="sort-select"
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
      
      <ProductGrid products={filteredProducts} showAddToCart={true} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
