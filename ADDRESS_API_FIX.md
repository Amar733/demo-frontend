# Address API URL Fix

## Issue
The API URL was being duplicated, resulting in:
```
http://localhost:5000/api/http://localhost:5000/api/api/users/addresses
```

## Root Cause
The `API_BASE_URL` constant already includes `/api` at the end:
```typescript
API_BASE_URL = 'http://localhost:5000/api'
```

But in the checkout page, we were adding `/api` again:
```typescript
authFetch(`${API_BASE_URL}/api/users/addresses`) // WRONG
```

## Solution
Remove the extra `/api` prefix from all user address endpoint calls:

### Before:
```typescript
authFetch(`${API_BASE_URL}/api/users/addresses`)
authFetch(`${API_BASE_URL}/api/users/addresses/${id}`)
```

### After:
```typescript
authFetch(`${API_BASE_URL}/users/addresses`)
authFetch(`${API_BASE_URL}/users/addresses/${id}`)
```

## Updated Files
1. ✅ `e-commerce/app/checkout/page.tsx` - Fixed all 3 API calls
2. ✅ `e-commerce/components/config/api.ts` - Added USERS endpoints to API_ENDPOINTS

## Correct URLs
Now the API calls will use the correct URLs:
- GET addresses: `http://localhost:5000/api/users/addresses`
- POST address: `http://localhost:5000/api/users/addresses`
- DELETE address: `http://localhost:5000/api/users/addresses/{id}`

## Testing
1. Start the backend: `cd backend-node && npm start`
2. Start the frontend: `cd e-commerce && npm run dev`
3. Login to the app
4. Go to checkout page
5. Click "Add New Address"
6. Fill in address details (or use location picker)
7. Click "Save Address"
8. Address should now be saved to the database ✅

## API Endpoints Available
- `GET /api/users/addresses` - Get all user addresses
- `POST /api/users/addresses` - Add new address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `PUT /api/users/addresses/:id/set-default` - Set default address
