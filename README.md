# E-Shop - Complete E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 16, React 19, TypeScript, and Tailwind CSS. Shop for diverse products including perfumes, coffee, tea, toys, water bottles, study materials, and accessories.

## 🌟 Features

### Product Categories
- **Perfumes** - 10 luxury fragrances (Fresh, Floral, Oriental, Woody, Leather)
- **Coffee** - 8 premium coffee blends (Light, Medium, Dark Roast, Flavored, Espresso)
- **Tea** - 12 varieties (Black, Green, White, Herbal, Oolong, Matcha)
- **Toys & Games** - 6 educational and fun toys
- **Water Bottles** - 6 different styles (Insulated, Glass, Smart, Sports)
- **Study Materials** - 11 essential school/office supplies
- **Accessories** - 4 handkerchief collections

### Key Functionality
- ✅ **Advanced Search** - Real-time product search by name, description, or category
- ✅ **Smart Filtering** - Filter by product type/category
- ✅ **Multiple Sort Options** - Sort by name, price (low/high), newest arrivals
- ✅ **Shopping Cart** - Add/remove items, quantity management
- ✅ **Product Collections** - New Arrivals, Special Pricing, Seasonal Collections
- ✅ **Responsive Design** - Optimized for mobile, tablet, and desktop
- ✅ **Special Offers** - Dynamic pricing with sale badges
- ✅ **Stock Management** - Real-time inventory tracking
- ✅ **Gender Filtering** - Filter perfumes by male/female/unisex

### UI/UX Enhancements
- 🎨 Modern gradient hero section
- 🏷️ Category quick-access cards with emojis
- 🔍 Real-time search with clear button
- 💫 Smooth horizontal scrolling product carousels
- 🏷️ Sale and New badges on products
- 📊 Product count display
- 🖼️ Image hover effects
- 📱 Fully responsive layout
- 🦶 Comprehensive footer with newsletter signup

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd perfume
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
├── app/
│   ├── api/products/         # API routes
│   ├── cart/                 # Shopping cart page
│   ├── checkout/             # Checkout flow
│   ├── collections/          # Product collections
│   │   ├── new-arrivals/
│   │   ├── royal/
│   │   ├── special-pricing/
│   │   └── summer/
│   ├── products/             # Product listing and details
│   │   └── [id]/             # Dynamic product pages
│   ├── layout.tsx            # Root layout with header/footer
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # Reusable UI components (shadcn/ui)
│   ├── CartItem.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   ├── cart.ts               # Cart management logic
│   ├── products.ts           # Product data and utilities
│   └── utils.ts              # Helper functions
├── types/
│   └── index.ts              # TypeScript type definitions
└── public/                   # Static assets

```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.7 (App Router)
- **React**: 19.2.4
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Carousel**: Embla Carousel React
- **Linting**: ESLint

## 📦 Product Data Structure

Products are organized by category in `lib/products.ts`:

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  collection?: string;
  isNewArrival?: boolean;
  specialPrice?: number;
  gender?: 'male' | 'female' | 'unisex';
  productType: 'perfume' | 'tea' | 'coffee' | 'toy' | 'accessory' | 'bottle' | 'study';
}
```

## 🎯 Key Pages

- `/` - Homepage with featured products and categories
- `/products` - All products with search, filter, and sort
- `/products/[id]` - Individual product details
- `/cart` - Shopping cart
- `/collections/new-arrivals` - Latest products
- `/collections/special-pricing` - Sale items

## 🔧 Utility Functions

```typescript
getProducts()                    // Get all products
getProductById(id)               // Get single product
getProductsByType(type)          // Filter by product type
getProductsByCollection(name)    // Filter by collection
getNewArrivals()                 // Get new arrival products
getSpecialPricingProducts()      // Get products on sale
getProductsByGender(gender)      // Filter perfumes by gender
```

## 🎨 Customization

### Adding New Products

Edit `lib/products.ts` and add to the appropriate category array:

```typescript
{
  id: 'unique-id',
  name: 'Product Name',
  description: 'Product description',
  price: 99.99,
  specialPrice: 79.99,  // Optional sale price
  image: 'image-url',
  category: 'Category Name',
  stock: 100,
  productType: 'coffee',
  isNewArrival: true,    // Optional
}
```

### Adding New Categories

1. Add to `productsByCategory` object in `lib/products.ts`
2. Update the `productType` union type in `types/index.ts`
3. Add filter button in `app/products/page.tsx`
4. Add section in homepage `app/page.tsx`

## 📝 License

This project is private and not licensed for public use.

## 🤝 Contributing

This is a private project. Contact the maintainers for contribution guidelines.

## 📧 Support

For support, email support@eshop.com

---

**Total Products**: 90+  
**Price Range**: $8.99 - $134.99  
**Built with** ❤️ **using Next.js**
