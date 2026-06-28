# Authentication Quick Start Guide

This guide will help you test the authentication integration between the Next.js frontend and Node.js backend.

## Prerequisites

- Node.js (v18+)
- MongoDB installed and running
- npm or yarn

## Step 1: Start MongoDB

### Windows
```bash
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod
```

### Mac/Linux
```bash
# Using systemd
sudo systemctl start mongodb

# Or using Homebrew
brew services start mongodb-community

# Or run mongod directly
mongod --config /usr/local/etc/mongod.conf
```

### Verify MongoDB is Running
```bash
# Try connecting with mongosh
mongosh

# You should see connection successful
# Type 'exit' to close
```

## Step 2: Start Backend Server

Open a terminal in the backend directory:

```bash
cd backend-node

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

You should see:
```
╔════════════════════════════════════════════════════╗
║   🚀 E-Commerce Backend Server                    ║
║   Environment: development                        ║
║   Port: 5000                                      ║
║   Database: MongoDB                               ║
╚════════════════════════════════════════════════════╝
```

**Test the backend:**
```bash
# Open browser or use curl
curl http://localhost:5000/health

# You should see:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

## Step 3: Start Frontend Server

Open a NEW terminal in the frontend directory:

```bash
cd e-commerce

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Step 4: Test Authentication

### A. Test Sign Up (Registration)

1. **Open Browser:** Navigate to `http://localhost:3000`

2. **Open Sign Up Dialog:**
   - Click the "Login" button in the header
   - Click "Sign up" link at the bottom

3. **Fill in the Form:**
   ```
   Name: John Doe
   Mobile Number: 9876543210
   Password: test123456
   Confirm Password: test123456
   ```

4. **Submit:**
   - Click "Sign Up" button
   - You should see your name in the header (logged in automatically)

5. **Verify in Backend:**
   The backend will log the registration. Check your backend terminal for:
   ```
   POST /api/auth/register 201
   ```

### B. Test Logout

1. **Click on your name** in the header (top right)
2. **Click "Logout"** from the dropdown menu
3. You should be logged out
4. The "Login" button should appear again

### C. Test Login

1. **Open Login Dialog:**
   - Click "Login" button in header

2. **Fill in the Form:**
   ```
   Mobile Number: 9876543210
   Password: test123456
   ```

3. **Submit:**
   - Click "Login" button
   - You should be logged in
   - Your name appears in header

4. **Verify in Backend:**
   Check backend terminal for:
   ```
   POST /api/auth/login 200
   ```

### D. Test Session Persistence

1. **While logged in, refresh the page** (F5 or Cmd+R)
2. You should **remain logged in**
3. Your name should still appear in the header

This works because:
- JWT token is stored in localStorage
- On page load, the app calls `/api/auth/me` to restore session

### E. Test Error Handling

**Test 1: Invalid Mobile Number**
```
Mobile: 123  (less than 10 digits)
Result: "Please enter a valid 10-digit mobile number"
```

**Test 2: Short Password**
```
Password: 12345  (less than 6 characters)
Result: "Password must be at least 6 characters long"
```

**Test 3: Password Mismatch**
```
Password: test123456
Confirm: test654321
Result: "Passwords do not match"
```

**Test 4: Existing User**
```
Try to sign up with: 9876543210 again
Result: "User already exists with this mobile number"
```

**Test 5: Wrong Password**
```
Mobile: 9876543210
Password: wrongpassword
Result: "Invalid mobile number or password"
```

**Test 6: Non-existent User**
```
Mobile: 1111111111  (not registered)
Password: anything
Result: "Invalid mobile number or password"
```

## Step 5: Verify Database

You can verify users are being created in MongoDB:

```bash
# Connect to MongoDB
mongosh

# Switch to ecommerce database
use ecommerce

# List all users
db.users.find().pretty()

# You should see your registered user
# Password will be hashed (bcrypt)

# Exit
exit
```

## Architecture Overview

```
Frontend (Next.js - Port 3000)
    ↓
lib/api.ts (API Service)
    ↓
HTTP Request with JWT Token
    ↓
Backend (Express - Port 5000)
    ↓
middleware/auth.js (Verify Token)
    ↓
controllers/authController.js
    ↓
models/User.js
    ↓
MongoDB Database
```

## API Endpoints Being Used

### Public Endpoints (No Authentication Required)
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account

### Protected Endpoints (Require JWT Token)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/updateprofile` - Update user profile
- `PUT /api/auth/updatepassword` - Change password

## How Authentication Works

