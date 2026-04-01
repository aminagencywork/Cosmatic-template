import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
}

export function generateWhatsAppLink(phone: string, cartItems: any[], shopName: string) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let message = `*Order from ${shopName}*\n\n`;
  
  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.name}${item.shade ? ` (${item.shade})` : ''}\n`;
    message += `   Qty: ${item.quantity} x ${formatPrice(item.price)}\n`;
  });
  
  message += `\n*Total: ${formatPrice(total)}*`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
