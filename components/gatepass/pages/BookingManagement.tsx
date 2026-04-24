'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronDown, 
  Download, 
  Plus, 
  Star,
  CheckCircle2,
  XCircle,
  Archive,
  ArrowUpDown,
  UserPlus
} from 'lucide-react';
import { BookingRequest } from '@/lib/gatepass/types';
import { cn, formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import BookingStats from '../BookingStats';
import BookingDetailModal from '../BookingDetailModal';
import Image from 'next/image';
import { toast } from 'sonner';

import { apiService } from '@/lib/gatepass/apiService';

export default function BookingManagement() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await apiService.getBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b =>
    b.guestName.toLowerCase().includes(search.toLowerCase()) ||
    b.roomName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBookings.map(b => b.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const updateStatus = async (id: string, newStatus: BookingRequest['status'], stayCode?: string) => {
    try {
      await apiService.updateBookingStatus(id, newStatus, stayCode);
      
      setBookings(prev => prev.map(b => {
        if (b.id === id) {
          if (newStatus === 'REJECTED') {
            toast.error("Booking Rejected", {
              description: `The request for ${b.guestName} has been declined.`,
            });
            setIsModalOpen(false);
          }
          return { ...b, status: newStatus, stayCode: stayCode || b.stayCode };
        }
        return b;
      }));
    } catch (error) {
      toast.error('Failed to update booking status.');
      console.error(error);
    }
  };

  const getStatusStyle = (status: BookingRequest['status']) => {
    switch (status) {
      case 'APPROVED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'CHECKED_IN': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-32 font-jost">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#292f36] tracking-tight">Booking Requests</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Property Management Suite</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#292f36] shadow-sm transition-all hover:border-gray-200 relative group">
             <div className="w-8 h-8 rounded-full bg-[#292f36] flex items-center justify-center text-white text-[10px] font-black uppercase">
               AD
             </div>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#292f36] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95">
             <Plus size={14} strokeWidth={3} /> Add New Request
          </button>
        </div>
      </div>

      {/* Utility Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-[#292f36] shadow-sm">
            <LayoutGrid size={14} /> Table View <ChevronDown size={12} />
          </button>
          <div className="h-5 w-px bg-gray-200 mx-1 hidden md:block" />
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-500 hover:text-[#292f36] transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-500 hover:text-[#292f36] transition-colors">
            <ArrowUpDown size={14} /> Sort
          </button>
          <div className="flex items-center gap-3 ml-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Show Statistics</span>
            <button 
              onClick={() => setShowStats(!showStats)}
              className={cn(
                "w-8 h-4 rounded-full transition-all relative",
                showStats ? "bg-orange-500" : "bg-gray-200"
              )}
            >
              <div className={cn(
                "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                showStats ? "right-0.5" : "left-0.5"
              )} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-500 hover:text-[#292f36] transition-colors">
            Customize
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-500 hover:text-[#292f36] transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <BookingStats />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table Section */}
      <div className="bg-white border border-gray-100 rounded-[28px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-[#fafafa]/50">
                <th className="px-4 py-3.5 w-10">
                   <input 
                    type="checkbox" 
                    className="w-3.5 h-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer" 
                    checked={selectedIds.length === filteredBookings.length && filteredBookings.length > 0}
                    onChange={toggleSelectAll}
                   />
                </th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Guest / Room</th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Check-in</th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Check-out</th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Price</th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Guests</th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rating</th>
                <th className="px-4 py-3.5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className={cn(
                    "group hover:bg-[#fcfcfc] transition-colors cursor-pointer",
                    selectedIds.includes(booking.id) && "bg-orange-50/30"
                  )}
                  onClick={() => {
                    setSelectedBooking(booking);
                    setIsModalOpen(true);
                  }}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer" 
                      checked={selectedIds.includes(booking.id)}
                      onChange={() => toggleSelectRow(booking.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[11px] font-black text-[#292f36] uppercase border border-gray-100 ring-2 ring-transparent group-hover:ring-gray-50 transition-all">
                        {booking.guestName.substring(0, 2)}
                       </div>
                       <div>
                         <p className="text-[12px] font-black text-[#292f36] leading-none mb-1">{booking.guestName}</p>
                         <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">{booking.roomName}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] font-bold text-[#292f36]">{booking.checkIn}</td>
                  <td className="px-4 py-3 text-[12px] font-bold text-[#292f36]">{booking.checkOut}</td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-black text-[#4d668f]">{formatPrice(booking.totalAmount, 'RWF')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="px-1.5 py-0.5 bg-gray-50 rounded-md inline-flex items-center gap-1 text-[10px] font-black text-gray-500 border border-gray-100">
                      {booking.guests} Guests
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                      getStatusStyle(booking.status)
                    )}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                     <span className="flex items-center gap-1 text-[12px] font-black text-[#292f36]">
                       <Star size={12} className="text-amber-400 fill-amber-400" />
                       {booking.rating}
                     </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-gray-300 hover:text-[#292f36] transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 flex items-center gap-4 min-w-[420px]"
          >
            <div className="flex items-center gap-3 pr-4 border-r border-gray-100">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-[10px]">
                {selectedIds.length}
              </div>
              <span className="text-[12px] font-black text-[#292f36]">Selected</span>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setSelectedIds([])}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-xl text-[12px] font-bold text-gray-500 transition-all"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-emerald-50 rounded-xl text-[12px] font-bold text-emerald-600 transition-all">
                <CheckCircle2 size={14} /> Approve
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-rose-50 rounded-xl text-[12px] font-bold text-rose-600 transition-all">
                <XCircle size={14} /> Reject
              </button>
              <div className="h-5 w-px bg-gray-100 mx-1" />
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-xl text-[12px] font-bold text-red-500 transition-all">
                <Archive size={14} /> Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingDetailModal 
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={(id, code) => updateStatus(id, 'APPROVED', code)}
        onReject={(id) => updateStatus(id, 'REJECTED')}
      />
    </div>
  );
}

const LayoutGrid = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
