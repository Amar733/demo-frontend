// Currency formatting utility for Indian Rupees
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}
