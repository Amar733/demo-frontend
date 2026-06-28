import { Product } from '@/types';
import { api } from './api';

// All available categories organized by product type
export const allCategories = {
  perfume: [
    'French perfumes',
    'Arabic perfumes',
    'Japanese-inspired fragrances',
    'Korean fragrances',
    'Travel-size perfumes',
    'Fresh',
    'Citrus',
    'Oriental',
    'Floral',
    'Woody',
    'Leather',
    'Fruity'
  ],
  tea: [
    'Japanese Matcha',
    'Sencha',
    'Genmaicha',
    'Hojicha',
    'Premium Indian teas',
    'Black Tea',
    'Green Tea',
    'Herbal Tea',
    'Oolong Tea',
    'White Tea'
  ],
  coffee: [
    'Japanese-style coffee',
    'Single-origin coffee',
    'Instant premium coffee',
    'Cold brew',
    'Coffee beans',
    'Light Roast',
    'Medium Roast',
    'Dark Roast',
    'Flavored',
    'Decaf',
    'Espresso'
  ],
  powerbank: [
    'Fast charging',
    'Magnetic (MagSafe-compatible)',
    'Slim travel power banks',
    'High-capacity (20,000mAh+)'
  ],
  earbuds: [
    'Budget',
    'Gaming',
    'ANC (Active Noise Cancellation)',
    'Sports',
    'Premium wireless'
  ],
  toy: [
    'Educational',
    'Plush',
    'Puzzle',
    'Remote Control',
    'Creative'
  ],
  accessory: [
    'Cotton',
    'Silk',
    'Linen'
  ],
  bottle: [
    'Insulated',
    'Glass',
    'Sports',
    'Smart',
    'Travel',
    'Metal'
  ],
  study: [
    'Notebooks',
    'Pens',
    'Electronics',
    'Highlighters',
    'Planners',
    'Office Supplies',
    'Organization',
    'Pencils',
    'Binders',
    'Study Aids',
    'Lighting'
  ]
};

