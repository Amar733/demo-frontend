// Currency formatting utility for Indian Rupees
export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return '₹0';
  }
  return `₹${price.toLocaleString('en-IN')}`;
}
