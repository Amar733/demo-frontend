# Admin Panel for E-Commerce

## Quick Start (3 Steps)

1. **Create Admin**
   ```javascript
   // In browser console (F12)
   adminSetup.createAdminUser();
   ```

2. **Login**
   - Mobile: `9999999999`
   - Password: `admin123`

3. **Access**
   - Click "Admin Panel" in header
   - Or go to: `http://localhost:3000/admin`

## Features

✅ Create products  
✅ Edit products  
✅ Delete products  
✅ Search & filter  
✅ Role-based access  
✅ Responsive design  

## Documentation

- **Quick Start**: [ADMIN_QUICK_START.md](./ADMIN_QUICK_START.md)
- **Full Guide**: [ADMIN_PANEL.md](./ADMIN_PANEL.md)
- **Setup Complete**: [ADMIN_SETUP_COMPLETE.md](./ADMIN_SETUP_COMPLETE.md)
- **Technical Details**: [ADMIN_IMPLEMENTATION_SUMMARY.md](./ADMIN_IMPLEMENTATION_SUMMARY.md)

## Admin Utilities

Available in browser console as `adminSetup.*`:

```javascript
// Create admin user
adminSetup.createAdminUser('mobile', 'password', 'Name');

// List all users
adminSetup.listUsers();

// Change user role
adminSetup.updateUserRole('mobile', 'admin');

// Delete user
adminSetup.deleteUser('mobile');
```

## File Structure

```
app/admin/page.tsx              # Admin panel UI
lib/adminSetup.ts               # Admin utilities
components/AdminSetupLoader.tsx # Loader component
contexts/AuthContext.tsx        # Auth with roles
```

## Security Note

⚠️ This uses localStorage for demonstration. For production:
- Use backend API
- Hash passwords
- Implement JWT/sessions
- Add server-side validation

## Support

See documentation files for detailed information on features, troubleshooting, and production deployment.
