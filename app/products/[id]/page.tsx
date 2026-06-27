import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/currency';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square relative bg-gray-100 rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-2">{product.category}</p>
          <p className="text-3xl font-bold mb-6">{formatPrice(product.price)}</p>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <p className="text-sm text-gray-600 mb-6">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