export const productsByCategory = {
  perfume: [
    {
      id: '1',
      name: 'Ocean Breeze',
      description: 'Fresh aquatic scent perfect for summer',
      price: 6499,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
      category: 'Fresh',
      stock: 35,
      collection: 'summer',
      gender: 'unisex' as const,
      productType: 'perfume' as const
    },
    {
      id: '2',
      name: 'Citrus Burst',
      description: 'Energizing blend of lemon, orange and bergamot',
      price: 5699,
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80',
      category: 'Citrus',
      stock: 60,
      collection: 'summer',
      specialPrice: 4999,
      gender: 'unisex' as const,
      productType: 'perfume' as const
    },
    {
      id: '3',
      name: 'Midnight Oud',
      description: 'Deep and mysterious oriental fragrance',
      price: 10799,
      image: 'https://images.unsplash.com/photo-1597070920565-32e67deeb4e8?auto=format&fit=crop&w=600&q=80',
      category: 'Oriental',
      stock: 20,
      collection: 'royal',
      gender: 'male' as const,
      productType: 'perfume' as const
    },
    {
      id: '4',
      name: 'Rose Champagne',
      description: 'Sparkling rose with champagne bubbles and peach',
      price: 8999,
      image: 'https://images.unsplash.com/photo-1563170351-be823bc3f5f2?auto=format&fit=crop&w=600&q=80',
      category: 'Floral',
      stock: 37,
      gender: 'female' as const,
      productType: 'perfume' as const,
      isNewArrival: true
    },
    {
      id: '5',
      name: 'Lavender Fields',
      description: 'Calming lavender with herbal undertones',
      price: 6199,
      specialPrice: 4999,
      image: 'https://images.unsplash.com/photo-1584044029317-fd272b49474b?auto=format&fit=crop&w=600&q=80',
      category: 'Floral',
      stock: 40,
      gender: 'unisex' as const,
      productType: 'perfume' as const
    },
    {
      id: '6',
      name: 'Black Orchid Dream',
      description: 'Sensual black orchid with dark chocolate and truffle',
      price: 11199,
      image: 'https://images.unsplash.com/photo-1593079834290-43aba9e5cc69?auto=format&fit=crop&w=600&q=80',
      category: 'Floral',
      stock: 24,
      gender: 'female' as const,
      productType: 'perfume' as const
    },
    {
      id: '7',
      name: 'Sandalwood Essence',
      description: 'Warm sandalwood with hints of vanilla and musk',
      price: 7499,
      image: 'https://images.unsplash.com/photo-1607346256330-dee4af15a9e0?auto=format&fit=crop&w=600&q=80',
      category: 'Woody',
      stock: 45,
      collection: 'royal',
      gender: 'male' as const,
      productType: 'perfume' as const,
      isNewArrival: true
    },
    {
      id: '8',
      name: 'Jasmine Night',
      description: 'Exotic jasmine with amber and white musk',
      price: 7899,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
      category: 'Floral',
      stock: 32,
      gender: 'female' as const,
      productType: 'perfume' as const,
      specialPrice: 6599,
    },
    {
      id: '9',
      name: 'Leather & Tobacco',
      description: 'Bold masculine scent with leather and tobacco notes',
      price: 9999,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
      category: 'Leather',
      stock: 28,
      collection: 'royal',
      gender: 'male' as const,
      productType: 'perfume' as const
    },
    {
      id: '10',
      name: 'Wild Berry Bliss',
      description: 'Sweet and fruity with blackberry and raspberry',
      price: 5399,
      image: 'https://images.unsplash.com/photo-1595394531850-301d4f98cc3b?auto=format&fit=crop&w=600&q=80',
      category: 'Fruity',
      stock: 55,
      collection: 'summer',
      gender: 'female' as const,
      productType: 'perfume' as const,
      isNewArrival: true
    }
  ],
  tea: [
    {
      id: '100',
      name: 'Earl Grey Premium',
      description: 'Classic black tea infused with bergamot oil',
      price: 299,
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
      category: 'Black Tea',
      stock: 150,
      productType: 'tea' as const,
      isNewArrival: true
    },
    {
      id: '101',
      name: 'Green Tea Sencha',
      description: 'Japanese green tea with fresh, grassy notes',
      price: 399,
      image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80',
      category: 'Green Tea',
      stock: 120,
      productType: 'tea' as const
    },
    {
      id: '102',
      name: 'Chamomile Dreams',
      description: 'Soothing herbal tea for relaxation',
      price: 249,
      image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=600&q=80',
      category: 'Herbal Tea',
      stock: 180,
      productType: 'tea' as const,
      specialPrice: 199
    },
    {
      id: '103',
      name: 'Jasmine Pearl Tea',
      description: 'Hand-rolled green tea pearls with jasmine flowers',
      price: 499,
      image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80',
      category: 'Green Tea',
      stock: 95,
      productType: 'tea' as const
    },
    {
      id: '104',
      name: 'Peppermint Fresh',
      description: 'Refreshing peppermint herbal tea',
      price: 199,
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80',
      category: 'Herbal Tea',
      stock: 200,
      productType: 'tea' as const
    },
    {
      id: '105',
      name: 'Oolong Golden',
      description: 'Semi-oxidized tea with complex flavor',
      price: 449,
      image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=600&q=80',
      category: 'Oolong Tea',
      stock: 110,
      productType: 'tea' as const,
      isNewArrival: true
    },
    {
      id: '106',
      name: 'English Breakfast',
      description: 'Robust black tea blend perfect for mornings',
      price: 349,
      image: 'https://images.unsplash.com/photo-1584302179602-e6d44cd91da7?auto=format&fit=crop&w=600&q=80',
      category: 'Black Tea',
      stock: 165,
      productType: 'tea' as const
    },
    {
      id: '107',
      name: 'White Peony Tea',
      description: 'Delicate white tea with subtle sweetness',
      price: 549,
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
      category: 'White Tea',
      stock: 80,
      productType: 'tea' as const,
      isNewArrival: true
    },
    {
      id: '108',
      name: 'Masala Chai',
      description: 'Spiced Indian tea with cardamom, cinnamon, and ginger',
      price: 349,
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b14537f7b?auto=format&fit=crop&w=600&q=80',
      category: 'Black Tea',
      stock: 145,
      productType: 'tea' as const,
      specialPrice: 299
    },
    {
      id: '109',
      name: 'Matcha Premium',
      description: 'Ceremonial grade Japanese matcha powder',
      price: 699,
      image: 'https://images.unsplash.com/photo-1591782452984-5d1e5db0d7b6?auto=format&fit=crop&w=600&q=80',
      category: 'Green Tea',
      stock: 90,
      productType: 'tea' as const,
      isNewArrival: true
    },
    {
      id: '110',
      name: 'Rooibos Red Tea',
      description: 'Naturally caffeine-free South African red tea',
      price: 299,
      image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=600&q=80',
      category: 'Herbal Tea',
      stock: 155,
      productType: 'tea' as const
    },
    {
      id: '111',
      name: 'Ginger Turmeric Tea',
      description: 'Wellness blend with ginger and turmeric',
      price: 349,
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
      category: 'Herbal Tea',
      stock: 130,
      productType: 'tea' as const,
      specialPrice: 299
    }
  ],
  toy: [
    {
      id: '200',
      name: 'Wooden Building Blocks Set',
      description: 'Educational 50-piece wooden blocks for creative play',
      price: 2499,
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7462?auto=format&fit=crop&w=600&q=80',
      category: 'Educational',
      stock: 75,
      productType: 'toy' as const
    },
    {
      id: '201',
      name: 'Plush Teddy Bear',
      description: 'Soft and cuddly teddy bear, perfect for all ages',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a4e2?auto=format&fit=crop&w=600&q=80',
      category: 'Plush',
      stock: 120,
      productType: 'toy' as const,
      specialPrice: 1599
    },
    {
      id: '202',
      name: 'STEM Robot Kit',
      description: 'Build and program your own robot - ages 8+',
      price: 3999,
      image: 'https://images.unsplash.com/photo-1581092335797-6a5d4b4d4f8d?auto=format&fit=crop&w=600&q=80',
      category: 'Educational',
      stock: 60,
      productType: 'toy' as const,
      isNewArrival: true
    },
    {
      id: '203',
      name: 'Puzzle World Map',
      description: '500-piece educational puzzle of world geography',
      price: 1599,
      image: 'https://images.unsplash.com/photo-1585314062604-1a357de8b000?auto=format&fit=crop&w=600&q=80',
      category: 'Puzzle',
      stock: 85,
      productType: 'toy' as const
    },
    {
      id: '204',
      name: 'Remote Control Car',
      description: 'High-speed RC car with rechargeable battery',
      price: 3299,
      image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80',
      category: 'Remote Control',
      stock: 50,
      productType: 'toy' as const
    },
    {
      id: '205',
      name: 'Art & Craft Set',
      description: 'Complete art supplies for creative kids',
      price: 2899,
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
      category: 'Creative',
      stock: 90,
      productType: 'toy' as const,
      isNewArrival: true
    }
  ],
  accessory: [
    {
      id: '300',
      name: 'Cotton Handkerchief Set',
      description: 'Pack of 6 pure cotton handkerchiefs',
      price: 499,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=600&q=80',
      category: 'Cotton',
      stock: 200,
      productType: 'accessory' as const
    },
    {
      id: '301',
      name: 'Silk Pocket Square',
      description: 'Luxury silk pocket square for formal wear',
      price: 899,
      image: 'https://images.unsplash.com/photo-1585851944382-d6fc19fefb86?auto=format&fit=crop&w=600&q=80',
      category: 'Silk',
      stock: 150,
      productType: 'accessory' as const,
      gender: 'male' as const
    },
    {
      id: '302',
      name: 'Embroidered Handkerchief',
      description: 'Elegant embroidered linen handkerchief',
      price: 699,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=600&q=80',
      category: 'Linen',
      stock: 175,
      productType: 'accessory' as const,
      isNewArrival: true
    },
    {
      id: '303',
      name: 'Monogrammed Handkerchief Set',
      description: 'Personalized cotton handkerchiefs - set of 3',
      price: 799,
      image: 'https://images.unsplash.com/photo-1585851944382-d6fc19fefb86?auto=format&fit=crop&w=600&q=80',
      category: 'Cotton',
      stock: 130,
      productType: 'accessory' as const,
      specialPrice: 599
    }
  ],
  bottle: [
    {
      id: '400',
      name: 'Stainless Steel Water Bottle',
      description: '32oz insulated bottle keeps drinks cold for 24hrs',
      price: 2499,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
      category: 'Insulated',
      stock: 180,
      productType: 'bottle' as const,
      isNewArrival: true
    },
    {
      id: '401',
      name: 'Glass Water Bottle',
      description: 'Eco-friendly borosilicate glass bottle with sleeve',
      price: 1899,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
      category: 'Glass',
      stock: 150,
      productType: 'bottle' as const
    },
    {
      id: '402',
      name: 'Sports Water Bottle',
      description: 'BPA-free plastic bottle with flip straw - 24oz',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1573674237132-554e7cc6c324?auto=format&fit=crop&w=600&q=80',
      category: 'Sports',
      stock: 250,
      productType: 'bottle' as const,
      specialPrice: 999
    },
    {
      id: '403',
      name: 'Smart Water Bottle',
      description: 'LED reminder to stay hydrated - tracks intake',
      price: 3299,
      image: 'https://images.unsplash.com/photo-1573674237132-554e7cc6c324?auto=format&fit=crop&w=600&q=80',
      category: 'Smart',
      stock: 95,
      productType: 'bottle' as const,
      isNewArrival: true
    },
    {
      id: '404',
      name: 'Collapsible Water Bottle',
      description: 'Space-saving silicone bottle for travel',
      price: 1599,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
      category: 'Travel',
      stock: 160,
      productType: 'bottle' as const
    },
    {
      id: '405',
      name: 'Copper Water Bottle',
      description: 'Traditional copper bottle with health benefits',
      price: 2899,
      image: 'https://images.unsplash.com/photo-1573674237132-554e7cc6c324?auto=format&fit=crop&w=600&q=80',
      category: 'Metal',
      stock: 120,
      productType: 'bottle' as const
    }
  ],
  coffee: [
    {
      id: '600',
      name: 'Ethiopian Yirgacheffe',
      description: 'Light roast with floral and citrus notes, single origin',
      price: 499,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
      category: 'Light Roast',
      stock: 140,
      productType: 'coffee' as const,
      isNewArrival: true
    },
    {
      id: '601',
      name: 'Colombian Supremo',
      description: 'Medium roast with smooth, balanced flavor and nutty undertones',
      price: 449,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
      category: 'Medium Roast',
      stock: 180,
      productType: 'coffee' as const
    },
    {
      id: '602',
      name: 'Italian Dark Roast',
      description: 'Bold, rich dark roast perfect for espresso',
      price: 499,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      category: 'Dark Roast',
      stock: 160,
      productType: 'coffee' as const,
      specialPrice: 399
    },
    {
      id: '603',
      name: 'French Vanilla Coffee',
      description: 'Smooth medium roast with natural vanilla flavor',
      price: 399,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      category: 'Flavored',
      stock: 200,
      productType: 'coffee' as const
    },
    {
      id: '604',
      name: 'Decaf Swiss Water Process',
      description: 'Chemical-free decaf with full coffee flavor',
      price: 449,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
      category: 'Decaf',
      stock: 130,
      productType: 'coffee' as const
    },
    {
      id: '605',
      name: 'Hazelnut Delight',
      description: 'Premium coffee with rich hazelnut notes',
      price: 399,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
      category: 'Flavored',
      stock: 175,
      productType: 'coffee' as const,
      specialPrice: 349
    },
    {
      id: '606',
      name: 'Espresso Blend',
      description: 'Rich blend designed for perfect espresso shots',
      price: 549,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      category: 'Espresso',
      stock: 150,
      productType: 'coffee' as const,
      isNewArrival: true
    },
    {
      id: '607',
      name: 'Breakfast Blend',
      description: 'Light, bright morning coffee to start your day',
      price: 349,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
      category: 'Light Roast',
      stock: 220,
      productType: 'coffee' as const
    }
  ],
  powerbank: [
    {
      id: '700',
      name: 'MagSafe Power Bank 5000mAh',
      description: 'Magnetic wireless charging power bank for iPhone',
      price: 3499,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
      category: 'Magnetic (MagSafe-compatible)',
      stock: 85,
      productType: 'powerbank' as const,
      isNewArrival: true
    },
    {
      id: '701',
      name: 'Fast Charge Power Bank 10000mAh',
      description: 'Quick charge 3.0 compatible with dual USB ports',
      price: 2499,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
      category: 'Fast charging',
      stock: 120,
      productType: 'powerbank' as const
    },
    {
      id: '702',
      name: 'Slim Travel Power Bank 5000mAh',
      description: 'Ultra-slim design fits in your pocket',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
      category: 'Slim travel power banks',
      stock: 150,
      productType: 'powerbank' as const,
      specialPrice: 1699
    },
    {
      id: '703',
      name: 'High-Capacity Power Bank 20000mAh',
      description: 'Charge multiple devices with massive capacity',
      price: 4999,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
      category: 'High-capacity (20,000mAh+)',
      stock: 65,
      productType: 'powerbank' as const
    },
    {
      id: '704',
      name: 'Solar Power Bank 15000mAh',
      description: 'Eco-friendly with solar charging panel',
      price: 3999,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
      category: 'Fast charging',
      stock: 75,
      productType: 'powerbank' as const,
      isNewArrival: true
    },
    {
      id: '705',
      name: 'MagSafe Power Bank 10000mAh',
      description: 'Premium magnetic power bank with LED display',
      price: 5499,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
      category: 'Magnetic (MagSafe-compatible)',
      stock: 55,
      productType: 'powerbank' as const
    }
  ],
  earbuds: [
    {
      id: '800',
      name: 'Budget Wireless Earbuds',
      description: 'Affordable true wireless earbuds with great sound',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      category: 'Budget',
      stock: 200,
      productType: 'earbuds' as const,
      specialPrice: 1599
    },
    {
      id: '801',
      name: 'Gaming Earbuds Low Latency',
      description: 'Ultra-low latency for mobile gaming',
      price: 3499,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      category: 'Gaming',
      stock: 95,
      productType: 'earbuds' as const,
      isNewArrival: true
    },
    {
      id: '802',
      name: 'ANC Pro Earbuds',
      description: 'Active noise cancellation with transparency mode',
      price: 6999,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      category: 'ANC (Active Noise Cancellation)',
      stock: 80,
      productType: 'earbuds' as const
    },
    {
      id: '803',
      name: 'Sports Waterproof Earbuds',
      description: 'IPX7 waterproof with ear hooks for secure fit',
      price: 2999,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      category: 'Sports',
      stock: 130,
      productType: 'earbuds' as const
    },
    {
      id: '804',
      name: 'Premium Wireless Earbuds',
      description: 'Hi-Fi sound with premium build quality',
      price: 8999,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      category: 'Premium wireless',
      stock: 60,
      productType: 'earbuds' as const,
      isNewArrival: true
    },
    {
      id: '805',
      name: 'ANC Lite Earbuds',
      description: 'Affordable noise cancellation for daily commute',
      price: 4999,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      category: 'ANC (Active Noise Cancellation)',
      stock: 110,
      productType: 'earbuds' as const,
      specialPrice: 4499
    },
    {
      id: '806',
      name: 'Gaming RGB Earbuds',
      description: 'RGB lighting with 65ms ultra-low latency',
      price: 3999,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      category: 'Gaming',
      stock: 85,
      productType: 'earbuds' as const
    },
    {
      id: '807',
      name: 'Running Earbuds',
      description: 'Lightweight sports earbuds with ambient mode',
      price: 2499,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      category: 'Sports',
      stock: 145,
      productType: 'earbuds' as const
    }
  ],
  study: [
    {
      id: '500',
      name: 'Premium Notebook Set',
      description: '3-pack hardcover notebooks with premium paper',
      price: 799,
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
      category: 'Notebooks',
      stock: 200,
      productType: 'study' as const
    },
    {
      id: '501',
      name: 'Gel Pen Set - 12 Colors',
      description: 'Smooth writing gel pens in vibrant colors',
      price: 399,
      image: 'https://images.unsplash.com/photo-1609094013299-ea73428a3081?auto=format&fit=crop&w=600&q=80',
      category: 'Pens',
      stock: 300,
      productType: 'study' as const,
      specialPrice: 299
    },
    {
      id: '502',
      name: 'Scientific Calculator',
      description: 'Advanced calculator for mathematics and science',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
      category: 'Electronics',
      stock: 85,
      productType: 'study' as const
    },
    {
      id: '503',
      name: 'Highlighter Set',
      description: '8-pack chisel tip highlighters in assorted colors',
      price: 249,
      image: 'https://images.unsplash.com/photo-1609094013299-ea73428a3081?auto=format&fit=crop&w=600&q=80',
      category: 'Highlighters',
      stock: 350,
      productType: 'study' as const
    },
    {
      id: '504',
      name: 'Study Planner 2026',
      description: 'Academic planner with goal-setting features',
      price: 599,
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
      category: 'Planners',
      stock: 150,
      productType: 'study' as const,
      isNewArrival: true
    },
    {
      id: '505',
      name: 'Sticky Notes Bundle',
      description: 'Assorted sizes and colors sticky notes set',
      price: 449,
      image: 'https://images.unsplash.com/photo-1609094013299-ea73428a3081?auto=format&fit=crop&w=600&q=80',
      category: 'Office Supplies',
      stock: 280,
      productType: 'study' as const
    },
    {
      id: '506',
      name: 'Desk Organizer Set',
      description: 'Bamboo desk organizer with multiple compartments',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
      category: 'Organization',
      stock: 95,
      productType: 'study' as const
    },
    {
      id: '507',
      name: 'Mechanical Pencil Set',
      description: 'Professional 0.5mm mechanical pencils with lead refills',
      price: 499,
      image: 'https://images.unsplash.com/photo-1609094013299-ea73428a3081?auto=format&fit=crop&w=600&q=80',
      category: 'Pencils',
      stock: 220,
      productType: 'study' as const
    },
    {
      id: '508',
      name: 'Binder Set with Dividers',
      description: '3-ring binders with color-coded dividers',
      price: 699,
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
      category: 'Binders',
      stock: 180,
      productType: 'study' as const,
      specialPrice: 599
    },
    {
      id: '509',
      name: 'Flashcard Set',
      description: 'Blank flashcards with ring - 200 cards',
      price: 349,
      image: 'https://images.unsplash.com/photo-1609094013299-ea73428a3081?auto=format&fit=crop&w=600&q=80',
      category: 'Study Aids',
      stock: 240,
      productType: 'study' as const
    },
    {
      id: '510',
      name: 'LED Desk Lamp',
      description: 'Adjustable LED lamp with USB charging port',
      price: 1799,
      image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
      category: 'Lighting',
      stock: 110,
      productType: 'study' as const,
      isNewArrival: true
    }
  ]
};

