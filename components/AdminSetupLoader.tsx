'use client';

import { useEffect } from 'react';

/**
 * This component loads the admin setup utilities into the browser console
 * It should be included in the root layout
 */
export default function AdminSetupLoader() {
  useEffect(() => {
    // Dynamically import admin setup utilities
    import('@/lib/adminSetup').then(() => {
      console.log('Admin utilities loaded. Use adminSetup.* functions in console.');
      console.log('Example: adminSetup.createAdminUser()');
    });
  }, []);

  return null; // This component doesn't render anything
}
