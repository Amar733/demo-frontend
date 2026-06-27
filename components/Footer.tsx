import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">E-Shop</h3>
            <p className="text-sm mb-4">
              Your one-stop destination for quality products ranging from perfumes to study materials, tea, coffee, and more.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition" aria-label="Contact">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
              <li><Link href="/collections/new-arrivals" className="hover:text-white transition">New Arrivals</Link></li>
              <li><Link href="/collections/special-pricing" className="hover:text-white transition">Special Offers</Link></li>
              <li><Link href="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?filter=perfume" className="hover:text-white transition">Perfumes</Link></li>
              <li><Link href="/products?filter=coffee" className="hover:text-white transition">Coffee</Link></li>
              <li><Link href="/products?filter=tea" className="hover:text-white transition">Tea</Link></li>
              <li><Link href="/products?filter=toy" className="hover:text-white transition">Toys & Games</Link></li>
              <li><Link href="/products?filter=bottle" className="hover:text-white transition">Water Bottles</Link></li>
              <li><Link href="/products?filter=study" className="hover:text-white transition">Study Materials</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 Shopping Street, Commerce City, CC 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>support@eshop.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm mb-2">Subscribe to our newsletter:</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-white text-gray-900 rounded font-semibold text-sm hover:bg-gray-200 transition"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
              <Link href="/shipping" className="hover:text-white transition">Shipping Info</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
