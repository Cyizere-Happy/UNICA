'use client';

import React, { useState } from 'react';
import { Calendar, User, Phone, Mail, Clock, CheckCircle2, XCircle, Search, Filter, Home, History } from 'lucide-react';
import { MOCK_VISITS } from '@/lib/gatepass/mockData';
import { Visit } from '@/lib/gatepass/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Visit[]>(MOCK_VISITS);
  const [search, setSearch] = useState('');

  const filteredBookings = bookings.filter(b =>
    b.parentName.toLowerCase().includes(search.toLowerCase()) ||
    b.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: Visit['status']) => {
    switch (status) {
      case 'CHECKED_IN': return 'bg-green-100 text-green-700 border-green-200';
      case 'CONFIRMED': return 'bg-blue-100 text-[#4d668f] border-blue-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#292f36] tracking-tight">Guest Reservations</h1>
          <p className="text-sm text-[#4d5053] font-medium">Manage and confirm room bookings across UNICA-House.</p>
        </div>
        <div className="relative group max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[#4d668f] transition-all" />
          <input
            type="text"
            placeholder="Search bookings (name, suite)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4d668f] focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em]">Guest Details</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em]">Residence</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em]">Check-in Date</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em]">Bill Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em]">Progress</th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-[#4d5053] uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#4d668f]/5 flex items-center justify-center text-[#4d668f] font-black uppercase text-xs border border-[#4d668f]/10 shadow-sm">
                        {booking.parentName.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-black text-[#292f36] text-[14px] leading-tight mb-0.5">{booking.parentName}</p>
                        <p className="text-[11px] text-[#4d5053] font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                          {booking.parentPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#4d668f]" />
                      <p className="text-sm font-bold text-[#292f36]">{booking.studentName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 group-hover:text-[#4d668f] transition-colors" />
                      <p className="text-sm font-bold text-[#4d5053]">{booking.visitDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-black text-[#292f36]">{formatPrice(booking.paymentAmount)}</span>
                      <span className={cn('text-[9px] font-black uppercase tracking-[0.1em]', booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-500')}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('px-3 py-1.5 rounded-xl text-[10px] font-black border tracking-widest uppercase transition-all', getStatusBadge(booking.status))}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 text-[11px] font-black text-[#4d668f] hover:bg-[#4d668f] hover:text-white rounded-lg border border-[#4d668f]/10 transition-all">
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="p-16 text-center">
              <History className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-[#4d5053] font-bold">No matching reservations found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