### 1. Registration Flow
```
User fills form → Frontend validates → POST /api/auth/register
→ Backend creates user (hashed password) → Returns JWT token
→ Frontend stores token → User logged in
```

### 2. Login Flow
```
User fills form → Frontend validates → POST /api/auth/login
→ Backend finds user → Compares passwords → Returns JWT token
→ Frontend stores token → User logged in
```

### 3. Session Restoration Flow
```
Page loads → Frontend checks localStorage for token
→ If token exists → GET /api/auth/me (with token)
→ Backend verifies token → Returns user data
→ Frontend restores user state
```

### 4. Logout Flow
```
User clicks logout → POST /api/auth/logout
→ Backend clears cookie → Frontend clears localStorage
→ User logged out
```

## Token Storage

The authentication uses **two storage mechanisms**:

1. **HTTP-only Cookie (Backend):**
   - Set by backend with `httpOnly: true`
   - Not accessible via JavaScript
   - Sent automatically with requests

2. **localStorage (Frontend):**
   - Stores JWT token
   - Used in Authorization header
   - Allows session restoration

Both are used for defense in depth.

## Security Features

✅ **Password Hashing:** bcryptjs with salt rounds
✅ **JWT Tokens:** Signed tokens with secret key
✅ **HTTP-only Cookies:** Protection against XSS
✅ **Input Validation:** Server-side validation
✅ **Rate Limiting:** Prevents brute force attacks
✅ **CORS Protection:** Restricted origins
✅ **Secure Headers:** Helmet.js middleware

## Common Issues & Solutions

### Issue: "Failed to fetch"
**Cause:** Backend not running or wrong URL
**Solution:**
```bash
# Check backend is running
curl http://localhost:5000/health

# Check .env.local has correct URL
cat e-commerce/.env.local
# Should show: NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Issue: "MongoDB connection error"
**Cause:** MongoDB not running
**Solution:**
```bash
# Start MongoDB
# Windows: net start MongoDB
# Mac/Linux: brew services start mongodb-community

# Verify it's running
mongosh
```

### Issue: "CORS error"
**Cause:** Frontend URL not in CORS whitelist
**Solution:**
```bash
# Check backend .env
cat backend-node/.env
# Should have: CLIENT_URL=http://localhost:3000
```

### Issue: "Token expired"
**Cause:** Token expired (7 days by default)
**Solution:**
```
1. Logout
2. Clear browser localStorage (F12 → Application → Storage → Clear)
3. Login again
```

### Issue: "User remains logged in after closing browser"
**Cause:** Intended behavior - token persists
**Solution:**
```
This is by design. To prevent:
- Use sessionStorage instead of localStorage (requires code change)
- Or reduce JWT_EXPIRE in backend .env
```

## Testing Checklist

- [ ] Backend server starts successfully
- [ ] Frontend server starts successfully
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Name appears in header when logged in
- [ ] Session persists after page refresh
- [ ] Can logout successfully
- [ ] Cannot register with same mobile twice
- [ ] Cannot login with wrong password
- [ ] Mobile number validation works
- [ ] Password validation works
- [ ] Error messages display correctly

## Next Steps

Once authentication is working:

1. **Connect Cart System** - Use authenticated API calls for cart operations
2. **Connect Products** - Fetch products from backend instead of mock data
3. **Add Orders** - Implement order creation and tracking
4. **Admin Panel** - Restrict admin features to admin role users
5. **Profile Page** - Add user profile management

## Development Tools

### Browser DevTools
```
F12 → Application Tab
- Local Storage: Check stored token and user
- Network Tab: Monitor API requests
- Console: View errors and logs
```

### MongoDB Compass (GUI)
```
Connection String: mongodb://localhost:27017
Database: ecommerce
Collections: users, products, carts, orders
```

### Postman/Thunder Client
Test API endpoints directly:
```
POST http://localhost:5000/api/auth/register
Body: { "name": "Test", "mobile": "9999999999", "password": "test123" }
```

## Useful Commands

```bash
# Check if backend is running
curl http://localhost:5000/health

# Check MongoDB status
mongosh --eval "db.adminCommand('ping')"

# View backend logs
cd backend-node && npm run dev

# View frontend logs
cd e-commerce && npm run dev

# Clear all test data
mongosh
use ecommerce
db.users.deleteMany({})
exit
```

## Support

If you encounter issues:

1. Check backend terminal for errors
2. Check frontend terminal for errors
3. Check browser console (F12)
4. Verify MongoDB is running
5. Check `.env` and `.env.local` files
6. Read `API_INTEGRATION.md` for details

Happy coding! 🚀
