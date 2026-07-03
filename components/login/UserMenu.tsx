'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface UserMenuProps {
  onLogout?: () => void;
}

export default function UserMenu({ onLogout }: UserMenuProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  // Safe display name with fallback
  const displayName = user.name || user.email || user.mobile || 'User';
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-medium shadow-sm">
          {displayInitial}
        </div>
        <span className="font-medium text-gray-700">{displayName}</span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${showMenu ? 'rotate-180' : ''}`} 
        />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500 mt-1">{user.email || user.mobile}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setShowMenu(false)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>
          </div>

          {/* Logout Section */}
          <div className="border-t py-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
