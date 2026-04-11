'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Star, Hash, Clock, Download, UserPlus,
  Users, History, Bed, MoreHorizontal, ArrowUpDown, ChevronRight,
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Edit2
} from 'lucide-react';
import { operationalData } from '@/lib/gatepass/operationalData';
import { GuestProfile, StayRecord } from '@/lib/gatepass/types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Save, X, Wand2, Info, Mail as MailIcon, Phone as PhoneIcon, User as UserIcon, ShieldCheck as ShieldIcon } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

type ActiveTab = 'IN_HOUSE' | 'GUEST_DB' | 'HISTORY';

export default function GuestManagement() {
  const [guests, setGuests] = useState<GuestProfile[]>([]);
  const [stays, setStays] = useState<StayRecord[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('IN_HOUSE');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'REGULAR' as GuestProfile['status']
  });
  const [generatedStayCode, setGeneratedStayCode] = useState<string | null>(null);

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

  const handleAddGuest = () => {
    if (!newGuest.name || !newGuest.email || !newGuest.phone) {
        toast.error("Please fill in all required fields");
        return;
    }

    // Generate Stay Code: UNICA-XXX (3 alphanum)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567889';
    let randomChars = '';
    for(let i=0; i<3; i++) randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
    const stayCode = `UNICA-${randomChars}`;
    setGeneratedStayCode(stayCode);

    // Save Guest
    const guest: GuestProfile = {
      id: `GST-${Date.now()}`,
      name: newGuest.name,
      email: newGuest.email,
      phone: newGuest.phone,
      totalBookings: 0,
      totalSpent: 0,
      lastVisit: new Date().toISOString(),
      status: newGuest.status,
      registeredAt: new Date().toISOString(),
      stayCode: stayCode
    };
    operationalData.addGuest(guest);
  };

  const handleCheckOut = (stayId: string) => {
    operationalData.updateStayStatus(stayId, 'CHECKED_OUT');
    toast.success("Guest checked out successfully");
  };

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
            <button 
              onClick={() => {
                setGeneratedStayCode(null);
                setNewGuest({ name: '', email: '', phone: '', status: 'REGULAR' });
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-[#292f36] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95"
            >
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
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Stay Code</th>
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
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Stay Code</th>
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
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Stay Code</th>
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
                         <span className="px-2 py-0.5 bg-[#292f36] text-white rounded-md text-[9px] font-black font-mono tracking-wider whitespace-nowrap">
                           {stay.stayCode || 'N/A'}
                         </span>
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
                         <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleCheckOut(stay.id)}
                              className="px-2 py-1 bg-red-50 text-red-600 border border-red-100 rounded-md text-[8px] font-black uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95 whitespace-nowrap"
                            >
                               Check Out
                            </button>
                            <button className="p-1.5 text-gray-300 hover:text-[#292f36] transition-colors"><MoreHorizontal size={14} /></button>
                         </div>
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
                         {guest.stayCode ? (
                           <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[9px] font-black font-mono tracking-wider whitespace-nowrap">
                             {guest.stayCode}
                           </span>
                         ) : (
                           <span className="text-[9px] font-bold text-gray-300 uppercase italic">No Active Code</span>
                         )}
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
                      <td className="p-4">
                         <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-md text-[9px] font-black font-mono tracking-wider whitespace-nowrap border border-gray-200/50">
                           {stay.stayCode || 'N/A'}
                         </span>
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

      {/* Add New Guest Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-[#292f36]/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
            >
              {!generatedStayCode ? (
                <>
                  <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#292f36] rounded-2xl flex items-center justify-center text-white">
                        <UserPlus size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-[#292f36] text-lg leading-tight">Register New Guest</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Guest Relationship Management</p>
                      </div>
                    </div>
                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-8 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input 
                              type="text" 
                              value={newGuest.name} 
                              onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                              className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#292f36]/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                              placeholder="e.g. Robert Smith"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tier Status</label>
                          <select 
                            value={newGuest.status} 
                            onChange={(e) => setNewGuest({ ...newGuest, status: e.target.value as any })}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#292f36]/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none appearance-none"
                          >
                             <option value="REGULAR">Regular Guest</option>
                             <option value="VIP">VIP Access</option>
                          </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                          <div className="relative">
                            <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input 
                              type="email" 
                              value={newGuest.email} 
                              onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                              className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#292f36]/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                              placeholder="guest@example.com"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                          <div className="relative">
                            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input 
                              type="text" 
                              value={newGuest.phone} 
                              onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                              className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#292f36]/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                              placeholder="+250 ..."
                            />
                          </div>
                        </div>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                            <Wand2 size={20} />
                        </div>
                        <div>
                            <h4 className="text-[12px] font-black text-amber-700 uppercase tracking-tight">Stay Code Generation</h4>
                            <p className="text-[11px] text-amber-600/80 font-medium leading-relaxed mt-1">A secure stay code will be automatically generated upon registration. This code must be used by the guest to access room functions and orders.</p>
                        </div>
                    </div>
                  </div>

                  <div className="p-8 border-t border-gray-100 flex items-center justify-between">
                    <button 
                      onClick={() => setIsAddModalOpen(false)}
                      className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-[#292f36] transition-all"
                    >
                      Cancel Registration
                    </button>
                    <button 
                      onClick={handleAddGuest}
                      className="flex items-center gap-2 px-8 py-4 bg-[#292f36] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                    >
                      <ShieldIcon size={16} /> Finalize Registration
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20"
                    >
                        <CheckCircle2 size={40} className="text-white" />
                    </motion.div>
                    
                    <h3 className="text-3xl font-black text-[#292f36] mb-2 tracking-tight">Guest Registered!</h3>
                    <p className="text-sm text-gray-400 font-medium mb-10">Credentials have been synced with the local operational database.</p>
                    
                    <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldIcon size={80} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Unique Stay Code</p>
                        <div className="text-5xl font-black text-[#292f36] tracking-[0.1em] font-mono">
                            {generatedStayCode}
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600">
                            <CheckCircle2 size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Active & Ready</span>
                        </div>
                    </div>

                    <p className="mt-8 text-[11px] text-gray-400 font-bold max-w-xs mx-auto leading-relaxed italic">
                        "Please provide this code to the guest. It serves as their digital key for the duration of the stay."
                    </p>

                    <button 
                      onClick={() => setIsAddModalOpen(false)}
                      className="mt-10 w-full py-4 bg-[#292f36] text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-black transition-all"
                    >
                        Dismiss & return
                    </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


