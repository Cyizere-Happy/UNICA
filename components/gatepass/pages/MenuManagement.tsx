'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, Utensils, Coffee, Sun, Moon, 
  Search, Filter, LayoutGrid, List, TrendingUp, 
  ChefHat, Package, IndianRupee, Star, Settings2, MoreHorizontal
} from 'lucide-react';
import { operationalData } from '@/lib/gatepass/operationalData';
import { FoodItem, MealType } from '@/lib/gatepass/types';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { apiService } from '@/lib/gatepass/apiService';
import AddFoodModal from '../AddFoodModal';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function MenuManagement() {
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [activeTab, setActiveTab] = useState<MealType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [userRole, setUserRole] = useState<string>('ADMIN');

  // Real-time synchronization for simulation
  // Real-time synchronization
  React.useEffect(() => {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        setUserRole(u.role || 'ADMIN');
      } catch (e) { /* ignore */ }
    }

    const fetchData = async () => {
      try {
        const data = await apiService.getMenu();
        setMenu(data);
      } catch (err) {
        console.error('Failed to fetch menu:', err);
      }
    };
    fetchData();
  }, []);

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchesTab = activeTab === 'All' || item.meal === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [menu, activeTab, searchQuery]);

  const mealTabs = [
    { type: 'All', icon: LayoutGrid, color: 'bg-accent/10 text-accent' },
    { type: 'Breakfast', icon: Coffee, color: 'bg-accent/10 text-accent' },
    { type: 'Lunch', icon: Sun, color: 'bg-accent/10 text-accent' },
    { type: 'Dinner', icon: Moon, color: 'bg-accent/10 text-accent' },
  ];

  const handleSaveItem = async (item: FoodItem) => {
    try {
      if (editingItem) {
        await apiService.updateMenuItem(item.id, item);
      } else {
        await apiService.createMenuItem(item);
      }
      const updated = await apiService.getMenu();
      setMenu(updated);
      setEditingItem(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to remove this dish from the menu?')) {
      try {
        await apiService.deleteMenuItem(id);
        setMenu(prev => prev.filter(m => m.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };


  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-[#292f36] tracking-tight flex items-center gap-2">
              <ChefHat className="text-accent" size={24} />
              Culinary Suite
            </h1>
            <p className="text-[11px] text-[#4d5053] font-medium max-w-xs">Manage the premium dining experience for guests.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-[12px] font-bold text-[#292f36] outline-none focus:ring-2 focus:ring-accent/10 transition-all w-48 shadow-sm"
              />
            </div>
            
            {userRole === 'ADMIN' && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-accent to-[#3a4f6e] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg group"
              >
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={3} />
                Add Dish
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {mealTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;
            return (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type as MealType | 'All')}
                className={cn(
                  'flex items-center gap-2 px-4 py-1.5 rounded-xl text-[11px] font-black tracking-tight transition-all shrink-0',
                  isActive 
                    ? 'bg-gradient-to-br from-accent to-[#3a4f6e] text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-500 hover:text-[#292f36] border border-gray-100'
                )}
              >
                <div className={cn("p-1 rounded-md transition-colors", isActive ? "bg-white/10" : tab.color)}>
                    <Icon className="w-3 h-3" />
                </div>
                {tab.type}
              </button>
            );
          })}
        </div>

        {/* Dynamic Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredMenu.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all p-3"
              >
                {/* Image Container */}
                <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-gray-50">
                  <Image 
                    src={resolveImageUrl(item.image)} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                    {!item.available && (
                      <span className="bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    )}
                    <span className="bg-white/90 backdrop-blur-md text-[#292f36] text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 text-orange-400 fill-orange-400" />
                      {item.meal}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-3 pb-1 px-1">
                  <div>
                    <h3 className="text-[14px] font-black text-[#292f36] leading-tight group-hover:text-accent transition-colors">{item.name}</h3>
                    <p className="text-[11px] text-[#4d5053] font-medium mt-0.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Pricing</span>
                      <span className="text-base font-black text-[#292f36]">{formatPrice(item.price)}</span>
                    </div>

                    {userRole === 'ADMIN' && (
                      <div className="flex items-center gap-1.5">
                        <button 
                           onClick={() => {
                             setEditingItem(item);
                             setIsModalOpen(true);
                           }}
                           className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-[#292f36] rounded-lg transition-all"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 bg-red-50 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all border border-red-50/50"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Info Badges Overlay on Hover */}
                {item.calories && (
                    <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none">
                        <div className="bg-[#292f36] text-white text-[9px] font-black px-3 py-1 rounded-full shadow-xl flex items-center gap-1.5 border border-white/20 whitespace-nowrap">
                            <TrendingUp size={10} className="text-accent" />
                            {item.calories} CAL
                        </div>
                    </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredMenu.length === 0 && (
          <div className="bg-gray-50 rounded-[40px] p-20 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Utensils className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-black text-[#292f36]">No dishes discovered</h3>
            <p className="text-[#4d5053] font-medium mt-2 max-w-sm mx-auto italic">We couldn't find any matches for your current filters or search query.</p>
          </div>
        )}

      <AddFoodModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveItem}
        editingItem={editingItem}
      />
    </div>
  );
}
