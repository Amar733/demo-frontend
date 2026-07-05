'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Settings, Menu, X } from 'lucide-react';
import { useCart } from '@/components/add-to-cart';
import LoginDialog from '@/components/login/LoginDialog';
import SignupDialog from '@/components/login/SignupDialog';
import UserMenu from '@/components/login/UserMenu';

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            E-Shop
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/products" className="hover:underline">
              All Products
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

          {/* Mobile Menu Button & Cart */}
          <div className="flex lg:hidden items-center gap-4">
            <Link href="/cart" className="relative inline-flex items-center">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto lg:hidden animate-slide-in">
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={closeMobileMenu}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-4">
                <Link 
                  href="/products" 
                  className="py-3 px-4 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  All Products
                </Link>
                <Link 
                  href="/collections/summer" 
                  className="py-3 px-4 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  Summer Collection
                </Link>
                <Link 
                  href="/collections/royal" 
                  className="py-3 px-4 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  Royal Collection
                </Link>
                <Link 
                  href="/collections/new-arrivals" 
                  className="py-3 px-4 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  New Arrivals
                </Link>
                <Link 
                  href="/collections/special-pricing" 
                  className="py-3 px-4 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  Special Pricing
                </Link>
                <Link 
                  href="/cart" 
                  className="py-3 px-4 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
                  onClick={closeMobileMenu}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Cart
                  {itemCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Admin Panel Link - Mobile */}
                {isAuthenticated && user?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="py-3 px-4 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2 text-blue-600 font-medium"
                    onClick={closeMobileMenu}
                  >
                    <Settings className="w-5 h-5" />
                    Admin Panel
                  </Link>
                )}

                <div className="border-t pt-4 mt-4">
                  {/* Auth Buttons - Mobile */}
                  {!isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => {
                          closeMobileMenu();
                          setShowLogin(true);
                        }}
                        className="w-full font-medium"
                      >
                        Login
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => {
                          closeMobileMenu();
                          setShowSignup(true);
                        }}
                        className="w-full font-medium"
                      >
                        Sign Up
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="py-2 px-4 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">Logged in as</p>
                        <p className="font-medium">{user?.name || user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block py-3 px-4 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block py-3 px-4 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Orders
                      </Link>
                      <div className="pt-2">
                        <UserMenu />
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

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
