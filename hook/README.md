# useAuth Hook Documentation (via AuthContext)

## Overview
The `useAuth` hook is exported from `AuthContext` and provides authentication functionality with built-in API request handling. It includes two powerful utility functions: `authFetch` and `verifyUser`.

## Import

```typescript
import { useAuth } from '@/contexts/AuthContext';
```

## Features

### 1. **authFetch** - Authenticated API Requests
A wrapper function for fetch that automatically includes authentication headers and the base URL.

#### Signature
```typescript
authFetch(endpoint: string, options?: AuthFetchOptions): Promise<Response>
```

#### Parameters
- `endpoint` (string): The API endpoint (e.g., '/products', '/cart', '/orders')
- `options` (AuthFetchOptions): Optional fetch options
  - `method`: HTTP method (GET, POST, PUT, DELETE, etc.)
  - `body`: Request body (already stringified)
  - `headers`: Additional headers
  - `skipAuth`: Set to `true` to skip authorization header (for public endpoints)

#### Usage Examples

**GET Request:**
```typescript
const { authFetch } = useAuth();

// Fetch products
const response = await authFetch('/products');
const data = await response.json();

// Fetch cart
const cartResponse = await authFetch('/cart', { method: 'GET' });
const cartData = await cartResponse.json();
```

**POST Request:**
```typescript
const { authFetch } = useAuth();

// Add to cart
const response = await authFetch('/cart', {
  method: 'POST',
  body: JSON.stringify({
    productId: '123',
    quantity: 2
  })
});
const data = await response.json();
```

**PUT Request:**
```typescript
const { authFetch } = useAuth();

// Update cart item
const response = await authFetch(`/cart/${itemId}`, {
  method: 'PUT',
  body: JSON.stringify({
    quantity: 5
  })
});
```

**DELETE Request:**
```typescript
const { authFetch } = useAuth();

// Remove cart item
const response = await authFetch(`/cart/${itemId}`, {
  method: 'DELETE'
});
```

**Public Endpoint (Skip Auth):**
```typescript
const { authFetch } = useAuth();

// Fetch products without authentication
const response = await authFetch('/products', {
  method: 'GET',
  skipAuth: true
});
```

#### Benefits
- ✅ Automatically adds base URL
- ✅ Automatically includes Authorization header
- ✅ Handles 401 Unauthorized responses
- ✅ Consistent error handling
- ✅ Automatic token management

---

### 2. **verifyUser** - User Verification
Verifies the current user's authentication status and returns user data.

#### Signature
```typescript
verifyUser(): Promise<User | null>
```

#### Returns
- `User` object if authenticated
- `null` if not authenticated

#### Usage Examples

**Check Authentication:**
```typescript
const { verifyUser } = useAuth();

const currentUser = await verifyUser();
if (currentUser) {
  console.log('User is authenticated:', currentUser.name);
  console.log('User role:', currentUser.role);
} else {
  console.log('User is not authenticated');
}
```

**Protect Routes:**
```typescript
'use client';

import { useAuth } from '@/hook/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { verifyUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await verifyUser();
      if (!user) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [verifyUser, router]);

  if (isLoading) return <div>Loading...</div>;

  return <div>Protected Content</div>;
}
```

**Conditional Rendering:**
```typescript
const { verifyUser, user } = useAuth();

useEffect(() => {
  verifyUser();
}, [verifyUser]);

return (
  <div>
    {user ? (
      <div>Welcome, {user.name}!</div>
    ) : (
      <div>Please log in</div>
    )}
  </div>
);
```

---

## Complete Hook API

### Properties
- `user`: Current user object or null
- `isAuthenticated`: Boolean indicating if user is logged in
- `isLoading`: Boolean indicating loading state
- `error`: Error message or null

### Methods
- `login(credentials)`: Log in user
- `register(credentials)`: Register new user
- `logout()`: Log out user
- `checkAuth()`: Check authentication status
- `authFetch(endpoint, options)`: Make authenticated API request
- `verifyUser()`: Verify and get current user

---

## Real-World Examples

### Example 1: Cart Page with authFetch
```typescript
'use client';

import { useAuth } from '@/hook/useAuth';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { authFetch, verifyUser } = useAuth();
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      // Verify user first
      const user = await verifyUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      // Fetch cart with authFetch
      const response = await authFetch('/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data.data);
      }
    };

    loadCart();
  }, [authFetch, verifyUser]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    const response = await authFetch(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });

    if (response.ok) {
      // Reload cart
      const cartResponse = await authFetch('/cart');
      const data = await cartResponse.json();
      setCart(data.data);
    }
  };

  return (
    <div>
      {/* Render cart items */}
    </div>
  );
}
```

### Example 2: Profile Page
```typescript
'use client';

import { useAuth } from '@/hook/useAuth';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { verifyUser, authFetch, user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      // Verify user
      const currentUser = await verifyUser();
      if (!currentUser) {
        window.location.href = '/login';
        return;
      }

      // Fetch user's orders
      const response = await authFetch('/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data);
      }
    };

    loadData();
  }, [verifyUser, authFetch]);

  return (
    <div>
      <h1>Profile: {user?.name}</h1>
      <h2>Your Orders</h2>
      {/* Render orders */}
    </div>
  );
}
```

---

## Integration with AuthContext

The `useAuth` hook works seamlessly with the `AuthContext`:

```typescript
// The hook automatically syncs with AuthContext
// Both provide consistent user state and authentication status
```

You can use either:
- Import from `@/hook/useAuth` for the hook version
- Import from `@/contexts/AuthContext` for the context version

Both will work with the same backend and token management system.

---

## Error Handling

The `authFetch` function automatically handles:
- **401 Unauthorized**: Clears token and updates auth state
- **Network errors**: Logs error and throws exception
- **Invalid tokens**: Removes from localStorage

```typescript
try {
  const response = await authFetch('/cart');
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.message);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

---

## Tips

1. **Always use authFetch for authenticated endpoints** - Don't manually add headers
2. **Use skipAuth: true for public endpoints** - Like product listings
3. **Call verifyUser() on protected pages** - Ensure user is authenticated
4. **Check response.ok before parsing JSON** - Handle errors gracefully
5. **Use useEffect for initial data loading** - Call authFetch in useEffect hooks
