'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Users, Mail, Phone, Calendar, Home, CheckCircle2, XCircle, CreditCard, Clock, Star } from 'lucide-react';
import { BookingRequest } from '@/lib/gatepass/types';
import { cn, formatPrice } from '@/lib/utils';

interface BookingDetailModalProps {
  booking: BookingRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function BookingDetailModal({ booking, isOpen, onClose, onApprove, onReject }: BookingDetailModalProps) {
  if (!booking) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[#292f36] tracking-tight">Booking Details</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Request ID: {booking.id}</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Guest Profile Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-xl font-black uppercase">
                    {booking.guestName.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#292f36]">{booking.guestName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < (booking.rating || 0) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-400">{booking.rating} Guest Rating</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Address</p>
                    <div className="flex items-center gap-2 text-[#292f36] font-bold text-sm">
                      <Mail size={14} className="text-[#4d668f]" />
                      {booking.guestEmail}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Phone Number</p>
                    <div className="flex items-center gap-2 text-[#292f36] font-bold text-sm">
                      <Phone size={14} className="text-[#4d668f]" />
                      {booking.guestPhone}
                    </div>
                  </div>
                </div>
              </section>

              {/* Residence Details */}
              <section className="space-y-4">
                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#292f36] border-l-4 border-accent pl-2">Residence Information</h5>
                <div className="p-6 bg-accent/5 rounded-[32px] border border-accent/10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h6 className="text-sm font-black text-[#292f36]">{booking.roomName}</h6>
                      <p className="text-[11px] text-accent font-bold uppercase tracking-wider">{booking.roomType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-[#292f36]">{formatPrice(booking.roomPrice)}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">per night</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 border-t border-accent/10 pt-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Check-In</p>
                      <div className="flex items-center gap-2 font-black text-[#292f36]">
                        <Calendar size={14} className="text-accent" />
                        {booking.checkIn}
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Check-Out</p>
                      <div className="flex items-center gap-2 justify-end font-black text-[#292f36]">
                        {booking.checkOut}
                        <Calendar size={14} className="text-accent" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Reservation Stats */}
              <section className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
                  <Users size={18} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-xs font-black text-[#292f36]">{booking.guests} Guests</p>
                </div>
                <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
                  <CreditCard size={18} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-xs font-black text-[#292f36]">{formatPrice(booking.totalAmount)}</p>
                </div>
                <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
                  <Clock size={18} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-xs font-black text-[#292f36]">3 Nights</p>
                </div>
              </section>

              {/* Special Requests */}
              {booking.specialRequests && (
                <section className="space-y-2">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#292f36]">Special Requests</h5>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900 text-sm font-medium leading-relaxed">
                    "{booking.specialRequests}"
                  </div>
                </section>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 grid grid-cols-2 gap-4">
              <button 
                onClick={() => onReject(booking.id)}
                className="py-4 bg-white border border-red-100 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <XCircle size={16} /> Reject Request
              </button>
              <button 
                onClick={() => onApprove(booking.id)}
                className="py-4 bg-[#292f36] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> Approve Booking
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
