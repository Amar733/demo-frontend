# Quick Authentication Reference

## 🎯 Import

```typescript
import { useAuth } from '@/contexts/AuthContext';
```

## 🔧 Get Functions

```typescript
const { authFetch, verifyUser, user, isAuthenticated } = useAuth();
```

## 📝 Common Patterns

### Pattern 1: Fetch Data (Protected)

```typescript
const response = await authFetch('/cart');
const data = await response.json();
```

### Pattern 2: Fetch Data (Public)

```typescript
const response = await authFetch('/products', { skipAuth: true });
const data = await response.json();
```

### Pattern 3: POST Data

```typescript
const response = await authFetch('/cart', {
  method: 'POST',
  body: JSON.stringify({ productId: '123', quantity: 2 })
});
```

### Pattern 4: PUT Data

```typescript
const response = await authFetch(`/cart/${itemId}`, {
  method: 'PUT',
  body: JSON.stringify({ quantity: 5 })
});
```

### Pattern 5: DELETE Data

```typescript
const response = await authFetch(`/cart/${itemId}`, {
  method: 'DELETE'
});
```

### Pattern 6: Verify User Before Loading

```typescript
useEffect(() => {
  const loadData = async () => {
    const user = await verifyUser();
    if (!user) {
      router.push('/login');
      return;
    }
    
    const response = await authFetch('/orders');
    // ... handle response
  };
  
  loadData();
}, [verifyUser, authFetch, router]);
```

### Pattern 7: Check Auth in Component

```typescript
const { verifyUser, user } = useAuth();

useEffect(() => {
  verifyUser();
}, [verifyUser]);

if (!user) {
  return <div>Please log in</div>;
}

return <div>Welcome, {user.name}!</div>;
```

### Pattern 8: Role-Based Access

```typescript
const { user } = useAuth();

if (user?.role !== 'admin') {
  return <div>Access denied</div>;
}

return <div>Admin Panel</div>;
```

## 🌐 Common Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/products` | GET | No | List all products |
| `/products/:id` | GET | No | Get product details |
| `/cart` | GET | Yes | Get user's cart |
| `/cart` | POST | Yes | Add to cart |
| `/cart/:itemId` | PUT | Yes | Update cart item |
| `/cart/:itemId` | DELETE | Yes | Remove from cart |
| `/orders` | GET | Yes | List user's orders |
| `/orders` | POST | Yes | Create new order |
| `/orders/:id` | GET | Yes | Get order details |
| `/auth/me` | GET | Yes | Get current user |

## ✅ Best Practices

1. **Always use authFetch** - Don't construct URLs manually
2. **Use skipAuth for public endpoints** - Like product listings
3. **Verify user on protected pages** - Use `verifyUser()` in useEffect
4. **Check response.ok** - Before parsing JSON
5. **Handle errors gracefully** - Use try/catch blocks
6. **Use user from context** - Access via `const { user } = useAuth()`

## ⚠️ Common Mistakes

❌ **Don't do this:**
```typescript
const url = `${API_BASE_URL}/cart`;
fetch(url, { headers: { Authorization: `Bearer ${token}` } });
```

✅ **Do this instead:**
```typescript
await authFetch('/cart');
```

---

❌ **Don't do this:**
```typescript
if (localStorage.getItem('token')) {
  // assume logged in
}
```

✅ **Do this instead:**
```typescript
const user = await verifyUser();
if (user) {
  // user is verified
}
```

---

❌ **Don't do this:**
```typescript
fetch(`${API_BASE_URL}/products/${id}`)
```

✅ **Do this instead:**
```typescript
await authFetch(`/products/${id}`, { skipAuth: true })
```

## 🚀 Quick Start Example

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function MyPage() {
  const { authFetch, verifyUser } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      // Verify user
      const user = await verifyUser();
      if (!user) return;

      // Fetch data
      const response = await authFetch('/endpoint');
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      }
    };

    loadData();
  }, [authFetch, verifyUser]);

  return <div>{/* Render data */}</div>;
}
```

That's it! 🎉
