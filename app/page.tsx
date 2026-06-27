'use client';

import Link from 'next/link';
import Image from 'next/image';
import { productsByCategory } from '@/lib/products';
import { formatPrice } from '@/lib/currency';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';

function ProductSection({ 
  title, 
  products, 
  viewAllLink 
}: { 
  title: string; 
  products: Product[];
  viewAllLink?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          {viewAllLink && (
            <Link href={viewAllLink} className="text-blue-600 hover:underline">
              View All →
            </Link>
          )}
        </div>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-12"
          >
            {products.map(product => (
              <Link 
                key={product.id} 
                href={`/products/${product.id}`} 
                className="flex-shrink-0 w-[280px]"
              >
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-square relative mb-4 bg-gray-100 rounded">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2">
                    {product.specialPrice ? (
                      <>
                        <p className="text-xl font-bold text-red-600">{formatPrice(product.specialPrice)}</p>
                        <p className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</p>
                      </>
                    ) : (
                      <p className="text-xl font-bold">{formatPrice(product.price)}</p>
                    )}
                  </div>
                  {product.isNewArrival && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      New
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Debounce search - redirect after user stops typing
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      }, 800); // Wait 800ms after user stops typing

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-900 via-stone-800 to-gray-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-stone-200 drop-shadow-2xl tracking-tight">
            Welcome to E-Shop
          </h1>
          <p className="text-xl text-stone-200 mb-8 drop-shadow-lg max-w-2xl mx-auto font-light tracking-wide">
            Discover amazing products - everything you need in one place
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-14 pr-6 py-4 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-4 focus:ring-amber-300/50 shadow-2xl text-lg border border-stone-200/20"
              />
            </div>
          </form>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/products"
              className="bg-amber-600 text-white px-8 py-3 rounded-full hover:bg-amber-700 transition inline-block font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform"
            >
              Shop Now
            </Link>
            <Link
              href="/collections/special-pricing"
              className="bg-transparent border-2 border-stone-300 text-stone-100 px-8 py-3 rounded-full hover:bg-white hover:text-gray-900 transition inline-block font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
            >
              View Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { name: 'Perfumes', emoji: '🌸', link: '/products?filter=perfume', filter: 'perfume' },
              { name: 'Coffee', emoji: '☕', link: '/products?filter=coffee', filter: 'coffee' },
              { name: 'Tea', emoji: '🍵', link: '/products?filter=tea', filter: 'tea' },
              { name: 'Power Banks', emoji: '🔋', link: '/products?filter=powerbank', filter: 'powerbank' },
              { name: 'Earbuds', emoji: '🎧', link: '/products?filter=earbuds', filter: 'earbuds' },
              { name: 'Toys', emoji: '🧸', link: '/products?filter=toy', filter: 'toy' },
              { name: 'Bottles', emoji: '💧', link: '/products?filter=bottle', filter: 'bottle' },
              { name: 'Study', emoji: '📚', link: '/products?filter=study', filter: 'study' },
              { name: 'Accessories', emoji: '👔', link: '/products?filter=accessory', filter: 'accessory' },
              { name: 'New Arrivals', emoji: '✨', link: '/collections/new-arrivals', filter: '' }
            ].map((category) => (
              <Link
                key={category.name}
                href={category.link}
                className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200"
              >
                <div className="text-5xl mb-3">{category.emoji}</div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Sections by Category */}
      <ProductSection 
        title="✨ New Arrivals" 
        products={[
          ...productsByCategory.perfume.filter(p => p.isNewArrival),
          ...productsByCategory.coffee.filter(p => p.isNewArrival),
          ...productsByCategory.tea.filter(p => p.isNewArrival),
          ...productsByCategory.powerbank.filter(p => p.isNewArrival),
          ...productsByCategory.earbuds.filter(p => p.isNewArrival),
          ...productsByCategory.toy.filter(p => p.isNewArrival),
          ...productsByCategory.accessory.filter(p => p.isNewArrival),
          ...productsByCategory.bottle.filter(p => p.isNewArrival),
          ...productsByCategory.study.filter(p => p.isNewArrival)
        ]} 
        viewAllLink="/collections/new-arrivals"
      />

      <ProductSection 
        title="☕ Coffee Collection" 
        products={productsByCategory.coffee} 
        viewAllLink="/products"
      />

      <ProductSection 
        title="🍵 Premium Teas" 
        products={productsByCategory.tea} 
        viewAllLink="/products"
      />

      <ProductSection 
        title="🌸 Signature Perfumes" 
        products={productsByCategory.perfume} 
        viewAllLink="/products"
      />

      <ProductSection 
        title="🔋 Power Banks" 
        products={productsByCategory.powerbank} 
        viewAllLink="/products"
      />

      <ProductSection 
        title="🎧 Wireless Earbuds" 
        products={productsByCategory.earbuds} 
        viewAllLink="/products"
      />

      <ProductSection 
        title="🧸 Toys & Games" 
        products={productsByCategory.toy} 
        viewAllLink="/products"
      />

      <ProductSection 
        title="💧 Water Bottles" 
        products={productsByCategory.bottle} 
        viewAllLink="/products"
      />

      <ProductSection 
        title="📚 Study Essentials" 
        products={productsByCategory.study} 
        viewAllLink="/products"
      />

      <ProductSection 
        title="👔 Accessories" 
        products={productsByCategory.accessory} 
        viewAllLink="/products"
      />
    </div>
  );
}
