'use client';

import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
  variant?: 'default' | 'primary' | 'gradient';
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  iconColor = 'bg-accent', 
  variant = 'default' 
}: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getCardStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-accent to-[#3a4f6e] text-white border-accent/20';
      case 'gradient':
        return 'bg-gradient-to-br from-white to-accent/5 border-accent/10';
      default:
        return 'bg-white border-gray-100';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          title: 'text-white/80',
          value: 'text-white',
          trend: trend?.isPositive ? 'text-green-300' : 'text-red-300'
        };
      case 'gradient':
        return {
          title: 'text-accent',
          value: 'text-[#292f36]',
          trend: trend?.isPositive ? 'text-green-600' : 'text-red-600'
        };
      default:
        return {
          title: 'text-gray-500',
          value: 'text-[#292f36]',
          trend: trend?.isPositive ? 'text-green-600' : 'text-red-600'
        };
    }
  };

  const textStyles = getTextStyles();

  return (
    <div 
      className={`
        ${getCardStyles()} 
        rounded-xl p-4 border 
        transition-all duration-300 ease-out
        group cursor-pointer
        relative overflow-hidden
        ${isHovered ? 'shadow-lg scale-[1.02] -translate-y-1' : 'shadow-sm hover:shadow-md'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background decoration */}
      <div className={`
        absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full 
        -translate-y-6 translate-x-6 
        transition-all duration-500 ease-out
        ${isHovered ? 'scale-125 rotate-12' : 'scale-100 rotate-0'}
      `}></div>
      
      {/* Subtle gradient overlay on hover */}
      <div className={`
        absolute inset-0 bg-gradient-to-br from-transparent to-white/5 
        transition-opacity duration-300
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`
              text-xs font-medium ${textStyles.title} uppercase tracking-wide mb-1
              transition-all duration-200
              ${isHovered ? 'translate-x-1' : 'translate-x-0'}
            `}>
              {title}
            </p>
            <p className={`
              text-2xl font-bold ${textStyles.value} mb-1
              transition-all duration-300 ease-out
              ${isHovered ? 'scale-105 translate-x-1' : 'scale-100 translate-x-0'}
            `}>
              {value}
            </p>
            {trend && (
              <div className={`
                flex items-center gap-1
                transition-all duration-300 ease-out
                ${isHovered ? 'translate-x-1 opacity-100' : 'translate-x-0 opacity-90'}
              `}>
                <div className={`
                  w-1.5 h-1.5 rounded-full 
                  ${trend.isPositive ? 'bg-green-500' : 'bg-red-500'} 
                  transition-all duration-300
                  ${isHovered ? 'animate-pulse scale-110' : 'animate-pulse scale-100'}
                `}></div>
                <p className={`
                  text-xs font-medium ${textStyles.trend}
                  transition-all duration-200
                `}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </p>
              </div>
            )}
          </div>
          
          <div className={`
            ${iconColor} 
            p-2.5 rounded-lg 
            transition-all duration-300 ease-out
            shadow-md
            ${isHovered ? 'scale-110 rotate-6 shadow-lg' : 'scale-100 rotate-0 shadow-md'}
            relative overflow-hidden
          `}>
            {/* Icon background animation */}
            <div className={`
              absolute inset-0 bg-white/20 rounded-lg
              transition-all duration-300
              ${isHovered ? 'opacity-100 scale-110' : 'opacity-50 scale-100'}
            `}></div>
            <Icon className={`
              w-5 h-5 text-white relative z-10
              transition-all duration-300 ease-out
              ${isHovered ? 'scale-110' : 'scale-100'}
            `} />
          </div>
        </div>
        
        {/* Animated progress indicator */}
        <div className={`
          mt-3 w-full h-0.5 bg-white/20 rounded-full overflow-hidden
          transition-all duration-500
          ${isHovered ? 'opacity-100' : 'opacity-60'}
        `}>
          <div className={`
            h-full bg-white/40 rounded-full
            transition-all duration-700 ease-out
            ${isHovered ? 'w-3/4' : 'w-1/2'}
          `}></div>
        </div>
      </div>
      
      {/* Subtle border glow effect */}
      <div className={`
        absolute inset-0 rounded-xl border-2 border-transparent
        transition-all duration-300
        ${isHovered ? 'border-accent/10' : 'border-transparent'}
      `}></div>
    </div>
  );
}
