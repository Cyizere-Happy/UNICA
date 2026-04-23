'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, Tag, ChevronRight, CheckCircle2, History, Star, MessageSquare, Timer, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { cn, resolveImageUrl } from '@/lib/utils';
import { apiService } from '@/lib/gatepass/apiService';
import { FoodOrder } from '@/lib/gatepass/types';

type ServiceType = 'Room Delivery' | 'Rooftop' | 'Kitchen';

import { useGuestAuth } from '@/context/GuestAuthContext';

export default function CartDrawer() {
  const { isCartOpen, toggleCart, cartItems, updateCart, removeFromCart, getSubtotal, clearCart } = useCart();
  const { isAuthenticated, isRegistered, setEntryModalOpen, guestUser } = useGuestAuth();
  const [serviceType, setServiceType] = useState<ServiceType>('Room Delivery');
  const [isOrdered, setIsOrdered] = useState(false);
  const [view, setView] = useState<'CART' | 'HISTORY'>('CART');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Feedback state
  const [rating, setRating] = useState(0);
  const [testimonial, setTestimonial] = useState('');
  const [activeFeedbackOrderId, setActiveFeedbackOrderId] = useState<string | null>(null);
  const [liveOrders, setLiveOrders] = useState<FoodOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const isFullGuest = isAuthenticated && isRegistered;

  // Live data synchronization
  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!isFullGuest) return;
      try {
        setIsLoadingOrders(true);
        const data = await apiService.getMyOrders();
        setLiveOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (view === 'HISTORY') {
      fetchOrders();
    }
    
    const interval = setInterval(() => {
        if (view === 'HISTORY' && isFullGuest) fetchOrders();
    }, 15000); // Poll every 15s when history is open

    return () => clearInterval(interval);
  }, [view, isFullGuest]);

  const deliveryCharge = serviceType === 'Room Delivery' ? 500 : 0;
  const subtotal = getSubtotal();
  const total = subtotal + deliveryCharge;

  // Filter orders for the current guest (now using live state)
  const myOrders = liveOrders;

  const handleConfirmOrder = async () => {
    if (!guestUser) return;
    
    try {
      // Prepare backend-compliant payload (CreateOrderDto)
      const payload = {
          guestId: guestUser.guestId,
          stayId: guestUser.id,
          roomId: guestUser.roomId,
          items: cartItems.map(i => ({ 
              menuItemId: i.id, // Must be the real database ID
              quantity: i.cartQuantity
          })),
          notes: specialRequests
      };

      await apiService.createOrder(payload as any);
      setIsOrdered(true);
      setSpecialRequests('');
      
      // Refresh local history immediately
      const updatedOrders = await apiService.getMyOrders();
      setLiveOrders(updatedOrders);

      setTimeout(() => {
        clearCart();
        setIsOrdered(false);
        setView('HISTORY');
      }, 4500);
    } catch (err: any) {
      console.error('Order placement failed:', err);
      if (err.response?.status === 401) {
        alert('Your session has expired or is invalid. Please refresh and verify your stay code again.');
      } else {
        alert('Failed to place order. Please try again or contact reception.');
      }
    }
  };

  const handleConfirmReceipt = async (orderId: string) => {
    try {
        await apiService.confirmOrderReceipt(orderId);
        // Refresh orders to update UI state
        const updated = await apiService.getMyOrders();
        setLiveOrders(updated);
        setActiveFeedbackOrderId(orderId);
    } catch (err) {
        console.error('Failed to confirm receipt:', err);
    }
  };

  const handleSubmitFeedback = async () => {
    if (activeFeedbackOrderId) {
        try {
            await apiService.submitOrderFeedback(activeFeedbackOrderId, rating, testimonial);
            setActiveFeedbackOrderId(null);
            setRating(0);
            setTestimonial('');
            
            // Refresh to show "Feedback Received" status
            const updated = await apiService.getMyOrders();
            setLiveOrders(updated);
        } catch (err) {
            console.error('Feedback submission failed:', err);
        }
    }
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
        className="relative w-full sm:max-w-md bg-[#fafafa] h-full shadow-2xl flex flex-col"
      >
        {/* Header with Navigation */}
        <div className="bg-white px-4 md:px-6 pt-6 pb-2 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#292f36] p-2.5 rounded-xl shadow-lg shadow-black/10">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-[#292f36] tracking-tight">Experience Cart</h2>
            </div>
            <button onClick={toggleCart} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex bg-gray-50 p-1 rounded-xl mb-2">
            <button 
                onClick={() => setView('CART')}
                className={cn(
                    "flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    view === 'CART' ? "bg-white text-[#292f36] shadow-sm" : "text-gray-400"
                )}
            >
                <Tag size={14} /> My Cart
            </button>
            <button 
                onClick={() => setView('HISTORY')}
                className={cn(
                    "flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    view === 'HISTORY' ? "bg-white text-[#292f36] shadow-sm" : "text-gray-400"
                )}
            >
                <History size={14} /> My Orders
                {myOrders.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-accent text-white text-[8px] flex items-center justify-center">
                        {myOrders.length}
                    </span>
                )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 CustomScroll">
          {view === 'CART' ? (
            isOrdered ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20 bg-white rounded-[32px] border border-gray-100 mt-10"
                >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-xl shadow-green-100">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black text-[#292f36] mb-2">Order Confirmed!</h3>
                    <p className="text-gray-500 text-sm max-w-[240px]">
                        We're starting to prepare your meal. Switch to "My Orders" to track the progress.
                    </p>
                    <div className="mt-10 flex flex-col gap-3 w-full max-w-[200px]">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 4 }}
                                className="h-full bg-accent shadow-[0_0_12px_rgba(205,162,116,0.3)]"
                            />
                        </div>
                    </div>
                </motion.div>
            ) : cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-32">
                  <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-xl shadow-black/5 mb-6 border border-gray-50">
                    <ShoppingBag className="w-12 h-12 text-gray-200" />
                  </div>
                  <p className="font-black text-gray-300 uppercase tracking-widest text-[11px]">Your bag is empty</p>
                  <button onClick={toggleCart} className="mt-4 text-accent font-black text-[10px] uppercase tracking-widest underline underline-offset-4">Browse Menu</button>
                </div>
            ) : (
                <>
                  {/* Service Type Toggles */}
                  <div className="bg-white p-1 rounded-2xl flex gap-1 border border-gray-100">
                    {(['Room Delivery', 'Rooftop', 'Kitchen'] as ServiceType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setServiceType(t)}
                        className={cn(
                          "flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                          serviceType === t ? "bg-[#292f36] text-white shadow-lg shadow-black/10" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
    
                  {/* Items List */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 group p-3 md:p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden relative shrink-0 border border-gray-100">
                          <Image src={resolveImageUrl(item.image)} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div className="flex justify-between items-start">
                            <h4 className="font-black text-[#292f36] text-[13px] md:text-[14px] leading-tight line-clamp-1">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-accent">{item.cartQuantity}x</span>
                                <span className="font-black text-[#292f36] text-[11px] md:text-xs whitespace-nowrap">{item.price * item.cartQuantity} RWF</span>
                             </div>
                             <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
                                <button onClick={() => updateCart(item, -1)} className="p-1 hover:bg-white rounded-md transition-colors"><Minus size={9} /></button>
                                <button onClick={() => updateCart(item, 1)} className="p-1 bg-[#292f36] text-white rounded-md shadow-sm transition-colors"><Plus size={9} /></button>
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
    
                  {/* Special Requests */}
                  <div className="bg-white rounded-[24px] p-4 md:p-5 border border-gray-100 shadow-sm space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare size={13} className="text-accent" /> Special Requests
                    </label>
                    <textarea 
                        placeholder="Allergies, no onions, extra spice..." 
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-[12px] font-bold text-[#292f36] outline-none min-h-[80px] placeholder:text-gray-300 resize-none"
                    />
                  </div>
    
                  {/* Summary */}
                  <div className="space-y-4 pt-4 bg-white p-5 md:p-6 rounded-[32px] border border-gray-100 shadow-sm overflow-hidden relative">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Sub Total</span>
                      <span className="font-black text-[#292f36]">{subtotal} RWF</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Delivery Charge</span>
                      <span className="font-black text-[#292f36]">{deliveryCharge} RWF</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-base font-black text-[#292f36]">Total</span>
                      <span className="text-xl md:text-2xl font-black text-accent">{total} RWF</span>
                    </div>
                  </div>
                </>
            )
          ) : (
            /* Orders History View */
             <div className="space-y-6 pb-20">
                {myOrders.length === 0 ? (
                    <div className="py-20 text-center space-y-4 opacity-50">
                        <Timer size={40} className="mx-auto text-gray-300" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No active orders found</p>
                    </div>
                ) : (
                    myOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-[24px] border border-gray-100 p-4 md:p-6 shadow-sm hover:shadow-md transition-all space-y-4 overflow-hidden relative">
                             {/* Improved Status Tracking - Visual Progress */}
                             <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                     <div className={cn(
                                        "flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm",
                                        order.status === 'DELIVERED' ? "bg-green-50 text-green-600 border-green-100" :
                                        order.status === 'PENDING' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                        "bg-blue-50 text-blue-600 border-blue-100"
                                     )}>
                                        {order.status}
                                     </div>
                                     <p className="text-[9px] font-bold text-gray-300">{order.id}</p>
                                </div>
                                
                                {/* Step Tracker */}
                                <div className="flex items-center gap-1">
                                    {(['PENDING', 'PREPARING', 'DELIVERED'] as const).map((step, i) => {
                                        const steps = ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
                                        const currentIdx = steps.indexOf(order.status);
                                        const stepIdx = steps.indexOf(step as any);
                                        const isDone = currentIdx >= stepIdx;
                                        
                                        return (
                                            <div key={step} className={cn(
                                                "h-1 flex-1 rounded-full transition-all duration-1000",
                                                isDone ? "bg-accent" : "bg-gray-100"
                                            )} />
                                        );
                                    })}
                                </div>
                             </div>

                             <div className="flex justify-between items-start pt-1">
                                <div>
                                    <h4 className="font-black text-[#292f36] text-[13px] md:text-[15px] leading-tight">
                                        {order.items.length} {order.items.length === 1 ? 'Meal' : 'Meals'}
                                    </h4>
                                    <p className="text-[9px] font-bold text-gray-400">{order.orderTime}</p>
                                </div>
                                <span className="font-black text-accent text-base md:text-lg">{order.totalAmount} RWF</span>
                             </div>

                             <div className="bg-gray-50/50 rounded-xl p-3 md:p-4 space-y-1.5 border border-black/[0.02]">
                                {order.items.map((it, i) => (
                                    <div key={i} className="flex justify-between items-center text-[12px] md:text-[13px] font-bold">
                                        <span className="text-[#292f36] line-clamp-1">{it.quantity}x {it.name}</span>
                                        <span className="text-gray-400 shrink-0 ml-4">{it.price * it.quantity} RWF</span>
                                    </div>
                                ))}
                             </div>

                             {/* Confirmation Workflow */}
                             {order.status === 'DELIVERED' && !order.isConfirmedByGuest ? (
                                <div className="space-y-3">
                                    <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        </div>
                                        <p className="text-[10px] font-bold text-green-700 leading-tight">Your order has arrived! Please confirm receipt to finalized.</p>
                                    </div>
                                    <button
                                        onClick={() => handleConfirmReceipt(order.id)}
                                        className="w-full py-3.5 bg-[#292f36] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-black transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <Check size={14} className="group-hover:scale-110 transition-transform" /> 
                                        I've Received It
                                    </button>
                                </div>
                             ) : order.isConfirmedByGuest && !order.rating ? (
                                <div className="space-y-4 p-4 bg-accent/5 rounded-[24px] border border-accent/20">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">How was your meal?</p>
                                        <div className="flex justify-center gap-2 mb-4">
                                            {[1,2,3,4,5].map(star => (
                                                <button key={star} onClick={() => setRating(star)}>
                                                    <Star 
                                                        size={22} 
                                                        className={cn(star <= rating ? "fill-accent text-accent" : "text-gray-300 ring-transparent")} 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Leave a Testimonial (Optional)</label>
                                        <textarea 
                                            placeholder="Tell others about your experience..."
                                            value={testimonial}
                                            onChange={(e) => setTestimonial(e.target.value)}
                                            className="w-full bg-white border border-gray-100 rounded-xl p-3 text-[12px] font-bold text-[#292f36] outline-none min-h-[60px] placeholder:text-gray-200 resize-none shadow-sm"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSubmitFeedback}
                                        disabled={rating === 0}
                                        className="w-full py-3 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Check size={14} /> Submit Feedback
                                    </button>
                                </div>
                             ) : order.rating ? (
                                <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-[10px] bg-green-50 py-2 rounded-xl border border-green-100">
                                    <Check size={14} /> Feedback Received
                                </div>
                             ) : order.status === 'DELIVERED' && order.isConfirmedByGuest ? (
                                <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-[10px] bg-green-50 py-2 rounded-xl border border-green-100">
                                    <Check size={14} /> Order Fulfilled
                                </div>
                             ) : (
                                <div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-[10px] bg-blue-50 py-2 rounded-xl border border-blue-100">
                                    <Timer size={14} className="animate-pulse" /> Awaiting Delivery
                                </div>
                             )}
                        </div>
                    ))
                )}
             </div>
          )}
        </div>

        {/* Action Footer */}
        {view === 'CART' && !isOrdered && cartItems.length > 0 && (
          <div className="p-4 md:p-6 border-t border-gray-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
            <button
              onClick={() => {
                if (!isFullGuest) {
                    setEntryModalOpen(true);
                } else if (guestUser?.stayType !== 'APARTMENT') {
                    handleConfirmOrder();
                }
              }}
              disabled={isFullGuest && guestUser?.stayType === 'APARTMENT'}
              className={cn(
                  "w-full py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 group",
                  isFullGuest && guestUser?.stayType === 'APARTMENT' 
                    ? "bg-gray-100 text-[#292f36]/30 cursor-not-allowed shadow-none" 
                    : "bg-[#292f36] text-white shadow-black/10 hover:bg-black"
              )}
            >
              {!isFullGuest ? 'Register to Place Order' : 
               guestUser?.stayType === 'APARTMENT' ? 'Dining Preview Mode' : 'Confirm Order'}
              {(!isFullGuest || guestUser?.stayType !== 'APARTMENT') && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
