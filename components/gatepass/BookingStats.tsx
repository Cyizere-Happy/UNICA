'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Calendar, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItemProps {
  title: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  index: number;
}

const StatItem = ({ title, value, delta, trend, icon: Icon, index }: StatItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all group flex items-center gap-3"
    >
      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[#292f36] group-hover:bg-[#292f36] group-hover:text-white transition-all duration-300 flex-shrink-0">
        <Icon size={16} strokeWidth={2.5} />
      </div>
      
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <h3 className="text-gray-400 text-[9px] font-black uppercase tracking-widest truncate">{title}</h3>
          <div className={cn(
            "flex items-center gap-0.5 text-[8px] font-black uppercase tracking-wider",
            trend === 'up' ? "text-green-600" : "text-red-600"
          )}>
            {trend === 'up' ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
            {delta}
          </div>
        </div>
        <p className="text-lg font-black text-[#292f36] tracking-tight leading-none">{value}</p>
      </div>
    </motion.div>
  );
};

export default function BookingStats() {
  const stats = [
    { title: "Total Requests", value: "250", delta: "+3 product", trend: 'up', icon: Calendar },
    { title: "Revenue", value: "$15,490", delta: "+9%", trend: 'up', icon: DollarSign },
    { title: "Bookings", value: "2,355", delta: "+7%", trend: 'up', icon: Clock },
    { title: "Avg. Daily Sales", value: "890", delta: "+5%", trend: 'up', icon: Users },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <StatItem key={stat.title} {...stat} index={i} icon={stat.icon as any} trend={stat.trend as any} />
      ))}
    </div>
  );
}
