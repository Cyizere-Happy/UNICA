'use client';

import Lottie from 'lottie-react';
import type { LucideIcon } from 'lucide-react';
import animationData from "@/lib/gatepass/assets/No data.json";

interface NoDataProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'default' | 'large' | 'compact';
}

export default function NoData({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction,
  variant = 'default' 
}: NoDataProps) {

  const getVariantStyles = () => {
    switch (variant) {
      case 'large':
        return { container: 'py-16', image: 'w-80 h-80', title: 'text-xl', description: 'text-base', action: 'px-6 py-3 text-base' };
      case 'compact':
        return { container: 'py-8', image: 'w-64 h-64', title: 'text-lg', description: 'text-sm', action: 'px-4 py-2 text-sm' };
      default:
        return { container: 'py-12', image: 'w-72 h-72', title: 'text-lg', description: 'text-sm', action: 'px-4 py-2 text-sm' };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`flex flex-col items-center text-center ${styles.container}`}>
      
      {/* Optional Icon */}
      {Icon && (
        <div className="mb-4 text-gray-400">
          <Icon className="w-12 h-12" />
        </div>
      )}

      {/* Centered Lottie Animation */}
      <div className={`mb-6 ${styles.image}`}>
        <Lottie animationData={animationData} loop={true} className="mx-auto" />
      </div>

      {/* Title and Description */}
      <div className="space-y-2 max-w-md">
        <h3 className={`font-semibold text-gray-900 ${styles.title}`}>{title}</h3>
        <p className={`text-gray-600 ${styles.description}`}>{description}</p>
      </div>

      {/* Action Button */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className={`mt-6 ${styles.action} bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors duration-200 font-medium shadow-sm hover:shadow-md`}
        >
          {actionText}
        </button>
      )}

      {/* Decorative Dots */}
      <div className="mt-8 flex justify-center space-x-2">
        <div className="w-2 h-2 bg-primary-300 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}
