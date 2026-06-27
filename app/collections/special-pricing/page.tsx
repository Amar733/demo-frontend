import Link from 'next/link';
import { getSpecialPricingProducts } from '@/lib/products';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function SpecialPricingPage() {
  const products = getSpecialPricingProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Special Pricing</h1>
        <p className="text-lg text-gray-600">
          Limited time offers on selected fragrances! Don&apos;t miss out on these amazing deals. 
          Premium scents at unbeatable prices - while stocks last!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const discount = product.specialPrice 
            ? Math.round(((product.price - product.specialPrice) / product.price) * 100)
            : 0;

          return (
            <Card key={product.id} className="overflow-hidden border-2 border-red-200">
              <CardHeader className="p-0">
                <div className="relative h-64 w-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-red-600 text-lg px-3 py-1">
                    {discount}% OFF
                  </Badge>
                  {product.isNewArrival && (
                    <Badge className="absolute top-2 left-2 bg-green-600">New</Badge>
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
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-red-600">
                      ${product.specialPrice?.toFixed(2)}
                    </span>
                    <span className="text-lg line-through text-gray-500">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 font-semibold mt-1">
                    You save ${(product.price - (product.specialPrice || 0)).toFixed(2)}!
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/products/${product.id}`} className="w-full">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Grab This Deal
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No special offers available right now. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
