'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  showIcon?: boolean;
  onLogoutComplete?: () => void;
}

export default function LogoutButton({ 
  variant = 'outline', 
  showIcon = true,
  onLogoutComplete 
}: LogoutButtonProps) {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    if (onLogoutComplete) {
      onLogoutComplete();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Button 
      type="button"
      variant={variant} 
      onClick={handleLogout}
      className="gap-2"
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      Logout
    </Button>
  );
}
