import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 border-b py-4">
      <div className="w-24 h-24 relative bg-gray-100 rounded">
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-cover rounded"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold">{item.product.name}</h3>
        <p className="text-gray-600">${item.product.price}</p>
        
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            className="px-2 py-1 border rounded"
          >
            -
          </button>
          <span className="px-4">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            className="px-2 py-1 border rounded"
          >
            +
          </button>
          <button
            onClick={() => onRemove(item.product.id)}
            className="ml-4 text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
      
      <div className="font-bold">
        ${(item.product.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}
