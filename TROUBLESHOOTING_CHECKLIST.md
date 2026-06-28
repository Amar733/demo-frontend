# Authentication Troubleshooting Checklist

Use this checklist to quickly diagnose and fix common issues.

## ✅ Pre-Flight Checklist

Before starting, verify:

- [ ] Node.js is installed (v18+)
  ```bash
  node --version
  ```

- [ ] MongoDB is installed
  ```bash
  mongosh --version
  ```

- [ ] npm is installed
  ```bash
  npm --version
  ```

## 🔧 Backend Checklist

### MongoDB Issues

- [ ] **Is MongoDB running?**
  ```bash
  # Windows
  net start MongoDB
  
  # Mac/Linux
  brew services list  # Check if mongodb-community is started
  sudo systemctl status mongod
  ```

- [ ] **Can you connect to MongoDB?**
  ```bash
  mongosh
  # Should connect without errors
  # Type 'exit' to quit
  ```

- [ ] **Is the connection string correct?**
  ```bash
  # Check backend-node/.env
  cat backend-node/.env | grep MONGODB_URI
  # Should be: mongodb://localhost:27017/ecommerce
  ```

### Backend Server Issues

- [ ] **Are dependencies installed?**
  ```bash
  cd backend-node
  ls node_modules
  # Should list many packages
  
  # If empty, run:
  npm install
  ```

- [ ] **Does .env file exist?**
  ```bash
  cd backend-node
  ls -la .env
  # Should show .env file
  
  # If not, copy from example:
  cp .env.example .env
  ```

- [ ] **Is PORT available (5000)?**
  ```bash
  # Windows
  netstat -ano | findstr :5000
  
  # Mac/Linux
  lsof -i :5000
  
  # If port is in use, change PORT in .env or kill the process
  ```

- [ ] **Can the server start?**
  ```bash
  cd backend-node
  npm run dev
  
  # Should see:
  # ✅ MongoDB Connected: localhost
  # 🚀 E-Commerce Backend Server
  # Port: 5000
  ```

- [ ] **Is the health endpoint working?**
  ```bash
  curl http://localhost:5000/health
  # Should return: {"success":true,"message":"Server is running",...}
  
  # Or open in browser: http://localhost:5000/health
  ```

### Backend Configuration

- [ ] **JWT_SECRET is set?**
  ```bash
  cat backend-node/.env | grep JWT_SECRET
  # Should not be empty
  ```

- [ ] **CLIENT_URL is correct?**
  ```bash
  cat backend-node/.env | grep CLIENT_URL
  # Should be: http://localhost:3000
  ```

## 🎨 Frontend Checklist

### Frontend Setup

- [ ] **Are dependencies installed?**
  ```bash
  cd e-commerce
  ls node_modules
  # Should list many packages
  
  # If empty, run:
  npm install
  ```

- [ ] **Does .env.local exist?**
  ```bash
  cd e-commerce
  ls -la .env.local
  # Should show .env.local file
  
  # If not, create it:
  echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
  ```

- [ ] **Is API_URL correct?**
  ```bash
  cat e-commerce/.env.local
  # Should be: NEXT_PUBLIC_API_URL=http://localhost:5000/api
  ```

- [ ] **Is PORT available (3000)?**
  ```bash
  # Windows
  netstat -ano | findstr :3000
  
  # Mac/Linux
  lsof -i :3000
  
  # If port is in use, Next.js will ask to use different port
  ```

- [ ] **Can the server start?**
  ```bash
  cd e-commerce
  npm run dev
  
  # Should see:
  # ready - started server on 0.0.0.0:3000
  ```

- [ ] **Can you access the frontend?**
  ```
  Open browser: http://localhost:3000
  Should load the e-commerce site
  ```

### TypeScript/Build Issues

- [ ] **No TypeScript errors?**
  ```bash
  cd e-commerce
  npm run build
  # Should compile without errors
  ```

- [ ] **lib/api.ts exists?**
  ```bash
  ls e-commerce/lib/api.ts
  # Should exist
  ```

- [ ] **contexts/AuthContext.tsx updated?**
  ```bash
  grep "from '@/lib/api'" e-commerce/contexts/AuthContext.tsx
  # Should find the import
  ```

## 🔐 Authentication Testing

### Registration Test

- [ ] **Can you open signup dialog?**
  ```
  1. Go to http://localhost:3000
  2. Click "Login" button
  3. Click "Sign up" link
  Dialog should open
  ```

