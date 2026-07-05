'use client';

import Link from 'next/link';
import { productsByCategory } from '@/lib/products';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/add-to-cart';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const CATEGORIES = [
  { name: 'Perfumes',     emoji: '🌸', link: '/products?filter=perfume' },
  { name: 'Coffee',       emoji: '☕', link: '/products?filter=coffee' },
  { name: 'Tea',          emoji: '🍵', link: '/products?filter=tea' },
  { name: 'Power Banks',  emoji: '🔋', link: '/products?filter=powerbank' },
  { name: 'Earbuds',      emoji: '🎧', link: '/products?filter=earbuds' },
  { name: 'Toys',         emoji: '🧸', link: '/products?filter=toy' },
  { name: 'Bottles',      emoji: '💧', link: '/products?filter=bottle' },
  { name: 'Study',        emoji: '📚', link: '/products?filter=study' },
  { name: 'Accessories',  emoji: '👔', link: '/products?filter=accessory' },
  { name: 'New Arrivals', emoji: '✨', link: '/collections/new-arrivals' },
];

const SECTIONS = [
  { title: '☕ Coffee Collection',   type: 'coffee' },
  { title: '🍵 Premium Teas',        type: 'tea' },
  { title: '🌸 Signature Perfumes',  type: 'perfume' },
  { title: '🔋 Power Banks',         type: 'powerbank' },
  { title: '🎧 Wireless Earbuds',    type: 'earbuds' },
  { title: '🧸 Toys & Games',        type: 'toy' },
  { title: '💧 Water Bottles',       type: 'bottle' },
  { title: '📚 Study Essentials',    type: 'study' },
];

function ProductSection({ title, products }: { title: string; products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          <Button variant="link" asChild className="text-amber-600 p-0 h-auto">
            <Link href="/products">View All →</Link>
          </Button>
        </div>

        <div className="relative group">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity bg-white"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity bg-white"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-2"
          >
            {products.map(product => (
              <div key={product.id} className="flex-shrink-0 w-[220px] sm:w-[260px]">
                <ProductCard product={product} showAddToCart={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Separator className="mt-10" />
    </section>
  );
}

function SectionSkeleton() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <Skeleton className="h-7 w-48 mb-5" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="flex-shrink-0 w-[220px] sm:w-[260px] h-[320px] rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.getProducts();
        setAllProducts(response.data || []);
      } catch {
        setAllProducts([
          ...productsByCategory.perfume,
          ...productsByCategory.tea,
          ...productsByCategory.coffee,
          ...productsByCategory.powerbank,
          ...productsByCategory.earbuds,
          ...productsByCategory.toy,
          ...productsByCategory.accessory,
          ...productsByCategory.bottle,
          ...productsByCategory.study,
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const id = setTimeout(() => {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }, 800);
    return () => clearTimeout(id);
  }, [searchQuery, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const getByType = (type: string) => allProducts.filter(p => p.productType === type);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-900 via-stone-800 to-gray-900 py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-4 bg-amber-200/20 text-amber-100 border-amber-300/30 hover:bg-amber-200/30">
            ✨ New arrivals every week
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-stone-200 tracking-tight">
            Welcome to E-Shop
          </h1>
          <p className="text-base sm:text-xl text-stone-300 mb-8 max-w-xl mx-auto font-light">
            Discover amazing products — everything you need in one place
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="pl-11 pr-4 py-5 rounded-full bg-white text-gray-800 shadow-2xl border-0 focus-visible:ring-2 focus-visible:ring-amber-400 text-base"
              />
            </div>
          </form>

          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild size="lg" className="rounded-full bg-amber-600 hover:bg-amber-700 shadow-xl font-semibold px-8">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-stone-300 text-stone-100 bg-transparent hover:bg-white hover:text-gray-900 shadow-lg font-semibold px-8">
              <Link href="/collections/special-pricing">View Deals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 sm:gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                href={cat.link}
                className="bg-background rounded-xl p-4 sm:p-5 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-border group"
              >
                <div className="text-4xl sm:text-5xl mb-2 group-hover:scale-110 transition-transform">{cat.emoji}</div>
                <p className="font-medium text-sm sm:text-base">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Product Sections */}
      {loading
        ? SECTIONS.map(s => <SectionSkeleton key={s.type} />)
        : SECTIONS.map(s => (
            <ProductSection key={s.type} title={s.title} products={getByType(s.type)} />
          ))
      }
    </div>
  );
}
