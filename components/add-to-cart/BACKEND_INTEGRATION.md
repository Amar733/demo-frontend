# Backend Integration - Add to Cart System

The cart system has been updated to integrate with the backend API instead of using localStorage.

## Changes Made

### 1. Updated `addToCart.ts`
- Removed localStorage functions
- Added backend API integration functions:
  - `getCart()` - Fetches cart from backend
  - `addProductToCart()` - Adds product via API
  - `updateCartItemQuantity()` - Updates quantity via API
  - `removeFromCart()` - Removes item via API
  - `clearCart()` - Clears cart via API
- Added cart data transformation from backend format to frontend format
- All functions dispatch `cartUpdated` events for component synchronization

### 2. Updated `useCart.ts`
- Removed synchronous cart initialization (fixes React warning)
- Added async cart loading from backend on mount
- Added `isLoading` state to handle loading state
- Improved event listener setup

### 3. Updated `AddToCartButton.tsx`
- Added authentication check before adding to cart
- Added error handling and display
- Shows user-friendly messages for authentication errors
- Made add operation async to work with API

### 4. Updated `app/cart/page.tsx`
- Removed localStorage operations
- Using only backend API functions
- Added authentication check
- Added loading state display
- Improved error handling with user feedback

### 5. Updated `index.ts`
- Removed localStorage exports
- Added new API function exports

## Authentication Required

All cart operations now require authentication:
- Users must be logged in to add items to cart
- Cart data is stored per user on the backend
- Unauthenticated users see appropriate error messages

## API Endpoints Used

All endpoints require Bearer token authentication:

### GET /api/cart
Fetches the user's cart with populated product information.

### POST /api/cart
Adds a product to cart.
```json
{
  "productId": "string",
  "quantity": number
}
```

### PUT /api/cart/:productId
Updates item quantity.
```json
{
  "quantity": number
}
```

### DELETE /api/cart/:productId
Removes an item from cart.

### DELETE /api/cart
Clears the entire cart.

## Data Transformation

The backend returns cart data in MongoDB format with populated references. The system transforms this to match the frontend interface:

**Backend Format:**
```json
{
  "items": [
    {
      "product": {
        "_id": "...",
        "name": "...",
        ...
      },
      "quantity": 2,
      "price": 999
    }
  ]
}
```

**Frontend Format:**
```json
{
  "items": [
    {
      "product": {
        "id": "...",
        "name": "...",
        ...
      },
      "quantity": 2
    }
  ],
  "total": 1998
}
```

## Event System

The cart system maintains the custom event system for component synchronization:

**Event:** `cartUpdated`
**Detail:** Transformed cart object

This allows components like Header, Cart page, and Product listings to stay in sync when cart changes occur.

## Error Handling

All API functions include comprehensive error handling:
- Network errors are caught and logged
- Authentication errors show appropriate messages
- Stock validation is done on the backend
- User-friendly error messages are displayed

## Migration Notes

- No localStorage is used anymore
- Cart data persists on the server per user
- Users logging in from different devices see the same cart
- Cart data is not available to unauthenticated users
- Legacy localStorage cart data is not migrated (users start fresh)

## Usage Example

```tsx
import { addProductToCart, getCart } from '@/components/add-to-cart/addToCart';
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login first');
      return;
    }

    try {
      await addProductToCart(product, 1);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

## Testing Checklist

- [ ] User must be logged in to add items
- [ ] Cart items persist after page refresh (for logged-in users)
- [ ] Cart count updates in header immediately after adding
- [ ] Cart page shows correct items and totals
- [ ] Update quantity works correctly
- [ ] Remove item works correctly
- [ ] Clear cart works correctly
- [ ] Stock validation prevents adding out-of-stock items
- [ ] Error messages display for failed operations
- [ ] Multiple tabs/windows stay in sync via events
