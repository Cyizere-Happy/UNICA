'use client';

import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, Clock, AlertTriangle, Truck, User, Home, ChefHat, ExternalLink } from 'lucide-react';
import { operationalData } from '@/lib/gatepass/operationalData';
import { FoodOrder } from '@/lib/gatepass/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function OrderManagement() {
  const [orders, setOrders] = useState<FoodOrder[]>(operationalData.getOrders());

  const handleStatusChange = (orderId: string, status: FoodOrder['status']) => {
    operationalData.updateOrderStatus(orderId, status);
    setOrders(operationalData.getOrders());
  };

  const getStatusIcon = (status: FoodOrder['status']) => {
    switch (status) {
      case 'PENDING': return { icon: AlertTriangle, color: 'text-amber-500 bg-amber-50', label: 'Incoming' };
      case 'PREPARING': return { icon: ChefHat, color: 'text-blue-500 bg-blue-50', label: 'In Kitchen' };
      case 'OUT_FOR_DELIVERY': return { icon: Truck, color: 'text-indigo-500 bg-indigo-50', label: 'On Way' };
      case 'DELIVERED': return { icon: CheckCircle, color: 'text-green-500 bg-green-50', label: 'Completed' };
      case 'CANCELLED': return { icon: Clock, color: 'text-red-500 bg-red-50', label: 'Voided' };
      default: return { icon: Clock, color: 'text-gray-500 bg-gray-50', label: 'Unknown' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#292f36] tracking-tight">Active Kitchen Orders</h1>
        <p className="text-sm text-[#4d5053] font-medium">Fulfill and track customer meal requests in real-time.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => {
          const status = getStatusIcon(order.status);
          const Icon = status.icon;
          return (
            <div key={order.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
              <div className={cn('md:w-48 flex-shrink-0 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-100', status.color)}>
                <div className="text-center">
                  <Icon className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">{status.label}</p>
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#4d5053] px-2.5 py-1 bg-gray-100 rounded-lg">{order.id}</span>
                      <p className="text-sm text-gray-400 font-medium">{new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-[#4d668f]" />
                      <h3 className="font-black text-[#292f36] text-lg leading-none">{order.guestName}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                       <Home className="w-4 h-4 text-[#4d668f]" />
                       <p className="text-sm font-bold text-[#4d5053]">{order.roomNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50/50 p-2 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 flex items-center justify-center bg-[#4d668f] text-white text-[10px] font-black rounded-lg">{item.quantity}x</span>
                          <p className="text-sm font-bold text-[#292f36]">{item.name}</p>
                        </div>
                        <p className="text-sm font-bold text-[#4d5053]">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                    {order.notes && (
                      <p className="text-[11px] font-bold text-amber-600 bg-amber-50 p-2 rounded-lg italic">
                        Note: "{order.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="md:w-64 flex flex-col justify-between items-end border-t md:border-t-0 pt-6 md:pt-0">
                  <div className="text-right w-full">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Order Total</p>
                    <p className="text-2xl font-black text-[#292f36] mt-1">{formatPrice(order.totalAmount)}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 w-full mt-6">
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'PREPARING')}
                        className="flex-1 md:flex-none px-5 py-2.5 bg-[#4d668f] text-white text-[12px] font-black tracking-widest uppercase rounded-xl hover:bg-[#3a4f6e] transition-all"
                      >
                        Accept Service
                      </button>
                    )}
                    {order.status === 'PREPARING' && (
                      <button 
                         onClick={() => handleStatusChange(order.id, 'OUT_FOR_DELIVERY')}
                         className="flex-1 md:flex-none px-5 py-2.5 bg-indigo-600 text-white text-[12px] font-black tracking-widest uppercase rounded-xl hover:bg-indigo-700 transition-all"
                      >
                        Deliver Now
                      </button>
                    )}
                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                        className="flex-1 md:flex-none px-5 py-2.5 bg-green-600 text-white text-[12px] font-black tracking-widest uppercase rounded-xl hover:bg-green-700 transition-all"
                      >
                        Complete
                      </button>
                    )}
                    <button className="p-2.5 text-gray-400 hover:text-[#4d668f] hover:bg-gray-100 rounded-xl transition-all border border-gray-100">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-[#4d5053] font-bold">No active orders found in the kitchen queue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
