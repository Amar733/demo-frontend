import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            E-Shop
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/products" className="hover:underline">
              All Products
            </Link>
            <Link href="/collections/summer" className="hover:underline">
              Summer Collection
            </Link>
            <Link href="/collections/royal" className="hover:underline">
              Royal Collection
            </Link>
            <Link href="/collections/new-arrivals" className="hover:underline">
              New Arrivals
            </Link>
            <Link href="/collections/special-pricing" className="hover:underline">
              Special Pricing
            </Link>
            <Link href="/cart" className="hover:underline">
              Cart
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
