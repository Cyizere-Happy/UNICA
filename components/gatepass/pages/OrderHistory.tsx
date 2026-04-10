'use client';

import { useState } from 'react';
import { Search, MoreHorizontal, MapPin, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { operationalData } from '@/lib/gatepass/operationalData';
import { FoodOrder } from '@/lib/gatepass/types';
import { useSidebar } from '@/context/SidebarContext';
import Image from 'next/image';

const statusColors = {
  DELIVERED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
  PREPARING: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Preparing' },
  PENDING: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Delivering' },
  OUT_FOR_DELIVERY: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Delivering' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Canceled' },
};

export default function OrderHistory() {
  const orders = operationalData.getOrders();
  const menu = operationalData.getMenu();
  const [search, setSearch] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

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
    <div className="p-6 space-y-6 w-full font-sans transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-[#292f36] tracking-tight">Order History</h1>
        <div className="flex items-center gap-3">
          {/* Top Icons from Ref */}
          <div className="flex items-center gap-4 mr-4 text-gray-500">
             <button className="p-2 hover:bg-gray-100 rounded-full"><ShoppingBag className="w-5 h-5" /></button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#4d668f]/20 transition-all w-[300px] shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="bg-white border border-gray-100 rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#4d5053] outline-none shadow-sm">
            <option>Recently</option>
            <option>Last Week</option>
          </select>
        </div>
      </div>

      <div className={`bg-white rounded-3xl border border-gray-50 shadow-[0_12px_45px_rgba(0,0,0,0.03)] transition-all duration-500 overflow-x-hidden
        w-full
      `}>
        <table className={`w-full text-left border-collapse transition-all duration-500
          ${!collapsed ? 'min-w-[800px]' : 'min-w-[1000px]'}
        `}>
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-6 py-5 w-10">
                <input type="checkbox" className="rounded border-gray-300 text-[#4d668f] focus:ring-[#4d668f]" />
              </th>
              <th className="px-6 py-5 text-[12px] font-black uppercase tracking-widest text-gray-400">Menu</th>
              <th className="px-6 py-5 text-[12px] font-black uppercase tracking-widest text-gray-400">Date</th>
              <th className="px-6 py-5 text-[12px] font-black uppercase tracking-widest text-gray-400">Address</th>
              <th className="px-6 py-5 text-[12px] font-black uppercase tracking-widest text-gray-400">Total</th>
              <th className="px-6 py-5 text-[12px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => {
              const mainItem = order.items[0];
              const status = statusColors[order.status] || statusColors.PENDING;
              
              return (
                <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      className="rounded border-gray-300 text-[#4d668f] focus:ring-[#4d668f]" 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <Image 
                          src={getMenuImage(mainItem.name)} 
                          alt={mainItem.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#292f36] text-sm">{mainItem.name}</p>
                        <p className="text-xs text-gray-400 font-semibold">{mainItem.quantity}x</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#4d5053] font-medium whitespace-nowrap">
                    {order.orderTime}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#4d668f] shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-[#292f36] whitespace-nowrap">{order.roomNumber}, Unica House</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kigali, Rwanda</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-black text-[#4d668f]">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                       <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${status.bg} ${status.text} ring-black/5`}>
                        {status.label}
                      </span>
                      <button className="px-4 py-1.5 border border-amber-100 rounded-xl text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors">
                        Order Again
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
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
