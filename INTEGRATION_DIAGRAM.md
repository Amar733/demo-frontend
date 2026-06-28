# Authentication Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                            │
│                     http://localhost:3000                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │
┌─────────────────────────────▼────────────────────────────────────┐
│                    Next.js Frontend                              │
│                   (e-commerce folder)                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components                                              │  │
│  │  ├── LoginDialog.tsx        → Handles login form        │  │
│  │  ├── SignupDialog.tsx       → Handles signup form       │  │
│  │  └── UserMenu.tsx           → Shows user menu           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             │ uses                               │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AuthContext.tsx                                         │  │
│  │  ├── login(mobile, password)                            │  │
│  │  ├── signup(name, mobile, password)                     │  │
│  │  ├── logout()                                           │  │
│  │  └── user state management                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             │ calls                              │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  lib/api.ts (API Service)                               │  │
│  │  ├── register(data)                                     │  │
│  │  ├── login(data)                                        │  │
│  │  ├── getMe()                                            │  │
│  │  ├── logout()                                           │  │
│  │  ├── Token management                                   │  │
│  │  └── Error handling                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              │ HTTP + JWT Token
                              │ http://localhost:5000/api
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                   Express.js Backend                             │
│                  (backend-node folder)                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  app.js                                                  │  │
│  │  ├── CORS middleware                                     │  │
│  │  ├── Rate limiting                                       │  │
│  │  ├── Body parser                                         │  │
│  │  └── Cookie parser                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             │ routes to                          │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  routes/auth.js                                          │  │
│  │  POST   /api/auth/register    → register()              │  │
│  │  POST   /api/auth/login       → login()                 │  │
│  │  GET    /api/auth/me          → getMe() [Protected]     │  │
│  │  POST   /api/auth/logout      → logout() [Protected]    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             │ uses                               │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  middleware/auth.js                                      │  │
│  │  └── protect() → Verify JWT token                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             │ calls                              │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  controllers/authController.js                          │  │
│  │  ├── register() → Create user                           │  │
│  │  ├── login() → Verify credentials                       │  │
│  │  ├── getMe() → Return user data                         │  │
│  │  └── logout() → Clear cookies                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             │ interacts with                     │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  models/User.js                                          │  │
│  │  ├── User Schema (name, mobile, password, role)         │  │
│  │  ├── comparePassword() → Verify password                │  │
│  │  ├── generateToken() → Create JWT                       │  │
│  │  └── Pre-save hook → Hash password                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              │ Mongoose
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                         MongoDB                                  │
│                mongodb://localhost:27017/ecommerce               │
│                                                                  │
│  Collections:                                                    │
│  ├── users      → User documents                                │
│  ├── products   → Product documents                             │
│  ├── carts      → Cart documents                                │
│  └── orders     → Order documents                               │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Registration Flow

```
User fills form
    ↓
SignupDialog validates input (10-digit mobile, 6+ char password)
    ↓
Calls AuthContext.signup(name, mobile, password)
    ↓
AuthContext calls api.register({ name, mobile, password })
    ↓
api.ts sends POST /api/auth/register with data
    ↓
Backend routes/auth.js receives request
    ↓
Validates input with express-validator
    ↓
controllers/authController.register() is called
    ↓
Checks if user exists with mobile number
    ↓
models/User.create() creates new user
    ↓
Pre-save hook hashes password with bcrypt
    ↓
User saved to MongoDB
    ↓
User.generateToken() creates JWT token
    ↓
Returns { success: true, token, user: { id, name, mobile, role } }
    ↓
api.ts stores token in localStorage
    ↓
AuthContext sets user state
    ↓
User is logged in, name appears in header
```

### 2. User Login Flow

```
User enters credentials
    ↓
LoginDialog validates input
    ↓
Calls AuthContext.login(mobile, password)
    ↓
AuthContext calls api.login({ mobile, password })
    ↓
api.ts sends POST /api/auth/login with credentials
    ↓
Backend routes/auth.js receives request
    ↓
controllers/authController.login() is called
    ↓
Finds user by mobile number
    ↓
User.comparePassword() verifies password with bcrypt
    ↓
If valid, User.generateToken() creates JWT
    ↓
Returns { success: true, token, user }
    ↓
api.ts stores token in localStorage
    ↓
AuthContext sets user state
    ↓
User is logged in
```

### 3. Session Restoration Flow

```
Page loads / refreshes
    ↓
AuthContext useEffect runs
    ↓
Checks localStorage for token
    ↓
If token exists, calls api.getMe()
    ↓
api.ts sends GET /api/auth/me with Authorization header
    ↓
Backend middleware/auth.protect() verifies JWT token
    ↓
If valid, extracts user ID from token
    ↓
controllers/authController.getMe() finds user by ID
    ↓
Returns { success: true, data: user }
    ↓
AuthContext sets user state
    ↓
User remains logged in
```

### 4. User Logout Flow

```
User clicks logout
    ↓
UserMenu calls AuthContext.logout()
    ↓
AuthContext calls api.logout()
    ↓
api.ts sends POST /api/auth/logout with token
    ↓
Backend clears HTTP-only cookie
    ↓
Returns success
    ↓
api.ts removes token from localStorage
    ↓
AuthContext clears user state
    ↓
User is logged out
```

