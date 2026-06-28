# Admin Panel Documentation

## Overview
The admin panel allows users with the `admin` role to perform CRUD (Create, Read, Update, Delete) operations on products in the e-commerce store.

## Features

### Authentication & Authorization
- Only users with `role: 'admin'` can access the admin panel
- Regular users are redirected to the homepage
- Admin status is verified on page load

### Product Management

#### Create Products
1. Click the "Add New Product" button
2. Fill in the required fields:
   - Name *
   - Description *
   - Price (in cents) *
   - Product Type *
   - Category *
   - Stock *
   - Image URL *
3. Optional fields:
   - Collection (summer, royal, special-pricing, new-arrivals)
   - Gender (male, female, unisex)
   - Special Price (discounted price in cents)
   - New Arrival checkbox
4. Click "Save Product"

#### Edit Products
1. Click the "Edit" button on any product card
2. Modify the fields as needed
3. Click "Save Product" to apply changes
4. Click "Cancel" to discard changes

#### Delete Products
1. Click the "Delete" button on any product card
2. Confirm the deletion in the popup dialog
3. Product is permanently removed

#### Search & Filter
- **Search**: Filter products by name or description
- **Filter by Type**: View products of a specific type (perfume, tea, coffee, etc.)
- Real-time filtering as you type

## Creating an Admin User

### Method 1: Using Browser Console (Recommended for Testing)

1. Open your browser's developer console (F12 or Right-click → Inspect → Console)
2. Run one of the following commands:

```javascript
// Create default admin user
// Mobile: 9999999999, Password: admin123
adminSetup.createAdminUser();

// Or create custom admin user
adminSetup.createAdminUser('1234567890', 'mypassword', 'John Admin');
```

3. Log in with the created credentials

### Method 2: Manual Creation

1. Sign up a regular user account
2. Open browser console
3. Run the following commands:

```javascript
// View all users
adminSetup.listUsers();

// Update a user's role to admin (replace with actual mobile number)
adminSetup.updateUserRole('1234567890', 'admin');
```

4. Log out and log back in

## Admin Utility Functions

The following functions are available in the browser console:

### `adminSetup.createAdminUser(mobile?, password?, name?)`
Creates a new admin user.
- **mobile**: Phone number (default: '9999999999')
- **password**: Password (default: 'admin123')
- **name**: Display name (default: 'Admin User')

```javascript
adminSetup.createAdminUser('9876543210', 'securepass', 'Admin Smith');
```

### `adminSetup.listUsers()`
Lists all users in the system with their roles.

```javascript
adminSetup.listUsers();
```

### `adminSetup.updateUserRole(mobile, newRole)`
Changes a user's role between 'admin' and 'user'.
- **mobile**: User's mobile number
- **newRole**: 'admin' or 'user'

```javascript
adminSetup.updateUserRole('9876543210', 'admin');
```

### `adminSetup.deleteUser(mobile)`
Deletes a user from the system.
- **mobile**: User's mobile number

```javascript
adminSetup.deleteUser('9876543210');
```

## Data Storage

### Products
- Stored in `localStorage` under the key `'products'`
- Each product has a unique ID generated using timestamp
- Products persist across sessions

### Users
- Stored in `localStorage` under the key `'users'`
- Each user has:
  - `id`: Unique identifier
  - `name`: Display name
  - `mobile`: Phone number (used for login)
  - `password`: Plain text (should be hashed in production)
  - `role`: 'admin' or 'user'

## Security Considerations

⚠️ **Important**: This implementation uses localStorage and client-side validation for demonstration purposes.

### For Production Use:
1. **Backend API**: All CRUD operations should go through a secure backend API
2. **Password Hashing**: Never store passwords in plain text
3. **JWT/Sessions**: Use proper authentication tokens
4. **Role-Based Access Control (RBAC)**: Implement server-side permission checks
5. **Input Validation**: Validate and sanitize all inputs on the server
6. **HTTPS**: Use secure connections
7. **Rate Limiting**: Prevent abuse of admin endpoints
8. **Audit Logs**: Track all admin actions
9. **Environment Variables**: Store sensitive configuration securely

## Accessing the Admin Panel

1. Navigate to `/admin` route: `http://localhost:3000/admin`
2. You must be logged in as an admin user
3. If not authenticated or not an admin, you'll be redirected to the homepage

## Testing Guide

### Step 1: Create Admin User
```javascript
// In browser console
adminSetup.createAdminUser();
```

### Step 2: Login
- Mobile: `9999999999`
- Password: `admin123`

### Step 3: Navigate to Admin Panel
- Go to `http://localhost:3000/admin`

### Step 4: Test CRUD Operations
1. **Create**: Add a new test product
2. **Read**: View all products and use search/filter
3. **Update**: Edit an existing product
4. **Delete**: Remove a test product

## Troubleshooting

### Can't Access Admin Panel
- Verify you're logged in: Check if user info appears in the header
- Verify admin role: Run `adminSetup.listUsers()` in console to check role
- Clear localStorage and recreate admin user if needed:
  ```javascript
  localStorage.clear();
  adminSetup.createAdminUser();
  ```

### Products Not Saving
- Check browser console for errors
- Verify localStorage is not full (5-10MB limit)
- Ensure all required fields are filled

### Lost Admin Access
```javascript
// Create new admin user
adminSetup.createAdminUser('emergency', 'admin123', 'Emergency Admin');
```

## API Integration (Future)

To integrate with a backend API, update the following functions in `app/admin/page.tsx`:

```typescript
// Replace localStorage calls with API calls
const saveProducts = async (updatedProducts: Product[]) => {
  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProducts),
  });
};

const handleDelete = async (id: string) => {
  await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
};
```

## Additional Features to Consider

- [ ] Bulk import/export products (CSV/JSON)
- [ ] Image upload functionality
- [ ] Product categories management
- [ ] Order management
- [ ] User management interface
- [ ] Analytics dashboard
- [ ] Product inventory alerts
- [ ] Multi-language support
- [ ] Product variants (sizes, colors)
- [ ] Discount codes management

## Support

For issues or questions, refer to the main project documentation or contact the development team.
