# Admin Panel Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Create an Admin User

Open your browser console (F12 or Right-click → Inspect → Console) and run:

```javascript
adminSetup.createAdminUser();
```

This creates an admin user with:
- **Mobile**: `9999999999`
- **Password**: `admin123`

### Step 2: Login

1. Click "Login" in the header
2. Enter mobile: `9999999999`
3. Enter password: `admin123`
4. Click "Login"

### Step 3: Access Admin Panel

Click the "Admin Panel" link that now appears in the header, or navigate to:
```
http://localhost:3000/admin
```

## ✨ That's It!

You now have full access to:
- ✅ Create new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Search and filter products
- ✅ Manage product details (price, stock, categories, etc.)

## 📚 Need More Details?

Check out the comprehensive [ADMIN_PANEL.md](./ADMIN_PANEL.md) documentation.

## 🔧 Quick Tips

### Create a Custom Admin User
```javascript
adminSetup.createAdminUser('1234567890', 'mypassword', 'My Admin Name');
```

### Promote Existing User to Admin
```javascript
adminSetup.updateUserRole('1234567890', 'admin');
```

### List All Users
```javascript
adminSetup.listUsers();
```

## ⚠️ Important Note

This is a **demonstration implementation** using localStorage. For production:
- Use a secure backend API
- Hash passwords
- Implement proper authentication tokens
- Add server-side authorization checks

See [ADMIN_PANEL.md](./ADMIN_PANEL.md) for production considerations.
