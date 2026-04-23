'use client';

import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, Clock, AlertTriangle, Truck, User, Home, ChefHat, ExternalLink, Utensils } from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { FoodOrder, FoodItem } from '@/lib/gatepass/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function OrderManagement() {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'COMPLETED'>('ALL');

  // Real-time synchronization
  // Real-time synchronization
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, menuData] = await Promise.all([
          apiService.getOrders(),
          apiService.getMenu()
        ]);
        setOrders(ordersData);
        setMenu(menuData);
      } catch (err) {
        console.error('Failed to fetch kitchen data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s for kitchen
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(order => {
    // Robust Date matching
    const orderDate = new Date(order.orderTime);
    const today = new Date();
    const isToday = orderDate.getDate() === today.getDate() &&
                    orderDate.getMonth() === today.getMonth() &&
                    orderDate.getFullYear() === today.getFullYear();
    
    // Always show pending orders, otherwise filter by today for others
    const shouldShow = isToday || order.status === 'PENDING';
    
    if (!shouldShow) return false;
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return order.status === 'PENDING';
    if (activeTab === 'ACTIVE') return ['PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status);
    if (activeTab === 'COMPLETED') return ['DELIVERED', 'CANCELLED'].includes(order.status);
    return true;
  });

  const orderTabs = [
    { id: 'ALL', label: 'All Activity', icon: ShoppingCart, count: orders.length },
    { id: 'PENDING', label: 'Incoming', icon: Clock, count: orders.filter(o => o.status === 'PENDING').length },
    { id: 'ACTIVE', label: 'Kitchen', icon: ChefHat, count: orders.filter(o => ['PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status)).length },
    { id: 'COMPLETED', label: 'Done', icon: CheckCircle, count: orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status)).length },
  ] as const;

  const handleStatusChange = async (orderId: string, status: FoodOrder['status']) => {
    try {
      await apiService.updateOrderStatus(orderId, status);
      const updated = await apiService.getOrders();
      setOrders(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const getItemDetails = (itemId: string) => menu.find(m => m.id === itemId);

  const getStatusIcon = (status: FoodOrder['status']) => {
    switch (status) {
      case 'PENDING': return { icon: AlertTriangle, color: 'text-amber-500 bg-amber-50', bg: 'bg-amber-100/30', label: 'Incoming' };
      case 'PREPARING': return { icon: ChefHat, color: 'text-blue-500 bg-blue-50', bg: 'bg-blue-100/30', label: 'In Kitchen' };
      case 'OUT_FOR_DELIVERY': return { icon: Truck, color: 'text-indigo-500 bg-indigo-50', bg: 'bg-blue-100/30', label: 'On Way' };
      case 'DELIVERED': return { icon: CheckCircle, color: 'text-green-500 bg-green-50', bg: 'bg-green-100/30', label: 'Completed' };
      case 'CANCELLED': return { icon: Clock, color: 'text-red-500 bg-red-50', bg: 'bg-red-100/30', label: 'Voided' };
      default: return { icon: Clock, color: 'text-gray-500 bg-gray-50', bg: 'bg-gray-100', label: 'Unknown' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-jost">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-black text-[#292f36] tracking-tight flex items-center gap-2">
            <ChefHat className="text-accent" size={24} />
            Kitchen Command
          </h1>
          <p className="text-[11px] text-[#4d5053] font-medium max-w-xs">Real-time fulfillment queue for <b>Today's</b> culinary services.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {orderTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm",
                isActive 
                  ? "bg-[#292f36] text-white" 
                  : "bg-white text-[#4d5053] border border-gray-100 hover:bg-gray-50"
              )}
            >
              <Icon size={14} className={isActive ? "text-accent" : "text-gray-400"} />
              {tab.label}
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded-md text-[8px]",
                isActive ? "bg-white/10 text-white" : "bg-gray-100 text-gray-400"
              )}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {filteredOrders.sort((a,b) => b.orderTime.localeCompare(a.orderTime)).map((order) => {
          const status = getStatusIcon(order.status);
          const Icon = status.icon;
          return (
            <div key={order.id} className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row">
              {/* Compact Sidebar Info */}
              <div className={cn('lg:w-52 flex-shrink-0 p-5 px-6 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-between', status.bg)}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black text-gray-400/60 uppercase tracking-widest">{order.id.split('-')[0]}</span>
                    <p className="text-[9px] text-gray-400/60 font-bold uppercase tracking-widest">
                      {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-white/60 rounded-xl border border-white/20 shadow-sm">
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5 text-center">Destination</p>
                       <h3 className="font-black text-[#292f36] text-lg text-center leading-tight">{order.roomNumber}</h3>
                    </div>

                    <div className="p-2.5 bg-accent/5 rounded-xl border border-accent/10">
                       <p className="text-[8px] font-black text-accent uppercase tracking-[0.2em] mb-0 text-center truncate">Load</p>
                       <p className="font-black text-accent text-sm text-center leading-none">
                         {order.items.reduce((acc, i) => acc + i.quantity, 0)}
                         <span className="text-[8px] ml-1 uppercase opacity-70">Dishes</span>
                       </p>
                    </div>
                    
                    <div className="pt-1">
                        <p className="text-[8px] font-black text-gray-400/60 uppercase tracking-[0.2em] mb-1">Guest</p>
                        <div className="flex items-center gap-1.5">
                           <User className="w-3 h-3 text-accent" />
                           <h4 className="font-bold text-[#292f36] text-[12px] truncate">{order.guestName}</h4>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border", status.color, "bg-white shadow-sm")}>
                    <Icon size={12} />
                    <span className="text-[9px] font-black uppercase tracking-[0.1em]">{status.label}</span>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3">
                    <h2 className="text-[11px] font-black text-[#292f36] uppercase tracking-widest flex items-center gap-2">
                       <Utensils className="w-3.5 h-3.5 text-accent" />
                       Preparation List
                    </h2>
                    <p className="text-[10px] font-bold text-[#4d5053]">{order.items.length} Items</p>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, idx) => {
                      const details = getItemDetails(item.itemId);
                      return (
                        <div key={idx} className="flex flex-col md:flex-row md:items-start justify-between gap-3 p-3.5 bg-gray-50/40 rounded-xl border border-gray-100 hover:border-accent/20 transition-all group">
                          <div className="flex items-start gap-3.5 flex-1">
                            <span className="w-8 h-8 flex items-center justify-center bg-accent text-white text-xs font-black rounded-lg shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                              {item.quantity}x
                            </span>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[15px] font-black text-[#292f36]">{item.name}</p>
                                {details && (
                                  <span className={cn(
                                    "px-1.5 py-0.5 text-[7px] font-black uppercase rounded-md border",
                                    details.meal === 'Breakfast' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                    details.meal === 'Lunch' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                    "bg-indigo-50 text-indigo-600 border-indigo-100"
                                  )}>
                                    {details.meal}
                                  </span>
                                )}
                              </div>
                              {details && (
                                <div className="space-y-1">
                                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-lg line-clamp-1">{details.description}</p>
                                  {details.ingredients && (
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {details.ingredients.slice(0, 5).map((ing, i) => (
                                        <span key={i} className="text-[8px] px-1 py-0.5 bg-white border border-gray-100 text-gray-400 font-bold uppercase rounded-md">{ing}</span>
                                      ))}
                                      {details.ingredients.length > 5 && (
                                        <span className="text-[8px] text-gray-300 font-bold uppercase">+{details.ingredients.length - 5}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {order.notes && (
                    <div className="mt-6 border-2 border-dashed border-amber-200 bg-amber-50/30 p-5 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                         <AlertTriangle className="w-12 h-12 text-amber-500" />
                      </div>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Special Instructions / Requirements
                      </p>
                      <p className="text-sm font-bold text-amber-700 italic leading-relaxed">
                        "{order.notes}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-gray-50">
                   <div className="flex items-baseline gap-2">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estimated Value</span>
                       <span className="text-2xl font-black text-[#292f36]">{formatPrice(order.totalAmount)}</span>
                   </div>

                   <div className="flex items-center gap-3">
                      {order.status === 'PENDING' && (
                        <button 
                          onClick={() => handleStatusChange(order.id, 'PREPARING')}
                          className="px-8 py-3 bg-accent text-white text-xs font-black tracking-widest uppercase rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
                        >
                          Send to Kitchen
                        </button>
                      )}
                      {order.status === 'PREPARING' && (
                        <button 
                           onClick={() => handleStatusChange(order.id, 'OUT_FOR_DELIVERY')}
                           className="px-8 py-3 bg-indigo-600 text-white text-xs font-black tracking-widest uppercase rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-200"
                        >
                          Out for Delivery
                        </button>
                      )}
                      {order.status === 'OUT_FOR_DELIVERY' && (
                        <button 
                          onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                          className="px-8 py-3 bg-emerald-600 text-white text-xs font-black tracking-widest uppercase rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-200"
                        >
                          Complete Order
                        </button>
                      )}
                      <button className="p-3 text-gray-400 hover:text-accent hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredOrders.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
               <ShoppingCart className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em] mb-2">Queue is Empty</p>
            <p className="text-sm text-gray-400 font-medium">No orders found for today in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
