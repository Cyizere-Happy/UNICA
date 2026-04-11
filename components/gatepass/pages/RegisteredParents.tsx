'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Star, Hash, Clock, Download, UserPlus,
  Users, History, Bed, MoreHorizontal, ArrowUpDown, ChevronRight,
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Edit2
} from 'lucide-react';
import { operationalData } from '@/lib/gatepass/operationalData';
import { GuestProfile, StayRecord } from '@/lib/gatepass/types';
import { cn, formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type ActiveTab = 'IN_HOUSE' | 'GUEST_DB' | 'HISTORY';

export default function GuestManagement() {
  const [guests, setGuests] = useState<GuestProfile[]>([]);
  const [stays, setStays] = useState<StayRecord[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('IN_HOUSE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSync = () => {
      setGuests(operationalData.getGuests());
      setStays(operationalData.getStays());
      setLoading(false);
    };
    handleSync();
    window.addEventListener('storage', handleSync);
    window.addEventListener('fica-data-update', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('fica-data-update', handleSync);
    };
  }, []);

  const inHouseStays = stays.filter(s => s.status === 'CHECKED_IN');
  const historyStays = stays.filter(s => s.status === 'CHECKED_OUT');

  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.phone.includes(search)
  );

  const filteredInHouse = inHouseStays.filter(s =>
    s.guestName.toLowerCase().includes(search.toLowerCase()) ||
    s.roomName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredHistory = historyStays.filter(s =>
    s.guestName.toLowerCase().includes(search.toLowerCase()) ||
    s.roomName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: GuestProfile['status']) => {
    switch (status) {
      case 'VIP': return 'bg-amber-50 text-amber-600 border-amber-200 ring-2 ring-amber-500/10';
      case 'REGULAR': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'BLACKLISTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const TabButton = ({ tab, id, icon: Icon, label, count }: { tab: ActiveTab, id: ActiveTab, icon: any, label: string, count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-2.5 px-6 py-4 border-b-2 transition-all relative",
        activeTab === id 
          ? "border-[#292f36] text-[#292f36]" 
          : "border-transparent text-gray-400 hover:text-gray-600"
      )}
    >
      <Icon size={18} strokeWidth={activeTab === id ? 2.5 : 2} />
      <span className={cn("text-xs uppercase tracking-widest font-black")}>{label}</span>
      {count !== undefined && (
        <span className={cn(
          "px-1.5 py-0.5 rounded-md text-[10px] font-black",
          activeTab === id ? "bg-[#292f36] text-white" : "bg-gray-100 text-gray-400"
        )}>
          {count}
        </span>
      )}
      {activeTab === id && (
        <motion.div layoutId="tab-underline" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-[#292f36]" />
      )}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-32 font-jost">
      {/* Header section stays consistent */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#292f36] tracking-tight">Stay Management</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Real-time Guest Operations & Historical Data</p>
        </div>
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-[#292f36] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                <Download size={14} /> Export Report
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-[#292f36] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95">
                <UserPlus size={14} strokeWidth={3} /> Add New Guest
            </button>
        </div>
      </div>

      {/* Tabs Design */}
      <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
          <TabButton id="IN_HOUSE" tab={activeTab} icon={Bed} label="In-House Now" count={inHouseStays.length} />
          <TabButton id="GUEST_DB" tab={activeTab} icon={Users} label="Guest Database" count={guests.length} />
          <TabButton id="HISTORY" tab={activeTab} icon={History} label="Stay History" count={historyStays.length} />
        </div>

        {/* Utility Bar */}
        <div className="p-4 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
           <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab.toLowerCase().replace('_',' ')}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-[#292f36] outline-none focus:ring-4 focus:ring-accent/5 transition-all w-full"
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-black uppercase text-gray-500 hover:text-[#292f36] transition-all">
                <Filter size={14} /> Advanced Filter
             </button>
             <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-black uppercase text-gray-500 hover:text-[#292f36] transition-all">
                <ArrowUpDown size={14} /> Sort
             </button>
          </div>
        </div>

        {/* Dynamic Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              {activeTab === 'IN_HOUSE' && (
                <tr className="border-b border-gray-100">
                  <th className="p-4 pl-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Current Occupant</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Accomodation</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Check-in Time</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Duration</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Live Status</th>
                  <th className="p-4 pr-8"></th>
                </tr>
              )}
              {activeTab === 'GUEST_DB' && (
                <tr className="border-b border-gray-100">
                  <th className="p-4 pl-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Guest Profile</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Details</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Total Bookings</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Lifetime Spent</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Tier Status</th>
                  <th className="p-4 pr-8"></th>
                </tr>
              )}
              {activeTab === 'HISTORY' && (
                <tr className="border-b border-gray-100">
                  <th className="p-4 pl-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Past Guest</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Room Details</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Dates</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Final Bill</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Operational Note</th>
                  <th className="p-4 pr-8"></th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-50">
               <AnimatePresence mode="wait">
                  {activeTab === 'IN_HOUSE' && filteredInHouse.map(stay => (
                    <motion.tr 
                      key={stay.id} 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#4d668f]/10 flex items-center justify-center text-[#4d668f] font-black relative overflow-hidden">
                             {stay.guestName.substring(0,2).toUpperCase()}
                             <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#292f36]">{stay.guestName}</p>
                            <p className="text-[10px] font-bold text-gray-400">Guest ID: {stay.guestId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <p className="text-xs font-black text-[#292f36]">{stay.roomName}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{stay.roomType}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#292f36]">
                           <Clock size={12} className="text-gray-400" />
                           {new Date(stay.checkIn).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                      </td>
                      <td className="p-4 text-xs font-black text-emerald-500">
                        {/* Simulate time since checkin */}
                        Active now
                      </td>
                      <td className="p-4">
                         <div className="flex items-center justify-center">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-600">
                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                               In-House
                            </span>
                         </div>
                      </td>
                      <td className="p-4 pr-8 text-right">
                         <button className="p-2 text-gray-400 hover:text-[#292f36] transition-colors"><MoreHorizontal size={18} /></button>
                      </td>
                    </motion.tr>
                  ))}

                  {activeTab === 'GUEST_DB' && filteredGuests.map(guest => (
                    <motion.tr 
                      key={guest.id} 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 pl-8">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-[14px] bg-gray-100 flex items-center justify-center text-[#292f36] font-black text-xs">
                              {guest.name.substring(0,2).toUpperCase()}
                           </div>
                           <div>
                              <p className="text-sm font-black text-[#292f36]">{guest.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined {new Date(guest.registeredAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col text-xs font-bold text-[#292f36]">
                           <span className="truncate max-w-[150px]">{guest.email}</span>
                           <span className="text-gray-400 text-[10px]">{guest.phone}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-xs font-black text-[#292f36] bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{guest.totalBookings}</span>
                      </td>
                      <td className="p-4">
                         <div className="flex flex-col">
                            <p className="text-xs font-black text-[#292f36]">{formatPrice(guest.totalSpent)}</p>
                            <p className="text-[9px] font-bold text-emerald-500 uppercase">Profitable</p>
                         </div>
                      </td>
                      <td className="p-4">
                         <span className={cn(
                           "px-3 py-1 border rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm",
                           getStatusStyle(guest.status)
                         )}>
                            {guest.status === 'VIP' && <Star size={10} className="fill-amber-600" />}
                            {guest.status}
                         </span>
                      </td>
                      <td className="p-4 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#292f36] hover:shadow-sm"><Edit2 size={14} /></button>
                           <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#292f36] hover:shadow-sm"><ChevronRight size={14} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}

                  {activeTab === 'HISTORY' && filteredHistory.map(stay => (
                    <motion.tr 
                      key={stay.id} 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 pl-8">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-black text-xs">
                              {stay.guestName.substring(0,2).toUpperCase()}
                           </div>
                           <p className="text-sm font-black text-[#292f36]">{stay.guestName}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col text-xs font-bold text-[#292f36]">
                           <p>{stay.roomName}</p>
                           <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest">{stay.roomType}</p>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-[#292f36]">
                        <div className="flex flex-col gap-0.5">
                           <span className="flex items-center gap-1 text-gray-400 text-[10px]"><CheckCircle2 size={10} className="text-emerald-500" /> {new Date(stay.checkIn).toLocaleDateString()}</span>
                           <span className="flex items-center gap-1 text-gray-400 text-[10px]"><XCircle size={10} className="text-rose-500" /> {new Date(stay.checkOut!).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-black text-[#292f36]">{formatPrice(stay.totalAmount)}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-bold text-gray-400 uppercase">Check-out Complete</span>
                      </td>
                      <td className="p-4 pr-8 text-right">
                         <button className="p-2 text-gray-400 hover:text-[#292f36] transition-colors"><MoreHorizontal size={18} /></button>
                      </td>
                    </motion.tr>
                  ))}
               </AnimatePresence>
            </tbody>
          </table>
          
          {(activeTab === 'IN_HOUSE' ? filteredInHouse : activeTab === 'GUEST_DB' ? filteredGuests : filteredHistory).length === 0 && !loading && (
             <div className="p-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center text-gray-200 mx-auto mb-6">
                    <Search size={32} />
                </div>
                <h3 className="text-lg font-black text-[#292f36]">No matches found</h3>
                <p className="text-xs font-bold text-gray-400 max-w-xs mx-auto mt-2">Try adjusting your filters or search keywords to find what you are looking for.</p>
             </div>
          )}
        </div>

        {/* Dynamic Footer */}
        <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Hash size={14} className="text-accent" /> Shown {(activeTab === 'IN_HOUSE' ? filteredInHouse : activeTab === 'GUEST_DB' ? filteredGuests : filteredHistory).length} of {(activeTab === 'IN_HOUSE' ? inHouseStays : activeTab === 'GUEST_DB' ? guests : historyStays).length} Total Entries
           </p>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-xl bg-white border border-gray-200 p-1">
                 {[1, 2, 3].map(p => (
                   <button key={p} className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all", p === 1 ? "bg-[#292f36] text-white" : "text-gray-400 hover:bg-gray-50")}>{p}</button>
                 ))}
              </div>
              <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-[#292f36] hover:bg-gray-50 transition-all shadow-sm"><ChevronRight size={16} /></button>
           </div>
        </div>
      </div>

      {/* Optional Alerts / Info section at bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-[20px] flex items-start gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><ShieldCheck size={18} /></div>
              <div>
                 <h4 className="text-[11px] font-black uppercase text-emerald-700 tracking-wider">Operational Health</h4>
                 <p className="text-xs text-emerald-600/80 font-medium leading-relaxed">All active check-ins verified. {inHouseStays.length} rooms are currently occupied and reporting normal status.</p>
              </div>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-[20px] flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><AlertTriangle size={18} /></div>
              <div>
                 <h4 className="text-[11px] font-black uppercase text-amber-700 tracking-wider">Upcoming Events</h4>
                 <p className="text-xs text-amber-600/80 font-medium leading-relaxed">System expects 3 potential check-outs in the next 24 hours. Room cleaning schedules have been updated.</p>
              </div>
          </div>
      </div>
    </div>
  );
}


