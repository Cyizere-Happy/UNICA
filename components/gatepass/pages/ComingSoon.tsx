'use client';

import React from 'react';
import { Package, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-transparent font-jost text-center p-6 lg:p-12">
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-4"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#292f36]/5 mb-2 group">
          <Package className="text-[#292f36] opacity-30 group-hover:scale-110 transition-transform duration-300" size={20} />
        </div>

        <h1 className="text-3xl font-black text-[#292f36] tracking-tight">
          Stock Management
        </h1>
        
        <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Module Under Construction</p>
            <p className="text-gray-400 font-medium text-[13px] leading-relaxed max-w-[320px] mx-auto">
              We are currently building a robust inventory system to manage UNICA&apos;s supplies and stock levels. 
            </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-4">
            <div className="px-3 py-1.5 bg-amber-50 rounded-lg flex items-center gap-2">
                <Timer size={12} className="text-amber-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-700">Estimated launch Q3</span>
            </div>
        </div>

        <div className="pt-8">
            <button 
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-[#292f36] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              Return to Dashboard
            </button>
        </div>
      </motion.div>
    </div>
  );
}
