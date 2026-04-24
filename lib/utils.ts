import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: 'USD' | 'RWF' = 'USD') {
    if (currency === 'RWF') {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price) + ' RWF';
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(price);
}

/**
 * Resolves a potentially relative image URL to an absolute path.
 * 
 * NOTE: This function transforms standard /uploads/ paths to a custom 
 * /api/upload/view/ proxy endpoint to ensure required Cross-Origin 
 * security headers (CORP) are attached, bypassing infrastructure blocks.
 */
export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return '/Images/UNICA_House_Apartment_kitchen.jpg';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  const apiRoot = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5034/api';
  
  // Transform /uploads/ paths to our forced-header Proxy endpoint
  if (url.startsWith('/uploads/')) {
    const proxyPath = url.replace('/uploads/', '/api/upload/view/');
    try {
      const origin = new URL(apiRoot).origin;
      return `${origin}${proxyPath}`;
    } catch (e) {
      // Fallback if URL parsing fails
      const domain = apiRoot.replace(/\/api$/, '').replace(/\/$/, '');
      return `${domain}${proxyPath}`;
    }
  }

  // Handle other relative paths or local images
  try {
    const origin = new URL(apiRoot).origin;
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${origin}${cleanPath}`;
  } catch (e) {
    const domain = apiRoot.replace(/\/api$/, '').replace(/\/$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${domain}${cleanPath}`;
  }
}
