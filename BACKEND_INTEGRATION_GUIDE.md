# Backend Integration Guide

## Overview
This guide explains how the frontend is integrated with the backend-node API server.

## Configuration

### Backend Server
- **Base URL**: `http://localhost:5000`
- **API Base**: `http://localhost:5000/api`
- **Port**: 5000 (configurable in `backend-node/.env`)

### Frontend Configuration

#### Environment Variables
Location: `e-commerce/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### API Configuration
Location: `e-commerce/components/config/api.ts`

The API configuration exports:
- `API_BASE_URL`: Base URL for all API calls
- `API_ENDPOINTS`: Object containing all API endpoints organized by feature

```typescript
import { API_BASE_URL, API_ENDPOINTS } from '@/components/config/api';

// Example usage
const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

## Authentication Integration

### useAuth Hook
Location: `e-commerce/hook/useAuth.ts`

The custom hook provides complete authentication functionality:

```typescript
import { useAuth } from '@/hook/useAuth';

function MyComponent() {
  const { 
    user,              // Current user object or null
    isAuthenticated,   // Boolean authentication status
    isLoading,         // Loading state
    error,             // Error message if any
    login,             // Login function
    register,          // Register function
    logout,            // Logout function
    checkAuth          // Manual auth check function
  } = useAuth();

  // Login example
  const handleLogin = async () => {
    const result = await login({ email: 'user@example.com', password: 'pass123' });
    if (result.success) {
      console.log('Logged in:', result.user);
    } else {
      console.error('Login failed:', result.error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Authentication Flow

1. **Token Storage**: JWT tokens are stored in `localStorage`
2. **Auto Check**: On mount, the hook checks if a valid token exists and fetches user data
3. **API Requests**: Include token in Authorization header:
   ```typescript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   }
   ```

### Updated Components

The following components have been updated to use the new backend:

#### LoginDialog (`e-commerce/components/login/LoginDialog.tsx`)
- Uses email instead of mobile number
- Integrates with `useAuth` hook
- Proper error handling

#### SignupDialog (`e-commerce/components/login/SignupDialog.tsx`)
- Uses email instead of mobile number
- Integrates with `useAuth` hook
- Password validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove cart item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `GET /api/orders` - List user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

## Making Authenticated Requests

### Using Fetch API
```typescript
const token = localStorage.getItem('token');

const response = await fetch(API_ENDPOINTS.CART.GET, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  credentials: 'include', // Include cookies
});

const data = await response.json();
```

### Error Handling
```typescript
try {
  const response = await fetch(endpoint, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
} catch (error) {
  console.error('API Error:', error);
  // Handle error appropriately
}
```

## Testing the Integration

### Start Backend Server
```bash
cd backend-node
npm install
npm run dev
```

The server will start on `http://localhost:5000`

### Start Frontend
```bash
cd e-commerce
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

### Test Authentication
1. Open `http://localhost:3000`
2. Click "Sign Up" to create an account
3. Fill in the form and submit
4. You should be logged in automatically
5. Check browser console and Network tab to see API calls

### Verify Backend Connection
- Check backend logs for incoming requests
- Use browser DevTools Network tab to inspect API calls
- Verify tokens are being stored in localStorage
- Check that authenticated endpoints return user-specific data

## Common Issues

### CORS Errors
Make sure `CLIENT_URL` in `backend-node/.env` matches your frontend URL:
```env
CLIENT_URL=http://localhost:3000
```

### Authentication Not Persisting
- Check if token is stored in localStorage
- Verify token format in Authorization header
- Check backend JWT_SECRET is set correctly

### API Not Found (404)
- Verify backend server is running
- Check API_BASE_URL in frontend matches backend URL
- Ensure endpoint paths match backend routes

## Next Steps

1. **Add Cart Integration**: Update cart components to use backend API
2. **Add Order Management**: Integrate order creation and history
3. **Add Protected Routes**: Implement route guards for authenticated pages
4. **Add Token Refresh**: Implement automatic token refresh before expiry
5. **Add Loading States**: Show loading indicators during API calls
6. **Add Error Boundaries**: Handle API errors gracefully

## Security Notes

- Never commit `.env` files with real secrets
- Use HTTPS in production
- Implement CSRF protection for state-changing operations
- Set appropriate CORS policies
- Use secure, httpOnly cookies for refresh tokens in production
- Validate and sanitize all user inputs
- Implement rate limiting on sensitive endpoints
