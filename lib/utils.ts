import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(price);
}

export function resolveImageUrl(url: string | undefined | null) {
  if (!url) return '/Images/placeholder-dish.jpg'; // fallback
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  // Use the API URL from process.env but remove the /api suffix to get base domain
  const apiRoot = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5034/api';
  const baseUrl = apiRoot.replace(/\/api$/, '').replace(/\/$/, '');
  
  // Ensure the URL starts with a slash for consistent joining
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    
  return `${baseUrl}${cleanUrl}`;
}
