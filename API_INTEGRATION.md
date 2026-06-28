# API Integration Guide

This document explains how the Next.js frontend is integrated with the Node.js backend API.

## Setup

### 1. Backend Setup

First, ensure the Node.js backend is running:

```bash
cd backend-node

# Install dependencies (if not already done)
npm install

# Start MongoDB (make sure MongoDB is running)
# Windows: mongod
# Mac/Linux: sudo systemctl start mongodb

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

The frontend is already configured to connect to the backend. The API URL is set in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Authentication Flow

### Registration (Sign Up)

**Frontend:**
- User fills in name, mobile number, and password in `SignupDialog`
- Frontend calls `api.register()` from `lib/api.ts`

**Backend:**
- Endpoint: `POST /api/auth/register`
- Request body: `{ name, mobile, password }`
- Response: `{ success, token, user: { id, name, mobile, role } }`

**What happens:**
1. Backend checks if user already exists with the mobile number
2. Creates new user with hashed password
3. Generates JWT token
4. Returns token and user data
5. Frontend stores token in localStorage and sets user context

### Login

**Frontend:**
- User enters mobile number and password in `LoginDialog`
- Frontend calls `api.login()` from `lib/api.ts`

**Backend:**
- Endpoint: `POST /api/auth/login`
- Request body: `{ mobile, password }`
- Response: `{ success, token, user: { id, name, mobile, role } }`

**What happens:**
1. Backend finds user by mobile number
2. Compares password with hashed password
3. Generates JWT token
4. Returns token and user data
5. Frontend stores token in localStorage and sets user context

### Get Current User

**Frontend:**
- On app load, if token exists, calls `api.getMe()` to restore user session

**Backend:**
- Endpoint: `GET /api/auth/me`
- Headers: `Authorization: Bearer <token>`
- Response: `{ success, data: { id, name, mobile, role } }`

### Logout

**Frontend:**
- User clicks logout in `UserMenu`
- Frontend calls `api.logout()` then clears local storage

**Backend:**
- Endpoint: `POST /api/auth/logout`
- Headers: `Authorization: Bearer <token>`
- Response: `{ success, message }`

## API Service (`lib/api.ts`)

The API service provides a centralized way to communicate with the backend:

### Key Features:

1. **Token Management:** Automatically handles JWT token storage and inclusion in requests
2. **Error Handling:** Centralizes error handling for all API calls
3. **Type Safety:** Provides TypeScript interfaces for requests and responses
4. **Credentials:** Includes cookies for session management

### Available Methods:

#### Authentication
- `register(data)` - Register new user
- `login(data)` - Login user
- `getMe()` - Get current user
- `logout()` - Logout user
- `updateProfile(name)` - Update user profile
- `updatePassword(currentPassword, newPassword)` - Change password

#### Products
- `getProducts(queryParams?)` - Get all products with optional filters
- `getProductById(id)` - Get single product

#### Cart
- `getCart()` - Get user's cart
- `addToCart(productId, quantity)` - Add item to cart
- `updateCartItem(productId, quantity)` - Update cart item quantity
- `removeFromCart(productId)` - Remove item from cart
- `clearCart()` - Clear entire cart

#### Orders
- `createOrder(orderData)` - Create new order
- `getOrders()` - Get user's orders
- `getOrderById(id)` - Get single order

## Auth Context (`contexts/AuthContext.tsx`)

Manages authentication state throughout the application:

### State:
- `user` - Current logged-in user object
- `loading` - Loading state during authentication
- `isAuthenticated` - Boolean indicating if user is logged in

### Methods:
- `login(mobile, password)` - Login user
- `signup(name, mobile, password)` - Register new user
- `logout()` - Logout user

### Usage:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use authentication state and methods
}
```

## Components

### LoginDialog
- Handles user login
- Validates mobile number format (10 digits)
- Displays error messages
- Switches to SignupDialog

### SignupDialog
- Handles user registration
- Validates name, mobile number, and password
- Ensures passwords match
- Minimum password length: 6 characters
- Switches to LoginDialog

### UserMenu
- Displays logged-in user information
- Provides logout functionality
- Shows user avatar with first letter of name

## CORS Configuration

The backend is configured to accept requests from the frontend:

```javascript
// backend-node/src/app.js
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

## Security Features

1. **JWT Authentication:** Secure token-based authentication
2. **HTTP-only Cookies:** Backend sends tokens in HTTP-only cookies
3. **Password Hashing:** Passwords are hashed using bcrypt
4. **Rate Limiting:** API has rate limiting to prevent abuse
5. **Input Validation:** Server validates all inputs
6. **CORS:** Restricted to specific origins

## Testing the Integration

### 1. Start Both Servers

Terminal 1 (Backend):
```bash
cd backend-node
npm run dev
```

Terminal 2 (Frontend):
```bash
cd e-commerce
npm run dev
```

### 2. Test Sign Up

1. Open `http://localhost:3000`
2. Click "Login" button in header
3. Click "Sign up" link
4. Enter:
   - Name: Your Name
   - Mobile: 1234567890
   - Password: password123
   - Confirm Password: password123
5. Click "Sign Up"
6. You should be logged in automatically

### 3. Test Login

1. Logout if logged in
2. Click "Login" button
3. Enter:
   - Mobile: 1234567890
   - Password: password123
4. Click "Login"
5. You should be logged in

### 4. Test Persistence

1. Refresh the page
2. You should remain logged in (token is stored)

### 5. Test Logout

1. Click on your name/avatar in header
2. Click "Logout"
3. You should be logged out

## Troubleshooting

### "Failed to fetch" Error

**Problem:** Frontend cannot connect to backend

**Solutions:**
1. Ensure backend is running on `http://localhost:5000`
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Check CORS configuration in backend
4. Check browser console for detailed error

### "Invalid token" Error

**Problem:** Token expired or invalid

**Solution:**
1. Logout and login again
2. Clear localStorage: `localStorage.clear()`
3. Refresh the page

### "User already exists" Error

**Problem:** Trying to register with existing mobile number

**Solution:**
1. Use a different mobile number
2. Or login with existing credentials

### Backend Not Starting

**Problem:** MongoDB connection error

**Solution:**
1. Ensure MongoDB is installed and running
2. Check `MONGODB_URI` in `backend-node/.env`
3. For local MongoDB: `mongodb://localhost:27017/ecommerce`

## Next Steps

To extend the integration:

1. **Add to Cart Integration:** Connect cart UI to backend cart API
2. **Product Listing:** Fetch products from backend instead of mock data
3. **Order Management:** Implement checkout and order tracking
4. **Admin Panel:** Connect admin panel to backend admin endpoints
5. **Profile Management:** Add profile update functionality

## Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (`.env`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=e-commerce-backend-jwt-secret-key-change-in-production-2026
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)
- `PUT /api/auth/updateprofile` - Update profile (Protected)
- `PUT /api/auth/updatepassword` - Change password (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Cart
- `GET /api/cart` - Get user's cart (Protected)
- `POST /api/cart/add` - Add item to cart (Protected)
- `PUT /api/cart/update` - Update cart item (Protected)
- `DELETE /api/cart/remove/:productId` - Remove item (Protected)
- `DELETE /api/cart/clear` - Clear cart (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)

**Protected** = Requires Authorization header with JWT token
