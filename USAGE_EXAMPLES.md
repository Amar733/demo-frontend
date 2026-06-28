# API Integration Usage Examples

## Using the useAuth Hook

### Basic Authentication
```typescript
'use client';

import { useAuth } from '@/hook/useAuth';

export default function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <button onClick={() => login({ 
        email: 'user@example.com', 
        password: 'password123' 
      })}>
        Login
      </button>
    );
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Component
```typescript
'use client';

import { useAuth } from '@/hook/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <div>Protected Content Here</div>;
}
```

## Using API Endpoints Directly

### Fetch Products
```typescript
import { API_ENDPOINTS } from '@/components/config/api';

async function fetchProducts() {
  try {
    const response = await fetch(API_ENDPOINTS.PRODUCTS.LIST);
    const data = await response.json();
    
    if (data.success) {
      console.log('Products:', data.data.products);
      return data.data.products;
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}
```

### Authenticated Cart Request
```typescript
import { API_ENDPOINTS } from '@/components/config/api';

async function addToCart(productId: string, quantity: number) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(API_ENDPOINTS.CART.ADD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add to cart');
    }

    return data.data.cart;
  } catch (error) {
    console.error('Add to cart error:', error);
    throw error;
  }
}
```

## Using the API Client Helper

### Simple GET Request
```typescript
import { apiClient } from '@/lib/api-client';

async function getProducts() {
  try {
    const data = await apiClient.get('/products');
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}
```

### Authenticated POST Request
```typescript
import { apiClient } from '@/lib/api-client';

async function addItemToCart(productId: string, quantity: number) {
  try {
    const data = await apiClient.post(
      '/cart',
      { productId, quantity },
      true // requiresAuth = true
    );
    return data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}
```

### Complete Cart Component Example
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hook/useAuth';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/components/config/api';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

export default function CartPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCart();
    }
  }, [authLoading, isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<any>('/cart', true);
      setCartItems(data.data.cart.items || []);
    } catch (err) {
      setError('Failed to load cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await apiClient.put(`/cart/${itemId}`, { quantity }, true);
      await fetchCart(); // Refresh cart
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await apiClient.delete(`/cart/${itemId}`, true);
      await fetchCart(); // Refresh cart
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  if (authLoading || loading) {
    return <div>Loading cart...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your cart</div>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
      {error && <div className="error">{error}</div>}
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item._id}>
              <img src={item.product.image} alt={item.product.name} />
              <h3>{item.product.name}</h3>
              <p>${item.product.price}</p>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                min="1"
              />
              <button onClick={() => removeItem(item._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Creating an Order

```typescript
import { apiClient } from '@/lib/api-client';

async function createOrder(shippingAddress: any, paymentMethod: string) {
  try {
    const data = await apiClient.post(
      '/orders',
      {
        shippingAddress,
        paymentMethod,
      },
      true // requiresAuth = true
    );
    
    console.log('Order created:', data.data.order);
    return data.data.order;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
}

// Usage
const order = await createOrder(
  {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  },
  'Credit Card'
);
```

## Error Handling Pattern

```typescript
import { apiClient } from '@/lib/api-client';

async function handleApiCall() {
  try {
    const data = await apiClient.get('/some-endpoint', true);
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific errors
      if (error.message.includes('401')) {
        // Redirect to login
        window.location.href = '/login';
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
}
```

## Custom Hook for Products

```typescript
// hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<any>('/products');
      setProducts(data.data.products || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
}

// Usage in component
function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## Testing Authentication Flow

```typescript
// Test login
const result = await login({ 
  email: 'test@example.com', 
  password: 'password123' 
});

if (result.success) {
  console.log('✅ Login successful:', result.user);
  console.log('Token stored:', localStorage.getItem('token'));
} else {
  console.log('❌ Login failed:', result.error);
}

// Test logout
await logout();
console.log('Token after logout:', localStorage.getItem('token')); // Should be null
```

## Important Notes

1. **Server-Side Rendering**: The `localStorage` check in `api-client.ts` includes a check for `typeof window !== 'undefined'` to prevent SSR errors

2. **Token Management**: Tokens are automatically included in requests when `requiresAuth` is true

3. **Error Handling**: Always wrap API calls in try-catch blocks

4. **Type Safety**: Use TypeScript interfaces to type your API responses

5. **Loading States**: Always handle loading and error states in your UI

6. **CORS**: Make sure backend CORS settings allow requests from your frontend URL