## Token Management

```
┌─────────────────────────────────────────────────────────────────┐
│                         JWT Token                                │
│                                                                  │
│  Created by: Backend (jsonwebtoken)                             │
│  Secret: JWT_SECRET from .env                                   │
│  Expires: 7 days (JWT_EXPIRE)                                   │
│                                                                  │
│  Payload:                                                        │
│  {                                                               │
│    id: "user_mongodb_id",                                       │
│    mobile: "9876543210",                                        │
│    role: "user",                                                │
│    iat: 1234567890,        // Issued at                         │
│    exp: 1234567890         // Expiration                        │
│  }                                                               │
│                                                                  │
│  Stored in:                                                      │
│  ├── Frontend: localStorage (key: "token")                      │
│  └── Backend: HTTP-only cookie (secure)                         │
│                                                                  │
│  Sent via:                                                       │
│  ├── Authorization header: "Bearer <token>"                     │
│  └── Cookie: Automatically with requests                        │
└──────────────────────────────────────────────────────────────────┘
```

## Request/Response Examples

### POST /api/auth/register

**Request:**
```json
{
  "name": "John Doe",
  "mobile": "9876543210",
  "password": "mypassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "mobile": "9876543210",
    "role": "user"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "User already exists with this mobile number"
}
```

### POST /api/auth/login

**Request:**
```json
{
  "mobile": "9876543210",
  "password": "mypassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "mobile": "9876543210",
    "role": "user"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid mobile number or password"
}
```

### GET /api/auth/me

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "mobile": "9876543210",
    "role": "user",
    "isActive": true,
    "createdAt": "2026-06-28T00:00:00.000Z"
  }
}
```

### POST /api/auth/logout

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Security Layers

```
┌──────────────────────────────────────────────────────────────┐
│  Layer 1: Input Validation                                   │
│  ├── Frontend: React form validation                         │
│  └── Backend: express-validator middleware                   │
├──────────────────────────────────────────────────────────────┤
│  Layer 2: CORS Protection                                    │
│  └── Only allows requests from http://localhost:3000         │
├──────────────────────────────────────────────────────────────┤
│  Layer 3: Rate Limiting                                      │
│  └── Max 100 requests per 15 minutes per IP                  │
├──────────────────────────────────────────────────────────────┤
│  Layer 4: Password Security                                  │
│  ├── Minimum 6 characters                                    │
│  ├── Hashed with bcrypt (10 salt rounds)                     │
│  └── Never returned in API responses                         │
├──────────────────────────────────────────────────────────────┤
│  Layer 5: JWT Authentication                                 │
│  ├── Signed with secret key                                  │
│  ├── 7-day expiration                                        │
│  └── Verified on protected routes                            │
├──────────────────────────────────────────────────────────────┤
│  Layer 6: HTTP-only Cookies                                  │
│  ├── Not accessible via JavaScript                           │
│  ├── Secure flag in production                               │
│  └── SameSite: strict                                        │
├──────────────────────────────────────────────────────────────┤
│  Layer 7: Secure Headers                                     │
│  └── Helmet.js sets security headers                         │
└──────────────────────────────────────────────────────────────┘
```

## File Structure

```
e-commerce/
├── .env.local                     ← API_URL configuration
├── lib/
│   └── api.ts                     ← API service (NEW)
├── contexts/
│   └── AuthContext.tsx            ← Auth state management (UPDATED)
└── components/login/
    ├── LoginDialog.tsx            ← Login form
    ├── SignupDialog.tsx           ← Signup form (UPDATED)
    └── UserMenu.tsx               ← User menu

backend-node/
├── .env                           ← Backend configuration
├── src/
│   ├── app.js                     ← Express app setup
│   ├── server.js                  ← Server startup
│   ├── controllers/
│   │   └── authController.js      ← Auth logic
│   ├── routes/
│   │   └── auth.js                ← Auth routes
│   ├── middleware/
│   │   └── auth.js                ← JWT verification
│   ├── models/
│   │   └── User.js                ← User schema
│   └── config/
│       └── database.js            ← MongoDB connection
```

## State Management

```
AuthContext State:
├── user: User | null              ← Current logged-in user
│   ├── id: string
│   ├── name: string
│   ├── mobile: string
│   └── role: 'user' | 'admin'
├── loading: boolean               ← Loading state
└── isAuthenticated: boolean       ← Login status

localStorage:
├── token: string                  ← JWT token
└── user: string (JSON)            ← User object cache
```

## Error Handling

```
Frontend (api.ts):
├── Network errors → "An error occurred"
├── HTTP errors → Response error message
└── JSON parse errors → "An error occurred"

Backend:
├── Validation errors → 400 with field details
├── Authentication errors → 401 Unauthorized
├── Not found errors → 404
├── Server errors → 500
└── All errors logged to console
```

---

This diagram provides a comprehensive visual representation of how the authentication system works from user interaction to database storage.
