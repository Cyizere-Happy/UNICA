'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Users, Mail, Phone, Calendar, Home, CheckCircle2, XCircle, CreditCard, Clock, Star, ShieldCheck as ShieldIcon } from 'lucide-react';
import { BookingRequest } from '@/lib/gatepass/types';
import { cn, formatPrice } from '@/lib/utils';

interface BookingDetailModalProps {
  booking: BookingRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, stayCode: string) => void;
  onReject: (id: string) => void;
}

export default function BookingDetailModal({ booking, isOpen, onClose, onApprove, onReject }: BookingDetailModalProps) {
  const [stayCode, setStayCode] = React.useState<string | null>(null);

  if (!booking) return null;

  const handleApprove = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567889';
    let randomChars = '';
    for(let i=0; i<3; i++) randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
    const code = `UNICA-${randomChars}`;
    setStayCode(code);
    onApprove(booking.id, code);
  };

  const handleClose = () => {
    setStayCode(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[32px] shadow-2xl z-[101] flex flex-col overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!stayCode ? (
                <motion.div
                  key="detail-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Header */}
                  <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                         <Home size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-[#292f36] tracking-tight">Booking Details</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {booking.id}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleClose}
                      className="w-8 h-8 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-5">
                    {/* Guest Profile Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#292f36] to-[#4d668f] flex items-center justify-center text-white text-lg font-black uppercase">
                          {booking.guestName.substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-[#292f36] leading-tight">{booking.guestName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < (booking.rating || 0) ? "currentColor" : "none"} />
                              ))}
                            </div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">{booking.rating} Rating</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                          <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase rounded-full border border-amber-100">VIP Client</span>
                      </div>
                    </div>

                    {/* Contact Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                        <div className="flex items-center gap-2 text-[#292f36] font-bold text-xs truncate">
                          <Mail size={12} className="text-[#4d668f]" />
                          {booking.guestEmail}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Phone</p>
                        <div className="flex items-center gap-2 text-[#292f36] font-bold text-xs">
                          <Phone size={12} className="text-[#4d668f]" />
                          {booking.guestPhone}
                        </div>
                      </div>
                    </div>

                    {/* Residence Summary */}
                    <div className="p-5 bg-zinc-900 rounded-3xl text-white relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h6 className="text-sm font-black text-white">{booking.roomName}</h6>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-none mt-1">{booking.roomType} • {booking.guests} Guests</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-accent leading-none">{formatPrice(booking.roomPrice)}</p>
                            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-1">per night</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-4">
                          <div className="space-y-0.5">
                            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Check-In</p>
                            <div className="flex items-center gap-2 font-black text-white text-xs">
                              <Calendar size={12} className="text-accent" />
                              {booking.checkIn}
                            </div>
                          </div>
                          <div className="space-y-0.5 text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Check-Out</p>
                            <div className="flex items-center gap-2 justify-end font-black text-white text-xs">
                              {booking.checkOut}
                              <Calendar size={12} className="text-accent" />
                            </div>
                          </div>
                        </div>
                    </div>

                    {/* Financial & Requests mini-grid */}
                    <div className="grid grid-cols-5 gap-3">
                       <div className="col-span-2 bg-gray-50 rounded-2xl p-4 border border-gray-200">
                          <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Total Bill</p>
                          <p className="text-xl font-black text-[#292f36]">{formatPrice(booking.totalAmount)}</p>
                       </div>
                       <div className="col-span-3 bg-amber-50 rounded-2xl p-4 border border-amber-100 relative">
                          <p className="text-[9px] font-black uppercase text-amber-700 mb-1">Special Requests</p>
                          <p className="text-[11px] font-bold text-amber-900 leading-tight italic truncate">
                              "{booking.specialRequests || 'None provided'}"
                          </p>
                       </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => onReject(booking.id)}
                        className="py-3.5 bg-white border border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-[0.1em] text-gray-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                      <button 
                        onClick={handleApprove}
                        className="py-3.5 bg-[#292f36] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <CheckCircle2 size={14} /> Approve Request
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success-view"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                     <CheckCircle2 size={32} className="text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black text-[#292f36] tracking-tight">Booking Confirmed!</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Guest: {booking.guestName}</p>
                  </div>

                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Generated Stay Code</p>
                    <div className="text-4xl font-black text-[#292f36] tracking-widest font-mono">
                      {stayCode}
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 font-bold max-w-[200px] mx-auto leading-relaxed italic">
                    "This code has been synced with the guest's profile for room access."
                  </p>

                  <button 
                    onClick={handleClose}
                    className="w-full py-4 bg-[#292f36] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] hover:bg-black transition-all"
                  >
                    Mark as Read & Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
