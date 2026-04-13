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
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
    : 'http://localhost:3001';
    
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}
