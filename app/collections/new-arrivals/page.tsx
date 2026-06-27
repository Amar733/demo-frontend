import Link from 'next/link';
import { getNewArrivals } from '@/lib/products';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function NewArrivalsPage() {
  const products = getNewArrivals();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">New Arrivals</h1>
        <p className="text-lg text-gray-600">
          Explore our latest additions! Fresh fragrances that just arrived in our collection. 
          Be the first to discover these exciting new scents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-64 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-green-600">New Arrival</Badge>
                {product.specialPrice && (
                  <Badge className="absolute top-2 left-2 bg-red-600">Sale</Badge>
                )}
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
                {product.specialPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-red-600">
                      ${product.specialPrice.toFixed(2)}
                    </span>
                    <span className="text-sm line-through text-gray-500">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
                )}
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
          <p className="text-xl text-gray-600">No new arrivals at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
