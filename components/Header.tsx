'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Settings } from 'lucide-react';
import { useCart } from '@/components/add-to-cart';
import LoginDialog from '@/components/login/LoginDialog';
import SignupDialog from '@/components/login/SignupDialog';
import UserMenu from '@/components/login/UserMenu';

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

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
            <Link href="/cart" className="hover:underline relative inline-flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Admin Panel Link - Only visible to admin users */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" className="hover:underline inline-flex items-center gap-2 text-blue-600 font-medium">
                <Settings className="w-5 h-5" />
                Admin Panel
              </Link>
            )}

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowLogin(true)}
                  className="font-medium"
                >
                  Login
                </Button>
                <Button 
                  type="button"
                  onClick={() => setShowSignup(true)}
                  className="font-medium"
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <UserMenu />
            )}
          </nav>
        </div>
      </div>

      {/* Dialogs */}
      {showLogin && (
        <LoginDialog 
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={handleSwitchToSignup}
        />
      )}
      {showSignup && (
        <SignupDialog 
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </header>
  );
}
