import Link from 'next/link';
import { getProductsByCollection } from '@/lib/products';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function RoyalCollectionPage() {
  const products = getProductsByCollection('royal');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Royal Collection</h1>
        <p className="text-lg text-gray-600">
          Experience luxury and opulence with our Royal Collection. These premium fragrances 
          feature the finest ingredients and complex compositions fit for royalty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden border-2 border-amber-200">
            <CardHeader className="p-0">
              <div className="relative h-64 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isNewArrival && (
                  <Badge className="absolute top-2 right-2 bg-green-600">New</Badge>
                )}
                <Badge className="absolute top-2 left-2 bg-amber-600">Royal</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="mb-2">{product.name}</CardTitle>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="secondary" className="capitalize">{product.gender}</Badge>
              </div>
              <div className="mt-3">
                <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href={`/products/${product.id}`} className="w-full">
                <Button className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No products available in this collection yet.</p>
        </div>
      )}
    </div>
  );
}
