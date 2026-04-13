'use client';

import React, { useState, useEffect } from 'react';
import { Search, MoreHorizontal, MapPin, ChevronLeft, ChevronRight, ShoppingBag, History, TrendingUp, Star, Download, ChefHat } from 'lucide-react';
import { operationalData } from '@/lib/gatepass/operationalData';
import { FoodOrder } from '@/lib/gatepass/types';
import { useSidebar } from '@/context/SidebarContext';
import { cn, formatPrice } from '@/lib/utils';
import Image from 'next/image';

import { apiService } from '@/lib/gatepass/apiService';

const statusColors = {
  DELIVERED: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Completed' },
  PREPARING: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', label: 'Preparing' },
  PENDING: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', label: 'Delivering' },
  OUT_FOR_DELIVERY: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', label: 'Delivering' },
  CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', label: 'Canceled' },
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOrders = await apiService.getOrders();
        setOrders(fetchedOrders);
        const fetchedMenu = await apiService.getMenu();
        setMenu(fetchedMenu);
      } catch (err) {
        console.error("Failed to load order history", err);
      }
    };
    fetchData();
  }, []);
  const getItemDetails = (itemId: string) => menu.find(m => m.id === itemId);
  
  const [search, setSearch] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Analytics Calculations
  const completedOrders = orders.filter(o => o.status === 'DELIVERED');
  const totalPreparedCount = completedOrders.length;
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  
  // Find bestselling dish
  const dishCounts: Record<string, number> = {};
  completedOrders.forEach(o => {
    o.items.forEach(item => {
      dishCounts[item.name] = (dishCounts[item.name] || 0) + item.quantity;
    });
  });
  const bestsellingDish = Object.entries(dishCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const stats = [
    { label: 'Total Fulfilled', value: totalPreparedCount, icon: ChefHat, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Kitchen Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Bestselling Dish', value: bestsellingDish, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Guest Feedback', value: '4.9/5', icon: ShoppingBag, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  const filteredOrders = orders.filter(o => 
    o.guestName.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.items[0]?.name.toLowerCase().includes(search.toLowerCase())
  );

  const { collapsed } = useSidebar();

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getMenuImage = (itemName: string) => {
    return menu.find(m => m.name === itemName)?.image || '/food/placeholder.png';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-jost pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-black text-[#292f36] tracking-tight flex items-center gap-2">
            <History className="text-accent" size={24} />
            Performance Hub
          </h1>
          <p className="text-[11px] text-[#4d5053] font-medium max-w-xs">Review historical output and culinary preparation metrics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-[12px] font-bold text-[#292f36] outline-none focus:ring-2 focus:ring-accent/10 transition-all w-40 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-[12px] font-black text-[#4d5053] hover:bg-gray-50 transition-all shadow-sm">
            <Download size={14} className="text-accent" />
            Download History
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <Icon size={18} className={stat.color} />
                </div>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Lifetime</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-lg font-black text-[#292f36] tracking-tight truncate" title={String(stat.value)}>{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-[#fafafa]/50">
                <th className="px-4 py-3.5 w-10">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-accent focus:ring-accent cursor-pointer" />
                </th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Menu</th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Address</th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total</th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-4 py-3.5 w-10"></th>
              </tr>
            </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => {
              const mainItem = order.items[0];
              const status = statusColors[order.status] || statusColors.PENDING;
              
              return (
                <tr key={order.id} className="group hover:bg-[#fcfcfc]/80 transition-all duration-200">
                  <td className="px-2 lg:px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      className="rounded border-gray-300 text-[#4d668f] focus:ring-[#4d668f]" 
                    />
                  </td>
                  <td className="px-2 lg:px-4 py-3 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      {order.items.length > 1 ? (
                        <div className="relative w-12 h-12 rounded-xl bg-accent/5 shrink-0 shadow-sm border border-accent/10 flex items-center justify-center text-2xl">
                          🥘
                        </div>
                      ) : (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-sm border border-gray-50 flex items-center justify-center">
                          <img 
                            src={getMenuImage(mainItem.name)} 
                            alt={mainItem.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/food/placeholder.png';
                            }}
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="font-bold text-[#292f36] text-sm leading-tight flex flex-wrap items-center gap-2">
                          {order.items.slice(0, 2).map(i => i.name).join(', ')}
                          {order.items.length > 2 && (
                            <span className="px-1.5 py-0.5 bg-accent/5 text-accent text-[9px] font-black uppercase rounded-md border border-accent/10 whitespace-nowrap">
                              +{order.items.length - 2} Others
                            </span>
                          )}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.1em]">
                          <span>{order.items.reduce((acc, i) => acc + i.quantity, 0)} Total Dishes</span>
                          <span>•</span>
                          {(() => {
                            const mealTypes = Array.from(new Set(order.items.map(i => getItemDetails(i.itemId)?.meal).filter(Boolean)));
                            const isMixed = mealTypes.length > 1;
                            return isMixed ? (
                                <span className="px-1.5 py-0.5 bg-gray-50 text-gray-500 text-[9px] rounded-md border border-gray-100">Mixed</span>
                            ) : (
                                <span className={cn(
                                "px-1.5 py-0.5 text-[9px] rounded-md border",
                                mealTypes[0] === 'Breakfast' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                mealTypes[0] === 'Lunch' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                "bg-indigo-50 text-indigo-600 border-indigo-100"
                                )}>
                                {mealTypes[0] || 'Unknown'}
                                </span>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 py-3 text-sm text-[#4d5053] font-medium min-w-[120px]">
                    {order.orderTime}
                  </td>
                  <td className="px-2 lg:px-4 py-3 min-w-[150px]">
                    <div className="flex gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#4d668f] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-[#292f36]">{order.roomNumber}, Unica House</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kigali, Rwanda</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 py-3 text-sm font-black text-accent whitespace-nowrap">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-2 lg:px-4 py-3">
                    <div className="flex flex-col xl:flex-row xl:items-center gap-2">
                       <span className={cn(
                        "w-fit px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                        status.bg, status.text, status.border
                       )}>
                        {status.label}
                      </span>
                      <button className="w-fit px-2 py-1 bg-white border border-accent/20 rounded-lg text-[9px] font-black text-accent uppercase tracking-wider hover:bg-accent hover:text-white transition-all shadow-sm">
                        Order Again
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-right">
                    <button className="p-2 text-gray-400 hover:text-[#292f36] transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-gray-500 font-bold">No orders found.</p>
            </div>
          )}
        </div>

        <div className="px-6 py-6 border-t border-gray-50 flex items-center justify-between">
           <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Showing {filteredOrders.length} from {orders.length} data</p>
           <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-100">1</button>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold bg-[#4d668f] text-white shadow-lg shadow-[#4d668f]/20">2</button>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-100">3</button>
              <button className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
           </div>
        </div>
      </div>
    </div>
  );
}
