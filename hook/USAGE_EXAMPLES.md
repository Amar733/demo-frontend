# useAuth Hook - Quick Usage Examples

## Import the Hook

```typescript
import { useAuth } from '@/contexts/AuthContext';
```

---

## Example 1: Cart Page (Using authFetch)

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { authFetch, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        // Simple endpoint - base URL is already included
        const response = await authFetch('/cart');
        
        if (response.ok) {
          const data = await response.json();
          setCart(data.data);
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [authFetch, isAuthenticated]);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      const response = await authFetch('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await authFetch(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data);
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await authFetch(`/cart/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in to view cart</div>;

  return (
    <div>
      <h1>Shopping Cart</h1>
      {/* Render cart items */}
    </div>
  );
}
```

---

## Example 2: Products Page (Public + Protected Actions)

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const { authFetch, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Public endpoint - skip auth
        const response = await authFetch('/products', {
          method: 'GET',
          skipAuth: true
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    loadProducts();
  }, [authFetch]);

  const addToCart = async (productId: string) => {
    if (!isAuthenticated) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      // Protected endpoint - auth header included automatically
      const response = await authFetch('/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      });

      if (response.ok) {
        alert('Added to cart!');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => addToCart(product.id)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Example 3: Profile Page (Using verifyUser)

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { verifyUser, authFetch, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      // Verify user authentication
      const currentUser = await verifyUser();
      
      if (!currentUser) {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }

      try {
        // Load user's orders
        const response = await authFetch('/orders');
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data.data);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [verifyUser, authFetch, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>
      <div>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

      <h2>Your Orders</h2>
      {orders.map(order => (
        <div key={order.id}>
          <p>Order #{order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Example 4: Orders Page

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const { authFetch, verifyUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      // Verify user first
      const user = await verifyUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await authFetch('/orders');
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data.data);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [authFetch, verifyUser]);

  const createOrder = async (cartItems: any[]) => {
    try {
      const response = await authFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: '123 Main St',
          paymentMethod: 'credit_card'
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Order created successfully!');
        setOrders([data.data, ...orders]);
      }
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order.id}>
            <h3>Order #{order.id}</h3>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total}</p>
          </div>
        ))
      )}
    </div>
  );
}
```

---

## Example 5: Protected Component

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function ProtectedComponent({ children }: { children: React.ReactNode }) {
  const { verifyUser, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  if (isLoading) {
    return <div>Verifying authentication...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <p>Please log in to access this content</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

## Example 6: Admin Panel

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { verifyUser, authFetch, user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const currentUser = await verifyUser();
      
      // Check if user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        router.push('/');
        return;
      }

      // Load admin data
      const response = await authFetch('/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data);
      }
    };

    checkAdminAccess();
  }, [verifyUser, authFetch, router]);

  const createProduct = async (productData: any) => {
    try {
      const response = await authFetch('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const data = await response.json();
        setProducts([...products, data.data]);
        alert('Product created!');
      }
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    try {
      const response = await authFetch(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(products.map(p => p.id === id ? data.data : p));
        alert('Product updated!');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      const response = await authFetch(`/products/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        alert('Product deleted!');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin interface */}
    </div>
  );
}
```

---

## Key Takeaways

1. **Use `authFetch` for all API calls** - No need to manually add base URL or auth headers
2. **Set `skipAuth: true` for public endpoints** - Like product listings
3. **Use `verifyUser()` to check authentication** - Before loading protected data
4. **Access current user with `user` property** - From the hook's return value
5. **Check `isAuthenticated` for conditional rendering** - Show/hide UI elements
6. **Handle loading states with `isLoading`** - Show loading indicators

---

## Endpoint Examples

### Common Endpoints

- `/products` - List products (public)
- `/products/:id` - Get product details (public)
- `/cart` - Get/update cart (protected)
- `/cart/:itemId` - Update/delete cart item (protected)
- `/orders` - List orders (protected)
- `/orders` (POST) - Create order (protected)
- `/auth/me` - Get current user (protected)
- `/auth/login` - Login (public)
- `/auth/register` - Register (public)
- `/auth/logout` - Logout (protected)

All endpoints automatically use the base URL from `API_BASE_URL` in the config!