- [ ] **Can you submit the form?**
  ```
  1. Fill in:
     Name: Test User
     Mobile: 9876543210
     Password: test123456
     Confirm: test123456
  2. Click "Sign Up"
  ```

- [ ] **Check browser console for errors**
  ```
  Press F12 → Console tab
  Should not show red errors
  ```

- [ ] **Check Network tab**
  ```
  F12 → Network tab
  Look for: POST /api/auth/register
  Status should be: 201
  ```

- [ ] **Is user logged in after signup?**
  ```
  After signup, your name should appear in header
  ```

### Login Test

- [ ] **Can you open login dialog?**
  ```
  1. Logout if logged in
  2. Click "Login" button
  Dialog should open
  ```

- [ ] **Can you submit the form?**
  ```
  1. Enter:
     Mobile: 9876543210
     Password: test123456
  2. Click "Login"
  ```

- [ ] **Check Network tab**
  ```
  F12 → Network tab
  Look for: POST /api/auth/login
  Status should be: 200
  ```

- [ ] **Is user logged in?**
  ```
  Your name should appear in header
  ```

### Session Persistence Test

- [ ] **Session persists after refresh?**
  ```
  1. Login
  2. Press F5 (refresh)
  3. Should stay logged in
  ```

- [ ] **Check localStorage**
  ```
  F12 → Application → Local Storage → http://localhost:3000
  Should see:
  - token: <jwt_token>
  - user: {"id":"...","name":"...","mobile":"...","role":"..."}
  ```

- [ ] **Check Network on page load**
  ```
  F12 → Network tab → Refresh page
  Look for: GET /api/auth/me
  Status should be: 200
  ```

### Logout Test

- [ ] **Can you open user menu?**
  ```
  Click on your name in header
  Menu should dropdown
  ```

- [ ] **Can you logout?**
  ```
  Click "Logout"
  Should logout and return to home
  ```

- [ ] **Is localStorage cleared?**
  ```
  F12 → Application → Local Storage
  token and user should be removed
  ```

## 🐛 Common Errors & Solutions

### "Failed to fetch"

**Error:** `TypeError: Failed to fetch`

**Causes & Solutions:**

- [ ] **Backend not running**
  ```bash
  cd backend-node
  npm run dev
  ```

- [ ] **Wrong API URL in .env.local**
  ```bash
  # Should be:
  NEXT_PUBLIC_API_URL=http://localhost:5000/api
  
  # After changing, restart frontend:
  # Ctrl+C then npm run dev
  ```

- [ ] **CORS error** (check browser console)
  ```bash
  # Verify backend .env has:
  CLIENT_URL=http://localhost:3000
  
  # Restart backend after changing
  ```

### "MongoDB connection error"

**Error:** `Error connecting to MongoDB`

**Solutions:**

- [ ] **Start MongoDB**
  ```bash
  # Windows
  net start MongoDB
  
  # Mac
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongod
  ```

- [ ] **Check connection string**
  ```bash
  # In backend-node/.env:
  MONGODB_URI=mongodb://localhost:27017/ecommerce
  ```

- [ ] **Install MongoDB if not installed**
  ```
  Windows: Download from mongodb.com
  Mac: brew install mongodb-community
  Linux: sudo apt-get install mongodb
  ```

### "User already exists"

**Error:** `User already exists with this mobile number`

**Solutions:**

- [ ] **Use different mobile number**
  ```
  Try: 9999999999 instead
  ```

- [ ] **Or login with existing credentials**
  ```
  Use the mobile/password you already registered
  ```

- [ ] **Or clear database (for testing)**
  ```bash
  mongosh
  use ecommerce
  db.users.deleteMany({})
  exit
  ```

### "Invalid mobile number or password"

**Error:** Login fails with this message

**Solutions:**

- [ ] **Check mobile number**
  ```
  - Must be exactly 10 digits
  - No spaces or dashes
  - Numbers only
  ```

- [ ] **Check password**
  ```
  - Case sensitive
  - Exactly as you registered
  ```

- [ ] **Check if user exists**
  ```bash
  mongosh
  use ecommerce
  db.users.find({ mobile: "9876543210" })
  exit
  ```

### "Token invalid" or "Unauthorized"

**Error:** `401 Unauthorized`

**Solutions:**

- [ ] **Clear localStorage and login again**
  ```
  F12 → Application → Local Storage → Clear All
  Refresh page and login again
  ```

- [ ] **Check token in localStorage**
  ```
  F12 → Application → Local Storage
  Look for 'token' key
  If missing, you need to login
  ```

