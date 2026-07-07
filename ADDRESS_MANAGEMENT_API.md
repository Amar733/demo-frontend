# Address Management API

## Overview
User addresses are now persisted in the database using MongoDB. Users can save multiple addresses and select them during checkout.

## Backend Implementation

### User Model (`backend-node/src/models/User.js`)
The User model now includes an `addresses` array with the following schema:

```javascript
addresses: [{
  label: String,          // e.g., "Home", "Office"
  street: String,         // Required
  city: String,           // Required
  state: String,          // Required
  postalCode: String,     // Required
  country: String,        // Required
  fullAddress: String,    // Auto-generated
  isDefault: Boolean,     // Default address flag
  createdAt: Date
}]
```

### API Endpoints

All endpoints require authentication (JWT token in Authorization header).

#### 1. Get User Addresses
```
GET /api/users/addresses
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64abc123...",
      "label": "Home",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA",
      "fullAddress": "123 Main St, New York, NY 10001, USA",
      "isDefault": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 2. Add New Address
```
POST /api/users/addresses
```

**Request Body:**
```json
{
  "label": "Home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "_id": "64abc123...",
    "label": "Home",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "fullAddress": "123 Main St, New York, NY 10001, USA",
    "isDefault": true
  }
}
```

#### 3. Update Address
```
PUT /api/users/addresses/:addressId
```

**Request Body:**
```json
{
  "label": "Office",
  "street": "456 Business Ave",
  "city": "Boston",
  "state": "MA",
  "postalCode": "02101",
  "country": "USA",
  "isDefault": true
}
```

#### 4. Delete Address
```
DELETE /api/users/addresses/:addressId
```

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

#### 5. Set Default Address
```
PUT /api/users/addresses/:addressId/set-default
```

**Response:**
```json
{
  "success": true,
  "message": "Default address set successfully",
  "data": {
    "_id": "64abc123...",
    "label": "Home",
    "isDefault": true
  }
}
```

## Frontend Implementation

### Checkout Page (`e-commerce/app/checkout/page.tsx`)

#### Features:
- Fetches saved addresses on page load
- Auto-selects default address if available
- Allows adding new addresses with location picker
- Displays all saved addresses in selectable cards
- Allows deleting addresses
- Shows loading states during API calls

#### Key Functions:

**fetchAddresses()**
- Fetches user addresses from API
- Auto-selects default address
- Called on component mount

**handleSaveAddress()**
- Validates address fields
- Sends POST request to save address
- Refreshes address list
- Auto-selects newly added address

**handleDeleteAddress(id)**
- Confirms deletion with user
- Sends DELETE request
- Refreshes address list
- Clears selection if deleted address was selected

## Data Flow

1. **Page Load**
   - Component mounts
   - `fetchAddresses()` called
   - GET request to `/api/users/addresses`
   - Addresses displayed in UI
   - Default address auto-selected

2. **Add Address**
   - User clicks "Add New Address"
   - Form appears with LocationPicker
   - User fills/auto-fills address
   - Clicks "Save Address"
   - POST request to `/api/users/addresses`
   - List refreshes with new address

3. **Select Address**
   - User clicks on address card
   - `selectedAddressId` updated
   - UI shows blue border and checkmark
   - Address used for order submission

4. **Delete Address**
   - User clicks trash icon
   - Confirmation prompt
   - DELETE request to `/api/users/addresses/:id`
   - List refreshes

## Authentication

All API requests use the `authFetch` function from `AuthContext`:
- Automatically includes JWT token in headers
- Handles token refresh if needed
- Throws errors for unauthorized requests

Example:
```typescript
const response = await authFetch(`${API_BASE_URL}/api/users/addresses`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(addressData)
});
```

## Error Handling

- API errors are caught and logged to console
- User-friendly alerts shown for failures
- Loading states prevent duplicate submissions
- Form validation before API calls

## Future Enhancements

- [ ] Address validation service (verify real addresses)
- [ ] Geocoding for more accurate location
- [ ] Edit existing addresses
- [ ] Bulk address import
- [ ] Address sharing between users (family/business)
- [ ] Delivery instructions field
- [ ] Contact person per address
- [ ] Map view for address visualization
