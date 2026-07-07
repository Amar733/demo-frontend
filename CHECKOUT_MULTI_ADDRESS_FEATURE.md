# Checkout Page - Multiple Address Management

## Overview
The checkout page now supports adding multiple shipping addresses and selecting which one to use for delivery.

## Features

### 1. **Auto-fill from Profile**
   - Full Name: Auto-fills from `user.name`
   - Mobile Number: Auto-fills from `user.mobile`
   - Shows green checkmark (✓) when auto-filled

### 2. **Multiple Address Management**
   - ➕ **Add New Address**: Click "Add New Address" button
   - 📍 **Use Current Location**: Auto-fill address using GPS
   - 🏷️ **Label Addresses**: Name addresses (Home, Office, etc.)
   - ✅ **Select Address**: Click on any saved address to select for delivery
   - 🗑️ **Delete Address**: Remove unwanted addresses

### 3. **Location Picker Integration**
   - Click "Use My Current Location" button in the add address form
   - GPS coordinates are automatically converted to a physical address
   - Address fields are auto-filled (street, city, state, postal code, country)

### 4. **Visual Feedback**
   - Selected address is highlighted in blue with a checkmark
   - Hover effects on address cards
   - Empty state message when no addresses exist
   - Icons for better UX (MapPin, Plus, Check, Trash)

## User Flow

1. **Contact Information** (auto-filled from profile)
   - Full Name ✓
   - Mobile Number ✓

2. **Shipping Address**
   - Click "Add New Address"
   - Optional: Click "Use My Current Location" to auto-fill
   - Enter Address Label (e.g., "Home", "Office")
   - Fill/Edit address fields
   - Click "Save Address"

3. **Select Delivery Address**
   - Click on the address card you want to use
   - Selected address shows blue border and checkmark

4. **Place Order**
   - Review order summary
   - Click "Place Order" button

## Component Structure

```
CheckoutPage
├── Contact Information
│   ├── Full Name (auto-filled)
│   └── Mobile Number (auto-filled)
│
├── Shipping Address
│   ├── "Add New Address" button
│   │
│   ├── Saved Addresses List
│   │   ├── Address Card (selectable, deletable)
│   │   ├── Address Card
│   │   └── ...
│   │
│   ├── Add Address Form (toggle)
│   │   ├── LocationPicker component
│   │   ├── Address Label
│   │   ├── Address fields
│   │   └── Save/Cancel buttons
│   │
│   └── Empty State (if no addresses)
│
├── Payment
└── Place Order Button
```

## State Management

- `savedAddresses`: Array of saved address objects
- `selectedAddressId`: Currently selected address for delivery
- `showAddressForm`: Toggle add address form visibility

## Validation

- Full Name: Required
- Mobile: Required (10-15 digits)
- Address Fields: All required when saving
- Delivery Address: Must select one before placing order

## Future Enhancements

- [ ] Persist addresses to backend/database
- [ ] Set default address
- [ ] Edit existing addresses
- [ ] Address validation/verification service
- [ ] Show delivery cost based on address
- [ ] Map view for address selection
