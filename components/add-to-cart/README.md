# Add to Cart Components

A complete set of components and utilities for managing shopping cart functionality with localStorage persistence.

## Components

### 1. AddToCartButton
A button component that adds products to the cart.

```tsx
import { AddToCartButton } from '@/components/add-to-cart';

<AddToCartButton 
  product={product} 
  quantity={1}
  variant="default"
  size="default"
  className="w-full"
  showIcon={true}
/>
```

**Props:**
- `product` (Product, required): The product to add to cart
- `quantity` (number, optional): Quantity to add (default: 1)
- `variant` ('default' | 'secondary' | 'outline', optional): Button style
- `size` ('default' | 'sm' | 'lg' | 'icon', optional): Button size
- `className` (string, optional): Additional CSS classes
- `showIcon` (boolean, optional): Show cart icon (default: true)

### 2. ProductCard
A card component that displays product information with add to cart functionality.

```tsx
import { ProductCard } from '@/components/add-to-cart';

<ProductCard 
  product={product}
  showAddToCart={true}
/>
```

**Props:**
- `product` (Product, required): The product to display
- `showAddToCart` (boolean, optional): Show add to cart button (default: true)

### 3. ProductGrid
A grid wrapper for displaying multiple products.

```tsx
import { ProductGrid } from '@/components/add-to-cart';

<ProductGrid 
  products={products}
  showAddToCart={true}
/>
```

**Props:**
- `products` (Product[], required): Array of products to display
- `showAddToCart` (boolean, optional): Show add to cart buttons (default: true)

## Utilities

### addProductToCart
Adds a product to the cart and saves to localStorage.

```tsx
import { addProductToCart } from '@/components/add-to-cart';

const updatedCart = addProductToCart(product, quantity);
```

### getCartFromStorage
Retrieves the cart from localStorage.

```tsx
import { getCartFromStorage } from '@/components/add-to-cart';

const cart = getCartFromStorage();
```

### saveCartToStorage
Saves the cart to localStorage and triggers a 'cartUpdated' event.

```tsx
import { saveCartToStorage } from '@/components/add-to-cart';

saveCartToStorage(cart);
```

### getCartItemCount
Gets the total number of items in the cart.

```tsx
import { getCartItemCount } from '@/components/add-to-cart';

const count = getCartItemCount();
```

### clearCart
Clears all items from the cart.

```tsx
import { clearCart } from '@/components/add-to-cart';

clearCart();
```

## Hook

### useCart
A React hook for managing cart state with automatic updates.

```tsx
'use client';

import { useCart } from '@/components/add-to-cart';

function MyComponent() {
  const { cart, itemCount, total } = useCart();
  
  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: {total}</p>
    </div>
  );
}
```

**Returns:**
- `cart` (Cart): The current cart object
- `itemCount` (number): Total number of items in cart
- `total` (number): Total price of all items

## Usage Example

### Basic Product Display with Add to Cart

```tsx
'use client';

import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/add-to-cart';

export default function ProductsPage() {
  const products = getProducts();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
```

### Custom Implementation

```tsx
'use client';

import { Product } from '@/types';
import { AddToCartButton, useCart } from '@/components/add-to-cart';

export default function CustomProduct({ product }: { product: Product }) {
  const { itemCount } = useCart();
  
  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <AddToCartButton product={product} />
      <p>Cart has {itemCount} items</p>
    </div>
  );
}
```

## Events

The cart system dispatches a custom `cartUpdated` event whenever the cart changes. This allows components across your app to stay synchronized:

```tsx
window.addEventListener('cartUpdated', (event: CustomEvent) => {
  console.log('Cart updated:', event.detail);
});
```

## localStorage Structure

The cart is stored in localStorage under the key `ecommerce_cart`:

```json
{
  "items": [
    {
      "product": { /* Product object */ },
      "quantity": 2
    }
  ],
  "total": 12998
}
```
