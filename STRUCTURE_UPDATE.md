# Product Structure Update

## Overview
Reorganized the product data structure to group products by category in a more maintainable format.

## New Structure

### File: `lib/products.ts`

Products are now organized in a `productsByCategory` object with the following keys:

```typescript
export const productsByCategory = {
  perfume: Product[],  // 6 perfume products
  tea: Product[],      // 6 tea products
  toy: Product[],      // 6 toy products
  accessory: Product[], // 4 handkerchief/accessory products
  bottle: Product[],   // 6 water bottle products
  study: Product[]     // 11 study material products
}
```

### Benefits

1. **Better Organization**: Products are grouped by type, making it easier to find and maintain
2. **Easier Updates**: Adding new products to a specific category is straightforward
3. **Category-Specific Features**: Can easily implement category-specific logic
4. **Homepage Sections**: Each category can be rendered as a separate section

## Homepage Implementation

### Separate Sections by Category

The homepage (`app/page.tsx`) now renders products in distinct sections:

1. **Perfumes Section** - Displays perfumes with scrollable carousel
2. **Tea Collection Section** - Shows all tea products
3. **Toys & Games Section** - Displays toys
4. **Handkerchiefs & Accessories Section** - Shows accessories
5. **Water Bottles Section** - Displays bottles
6. **Study Materials Section** - Shows study-related products

### Features per Section

- **Horizontal Scrolling**: Each section has a scrollable carousel
- **Navigation Arrows**: Left/right arrows to scroll through products
- **View All Link**: Each section has a "View All" link to the products page
- **Product Cards**: Display image, name, description, price, special pricing, and "New" badges

### Component Structure

```typescript
<ProductSection 
  title="Section Title"
  products={productsByCategory.categoryName}
  viewAllLink="/products"
/>
```

## Backward Compatibility

The existing functions still work:
- `getProducts()` - Returns all products (flattened array)
- `getProductById(id)` - Find by ID
- `getProductsByCollection(collection)` - Filter by collection
- `getNewArrivals()` - Get new arrivals
- `getSpecialPricingProducts()` - Get items with special pricing
- `getProductsByType(type)` - Filter by product type

## Usage Examples

### Import Category-Specific Products
```typescript
import { productsByCategory } from '@/lib/products';

// Use specific category
const perfumes = productsByCategory.perfume;
const teas = productsByCategory.tea;
```

### Import All Products
```typescript
import { getProducts } from '@/lib/products';

const allProducts = getProducts();
```

### Import Filtered Products
```typescript
import { getProductsByType } from '@/lib/products';

const toys = getProductsByType('toy');
```

## Files Modified

1. `lib/products.ts` - Reorganized product data structure
2. `app/page.tsx` - Updated to render category sections
3. `types/index.ts` - Already has proper Product interface

## Visual Layout

```
Hero Section
├── Welcome message
└── Shop Now button

Perfumes Section (6 items)
├── Horizontal scrollable carousel
└── View All link

Tea Collection Section (6 items)
├── Horizontal scrollable carousel
└── View All link

Toys & Games Section (6 items)
├── Horizontal scrollable carousel
└── View All link

Handkerchiefs & Accessories Section (4 items)
├── Horizontal scrollable carousel
└── View All link

Water Bottles Section (6 items)
├── Horizontal scrollable carousel
└── View All link

Study Materials Section (11 items)
├── Horizontal scrollable carousel
└── View All link
```

## Next Steps

Potential enhancements:
1. Add category-specific landing pages (e.g., `/category/tea`)
2. Implement category-based filtering on products page
3. Add "Shop by Category" navigation menu
4. Create featured products per category
5. Add category-specific promotions/banners
