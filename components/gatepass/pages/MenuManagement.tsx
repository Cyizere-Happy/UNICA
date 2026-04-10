'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Utensils, Coffee, Sun, Moon, CheckCircle2, ChevronRight } from 'lucide-react';
import { operationalData } from '@/lib/gatepass/operationalData';
import { FoodItem, MealType } from '@/lib/gatepass/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function MenuManagement() {
  const [menu, setMenu] = useState<FoodItem[]>(operationalData.getMenu());
  const [activeTab, setActiveTab] = useState<MealType>('Breakfast');

  const filteredMenu = menu.filter((item) => item.meal === activeTab);

  const mealTabs = [
    { type: 'Breakfast', icon: Coffee },
    { type: 'Lunch', icon: Sun },
    { type: 'Dinner', icon: Moon },
  ];

  const handleAddDish = () => {
    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      name: 'New Signature Dish',
      meal: activeTab,
      price: 15,
      image: '/food/steak_plate.png',
      description: 'Expertly prepared with gourmet ingredients.',
      available: true
    };
    operationalData.addMenuItem(newItem);
    setMenu(operationalData.getMenu());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#292f36] tracking-tight">Menu Management</h1>
          <p className="text-sm text-[#4d5053] font-medium">Control the UNICA-House food services content.</p>
        </div>
        <button
          onClick={handleAddDish}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4d668f] text-white rounded-xl font-bold hover:bg-[#3a4f6e] transition-all shadow-md group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Add Signature Dish
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 w-fit">
        {mealTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.type;
          return (
            <button
              key={tab.type}
              onClick={() => setActiveTab(tab.type as MealType)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all',
                isActive ? 'bg-[#0e0e0e] text-white shadow-lg scale-105' : 'text-[#4d5053] hover:bg-gray-50'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.type}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em]">Item Details</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em]">Meal Service</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em]">Pricing</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em]">Access Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredMenu.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-black text-[#292f36] text-[15px]">{item.name}</p>
                      <p className="text-[12px] text-[#4d5053] line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-[#4d5053]">
                  <span className="flex items-center gap-1.5 capitalize">
                    {item.meal}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-black text-[#292f36]">{formatPrice(item.price)}</td>
                <td className="px-6 py-4">
                  {item.available ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-black tracking-widest uppercase rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-black tracking-widest uppercase rounded-full">
                      Sold Out
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-[#4d668f] hover:bg-white rounded-lg transition-all" title="Edit Item">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all" title="Delete Item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-[#292f36] hover:bg-white rounded-lg transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMenu.length === 0 && (
          <div className="p-12 text-center">
            <Utensils className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-[#4d5053] font-bold">No items found for {activeTab}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