// Flatten all products into a single array
export const products: Product[] = [
  ...productsByCategory.perfume,
  ...productsByCategory.tea,
  ...productsByCategory.coffee,
  ...productsByCategory.powerbank,
  ...productsByCategory.earbuds,
  ...productsByCategory.toy,
  ...productsByCategory.accessory,
  ...productsByCategory.bottle,
  ...productsByCategory.study
];

// API-based functions
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await api.getProducts();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return products; // Fallback to local data
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const response = await api.getProductById(id);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return products.find(p => p.id === id); // Fallback
  }
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/collection/${collection}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products by collection:', error);
    return products.filter(p => p.collection === collection); // Fallback
  }
}

export async function getNewArrivals(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/filter/new-arrivals`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return products.filter(p => p.isNewArrival === true); // Fallback
  }
}

export async function getSpecialPricingProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/filter/special-pricing`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching special pricing products:', error);
    return products.filter(p => p.specialPrice !== undefined); // Fallback
  }
}

export async function getProductsByType(type: 'perfume' | 'tea' | 'coffee' | 'powerbank' | 'earbuds' | 'toy' | 'accessory' | 'bottle' | 'study'): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/type/${type}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products by type:', error);
    return products.filter(p => p.productType === type); // Fallback
  }
}

// Synchronous helper functions
export function getProductsByGender(gender: 'male' | 'female' | 'unisex'): Product[] {
  return products.filter(p => p.gender === gender);
}

export function getProductsByCategory(productType: keyof typeof allCategories): string[] {
  return allCategories[productType] || [];
}

// Local sync versions for backward compatibility
export function getProductsSync(): Product[] {
  return products;
}

export function getProductByIdSync(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByTypeSync(type: string): Product[] {
  return products.filter(p => p.productType === type);
}