- [ ] **Check JWT_SECRET hasn't changed**
  ```bash
  # Don't change JWT_SECRET in backend .env
  # If you do, all existing tokens become invalid
  ```

### CORS Error

**Error:** `Access to fetch has been blocked by CORS policy`

**Solutions:**

- [ ] **Check CLIENT_URL in backend .env**
  ```bash
  cat backend-node/.env | grep CLIENT_URL
  # Should be: CLIENT_URL=http://localhost:3000
  ```

- [ ] **Restart backend after changing**
  ```bash
  cd backend-node
  # Ctrl+C to stop
  npm run dev
  ```

- [ ] **Check frontend is on port 3000**
  ```
  Should be: http://localhost:3000
  Not: http://127.0.0.1:3000
  ```

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**

- [ ] **Find and kill process**
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID_NUMBER> /F
  
  # Mac/Linux
  lsof -i :5000
  kill -9 <PID_NUMBER>
  ```

- [ ] **Or use different port**
  ```bash
  # In backend-node/.env:
  PORT=5001
  
  # Then update e-commerce/.env.local:
  NEXT_PUBLIC_API_URL=http://localhost:5001/api
  ```

## 📊 Diagnostic Commands

### Quick System Check

```bash
# Run all these commands to check your setup:

# 1. Check Node.js
node --version  # Should be v18+

# 2. Check npm
npm --version

# 3. Check MongoDB
mongosh --version

# 4. Try MongoDB connection
mongosh --eval "db.adminCommand('ping')"  # Should return { ok: 1 }

# 5. Check if backend dependencies installed
ls backend-node/node_modules | wc -l  # Should be > 50

# 6. Check if frontend dependencies installed
ls e-commerce/node_modules | wc -l  # Should be > 100

# 7. Check backend .env exists
ls backend-node/.env

# 8. Check frontend .env.local exists
ls e-commerce/.env.local

# 9. Check backend health endpoint
curl http://localhost:5000/health

# 10. Check frontend is accessible
curl http://localhost:3000
```

### View Logs

```bash
# Backend logs (in backend terminal)
cd backend-node
npm run dev
# Watch for errors in red

# Frontend logs (in frontend terminal)
cd e-commerce
npm run dev
# Watch for errors or warnings

# MongoDB logs
# Windows: Check Event Viewer → Application logs
# Mac/Linux: tail -f /usr/local/var/log/mongodb/mongo.log
```

### Database Inspection

```bash
# Connect to MongoDB
mongosh

# Switch to database
use ecommerce

# Count users
db.users.countDocuments()

# List users
db.users.find().pretty()

# Find specific user
db.users.findOne({ mobile: "9876543210" })

# Delete all users (for testing)
db.users.deleteMany({})

# Exit
exit
```

## 🆘 Still Having Issues?

If you've checked everything and still have issues:

1. **Check browser console (F12)**
   - Look for red error messages
   - Check Network tab for failed requests

2. **Check backend terminal**
   - Look for error messages
   - Verify it shows "MongoDB Connected"

3. **Check frontend terminal**
   - Look for compilation errors
   - Check for warnings

4. **Restart everything**
   ```bash
   # Stop MongoDB
   # Stop backend (Ctrl+C)
   # Stop frontend (Ctrl+C)
   
   # Start MongoDB
   # Start backend (npm run dev)
   # Start frontend (npm run dev)
   
   # Clear browser cache
   # Try again
   ```

5. **Clear everything and restart**
   ```bash
   # Clear MongoDB
   mongosh
   use ecommerce
   db.dropDatabase()
   exit
   
   # Clear browser
   F12 → Application → Clear storage → Clear site data
   
   # Restart both servers
   ```

6. **Review documentation**
   - Read `API_INTEGRATION.md` for details
   - Read `AUTHENTICATION_QUICKSTART.md` for step-by-step
   - Read `INTEGRATION_DIAGRAM.md` for architecture

## ✅ Success Indicators

When everything is working correctly, you should see:

- ✅ Backend terminal: "MongoDB Connected" and "Port: 5000"
- ✅ Frontend terminal: "ready - started server on 0.0.0.0:3000"
- ✅ Browser: No red errors in console
- ✅ Can signup new user
- ✅ Name appears in header after signup
- ✅ Can logout
- ✅ Can login again
- ✅ Session persists after refresh
- ✅ Network tab shows 200/201 status codes

Happy debugging! 🐛🔧
