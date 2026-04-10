'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, Tag, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type ServiceType = 'Room Delivery' | 'Rooftop' | 'Kitchen';

import { useGuestAuth } from '@/context/GuestAuthContext';

export default function CartDrawer() {
  const { isCartOpen, toggleCart, cartItems, updateCart, removeFromCart, getSubtotal, clearCart } = useCart();
  const { isAuthenticated, isRegistered, setEntryModalOpen } = useGuestAuth();
  const [serviceType, setServiceType] = useState<ServiceType>('Room Delivery');
  const [isOrdered, setIsOrdered] = useState(false);
  
  const isFullGuest = isAuthenticated && isRegistered;

  const deliveryCharge = serviceType === 'Room Delivery' ? 500 : 0;
  const subtotal = getSubtotal();
  const total = subtotal + deliveryCharge;

  const handleConfirmOrder = () => {
    setIsOrdered(true);
    // In a real app, you'd send this to an API
    setTimeout(() => {
      clearCart();
      setIsOrdered(false);
      toggleCart();
    }, 4500);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={toggleCart}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2.5 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#292f36]">Your Cart</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID: #1099</p>
            </div>
          </div>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 CustomScroll">
          {isOrdered ? (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-[#292f36] mb-2">Order Confirmed!</h3>
                <p className="text-gray-500 text-sm max-w-[240px]">
                    We've received your order and we're starting to prepare it. It will be {serviceType.toLowerCase()} shortly.
                </p>
                <div className="mt-10 flex flex-col gap-3 w-full max-w-[200px]">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 4 }}
                            className="h-full bg-accent"
                        />
                    </div>
                </div>
            </motion.div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4 py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <p className="font-bold text-gray-400">Your bag is empty.</p>
            </div>
          ) : (
            <>
              {/* Service Type Toggles */}
              <div className="bg-gray-100/80 p-1 rounded-2xl flex gap-1">
                {(['Room Delivery', 'Rooftop', 'Kitchen'] as ServiceType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setServiceType(t)}
                    className={cn(
                      "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                      serviceType === t ? "bg-white text-accent shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden relative shrink-0 border border-black/5">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-[#292f36] text-[15px]">{item.name}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.meal} Menu</p>
                        </div>
                        <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                          <button
                            onClick={() => updateCart(item, -1)}
                            className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-[#292f36] shadow-sm hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-black text-[#292f36]">
                            {item.cartQuantity}
                          </span>
                          <button
                            onClick={() => updateCart(item, 1)}
                            className="w-6 h-6 rounded-md bg-[#0e0e0e] flex items-center justify-center text-white shadow-md hover:bg-black transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-black text-[#292f36]">{item.price * item.cartQuantity} RWF</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="bg-gray-50 rounded-[24px] p-4 flex items-center justify-between border border-black/[0.03]">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    className="bg-transparent border-none outline-none text-[13px] font-semibold text-[#292f36] w-24 placeholder:text-gray-300" 
                  />
                </div>
                <button className="px-4 py-2 bg-[#292f36] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all">
                  Apply
                </button>
              </div>

              {/* Summary */}
              <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Sub Total</span>
                  <span className="font-black text-[#292f36]">{subtotal} RWF</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Delivery Charge</span>
                  <span className="font-black text-[#292f36]">{deliveryCharge} RWF</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-base font-black text-[#292f36]">Total</span>
                  <span className="text-2xl font-black text-accent">{total} RWF</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Footer */}
        {!isOrdered && cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <button
              onClick={() => isFullGuest ? handleConfirmOrder() : setEntryModalOpen(true)}
              className="w-full py-4 bg-[#292f36] text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-black transition-all flex items-center justify-center gap-2 group"
            >
              {isFullGuest ? 'Confirm Order' : 'Register to Place Order'}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
