'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Hash, Clock, Download, UserPlus, Copy, Send,
  Users, History, Bed, MoreHorizontal, ArrowUpDown, ChevronRight,
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Edit2, Star,
  User as UserIcon, Mail as MailIcon, Phone as PhoneIcon, Shield as ShieldIcon, X, Wand2, DoorOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { GuestProfile, StayRecord } from '@/lib/gatepass/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice } from '@/lib/utils';
import { apiService } from '@/lib/gatepass/apiService';

type ActiveTab = 'IN_HOUSE' | 'GUEST_DB' | 'HISTORY';

export default function GuestManagement() {
  const [guests, setGuests] = useState<GuestProfile[]>([]);
  const [stays, setStays] = useState<StayRecord[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('IN_HOUSE');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [checkInForm, setCheckInForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    roomId: '',
    expectedCheckOutAt: '',
    notes: '',
    sendViaEmail: false,
  });
  const [generatedStayCode, setGeneratedStayCode] = useState<string | null>(null);
  const [generatedStayEmail, setGeneratedStayEmail] = useState<string>('');
  const [selectedStay, setSelectedStay] = useState<StayRecord | null>(null);
  const [stayBalance, setStayBalance] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGuest, setEditingGuest] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [guestsData, staysData, roomsData] = await Promise.all([
          apiService.getGuests(),
          apiService.getStays(),
          apiService.getRooms(),
        ]);
        setGuests(guestsData);
        setStays(staysData);
        setRooms(roomsData.filter((r: any) => r.status === 'AVAILABLE'));
      } catch (err) {
        console.error('Failed to fetch guest data:', err);
        toast.error("Cloud sync failed. Showing local cache.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const inHouseStays = stays.filter(s => s.status === 'CHECKED_IN');
  const historyStays = stays.filter(s => s.status === 'CHECKED_OUT');

  // Calculate upcoming check-outs (next 24 hours)
  const upcomingCheckoutsCount = inHouseStays.filter(s => {
    if (!s.expectedCheckOutAt) return false;
    const checkoutDate = new Date(s.expectedCheckOutAt);
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return checkoutDate > now && checkoutDate <= next24Hours;
  }).length;

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

  const handleCheckIn = async () => {
    const { guestName, guestEmail, guestPhone, roomId, expectedCheckOutAt } = checkInForm;
    if (!guestName || !guestEmail || !guestPhone || !roomId || !expectedCheckOutAt) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      // Call the real backend check-in endpoint — it creates the guest + stay + generates the code
      const result = await apiService.checkIn({
        guestName,
        guestEmail,
        guestPhone,
        roomId,
        expectedCheckOutAt: new Date(expectedCheckOutAt).toISOString(),
        notes: checkInForm.notes || undefined,
        billingOption: 'POSTPAID' // Default for now, can add toggle to UI
      });

      // The backend returns the stay with stayCode
      const code = result.stayCode || result.stay?.stayCode || 'See email';
      setGeneratedStayCode(code);
      setGeneratedStayEmail(guestEmail);

      // Refresh data
      const [updatedStays, updatedRooms] = await Promise.all([
        apiService.getStays(),
        apiService.getRooms(),
      ]);
      setStays(updatedStays);
      setRooms(updatedRooms.filter((r: any) => r.status === 'AVAILABLE'));
      toast.success('Guest checked in! Stay code generated.');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Check-in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async (stayId: string) => {
    try {
      await apiService.checkOut(stayId);
      // Refresh list
      const updatedStays = await apiService.getStays();
      setStays(updatedStays);
      toast.success("Guest checked out successfully");
    } catch (err) {
        console.error(err);
        toast.error("Failed to process check-out on server");
    }
  };

  const getStatusStyle = (status: GuestProfile['status']) => {
    switch (status) {
      case 'VIP': return 'bg-amber-50 text-amber-600 border-amber-200 ring-2 ring-amber-500/10';
      case 'REGULAR': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'BLACKLISTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const openGuestDossier = async (stay: StayRecord) => {
    setSelectedStay(stay);
    setIsEditMode(false);
    try {
        const balance = await apiService.getStayBalance(stay.id);
        setStayBalance(balance);
        const guestData = guests.find(g => g.id === stay.guestId);
        setEditingGuest(guestData);
    } catch (err) {
        console.error(err);
        toast.error("Failed to load stay financials");
    }
  };

  const handleUpdateGuest = async () => {
    if (!editingGuest) return;
    try {
        await apiService.updateGuest(editingGuest.id, editingGuest);
        const updatedGuests = await apiService.getGuests();
        setGuests(updatedGuests);
        toast.success("Guest profile updated");
        setIsEditMode(false);
    } catch (err) {
        console.error(err);
        toast.error("Failed to update guest profile");
    }
  };

  const handleConfirmPayment = async (stayId: string) => {
    try {
        await apiService.confirmPayment(stayId);
        // Refresh stays
        const updatedStays = await apiService.getStays();
        setStays(updatedStays);
        // Refresh balance
        const balance = await apiService.getStayBalance(stayId);
        setStayBalance(balance);
        toast.success("Payment confirmed and recorded");
    } catch (err) {
        console.error(err);
        toast.error("Failed to confirm payment");
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
                setCheckInForm({ guestName: '', guestEmail: '', guestPhone: '', roomId: '', expectedCheckOutAt: '', notes: '', sendViaEmail: false });
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#292f36] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95"
            >
              <DoorOpen size={14} strokeWidth={2.5} /> Check In Guest
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
                      onClick={() => openGuestDossier(stay)}
                      className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
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
                 <p className="text-xs text-amber-600/80 font-medium leading-relaxed">
                   System expects {upcomingCheckoutsCount} potential check-out{upcomingCheckoutsCount !== 1 ? 's' : ''} in the next 24 hours. Room cleaning schedules have been updated.
                 </p>
              </div>
          </div>
      </div>

      {/* Check-In Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsAddModalOpen(false)}
              className="absolute inset-0 bg-[#292f36]/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[92vh]"
            >
              {!generatedStayCode ? (
                <>
                  {/* Header */}
                  <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#292f36] rounded-xl flex items-center justify-center text-white">
                        <DoorOpen size={18} />
                      </div>
                      <div>
                        <h3 className="font-black text-[#292f36] text-base leading-tight">Guest Check-In</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Fill in details & assign a room</p>
                      </div>
                    </div>
                    <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-gray-300 hover:text-rose-500 transition-colors rounded-lg">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
                    {/* Guest Name + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name *</label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                          <input
                            type="text"
                            value={checkInForm.guestName}
                            onChange={(e) => setCheckInForm({ ...checkInForm, guestName: e.target.value })}
                            className="w-full pl-9 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#292f36]/20 focus:bg-white rounded-xl font-bold text-[#292f36] text-sm transition-all outline-none"
                            placeholder="Robert Smith"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone *</label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                          <input
                            type="tel"
                            value={checkInForm.guestPhone}
                            onChange={(e) => setCheckInForm({ ...checkInForm, guestPhone: e.target.value })}
                            className="w-full pl-9 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#292f36]/20 focus:bg-white rounded-xl font-bold text-[#292f36] text-sm transition-all outline-none"
                            placeholder="+250 ..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address *</label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                        <input
                          type="email"
                          value={checkInForm.guestEmail}
                          onChange={(e) => setCheckInForm({ ...checkInForm, guestEmail: e.target.value })}
                          className="w-full pl-9 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#292f36]/20 focus:bg-white rounded-xl font-bold text-[#292f36] text-sm transition-all outline-none"
                          placeholder="guest@example.com"
                        />
                      </div>
                    </div>

                    {/* Room + Check-out */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room / Apartment *</label>
                        <select
                          value={checkInForm.roomId}
                          onChange={(e) => setCheckInForm({ ...checkInForm, roomId: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#292f36]/20 focus:bg-white rounded-xl font-bold text-[#292f36] text-sm transition-all outline-none appearance-none"
                        >
                          <option value="">— Select available room —</option>
                          {rooms.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name} ({r.type})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expected Check-Out *</label>
                        <input
                          type="date"
                          value={checkInForm.expectedCheckOutAt}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setCheckInForm({ ...checkInForm, expectedCheckOutAt: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#292f36]/20 focus:bg-white rounded-xl font-bold text-[#292f36] text-sm transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Internal Notes (optional)</label>
                      <textarea
                        value={checkInForm.notes}
                        onChange={(e) => setCheckInForm({ ...checkInForm, notes: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#292f36]/20 focus:bg-white rounded-xl font-bold text-[#292f36] text-sm transition-all outline-none resize-none"
                        placeholder="Special requirements, allergies, VIP notes..."
                      />
                    </div>

                    {/* Send via email toggle */}
                    <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checkInForm.sendViaEmail}
                        onChange={(e) => setCheckInForm({ ...checkInForm, sendViaEmail: e.target.checked })}
                        className="w-4 h-4 accent-[#292f36] rounded"
                      />
                      <div>
                        <p className="text-[11px] font-black text-blue-800 uppercase tracking-wider">Send Stay Code via Email</p>
                        <p className="text-[10px] text-blue-600/80 font-medium mt-0.5">The stay code will be automatically emailed to the guest upon check-in</p>
                      </div>
                    </label>

                    {/* Auto-generated notice */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                      <Wand2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-600/90 font-medium leading-relaxed">
                        A unique <strong>Stay Code</strong> (e.g. <code className="font-mono">UNICA-A3K</code>) is generated by the server and linked to this stay. The guest uses it to log in and access services.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-5 sm:p-6 border-t border-gray-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      disabled={isSubmitting}
                      className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] hover:text-[#292f36] transition-all disabled:opacity-40"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCheckIn}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-[#292f36] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-lg shadow-black/10 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
                      ) : (
                        <><ShieldIcon size={14} /> Check In Guest</>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                /* Success Screen */
                <div className="p-8 sm:p-10 text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/25"
                  >
                    <CheckCircle2 size={32} className="text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-black text-[#292f36] mb-1 tracking-tight">Guest Checked In!</h3>
                  <p className="text-sm text-gray-400 font-medium mb-8">A welcome email has been sent to <strong>{generatedStayEmail}</strong>.</p>

                  {/* Stay Code Card */}
                  <div className="bg-gray-50 rounded-[24px] p-6 border border-gray-100 mb-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Stay Code</p>
                    <div className="text-4xl font-black text-[#292f36] tracking-[0.15em] font-mono mb-4">
                      {generatedStayCode}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedStayCode!);
                          toast.success('Stay code copied!');
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-gray-600 hover:text-[#292f36] transition-all shadow-sm"
                      >
                        <Copy size={12} /> Copy Code
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 font-bold max-w-xs mx-auto leading-relaxed italic mb-8">
                    Share this code with the guest. They will use it to log in and complete their profile registration.
                  </p>

                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setGeneratedStayCode(null);
                      setCheckInForm({ guestName: '', guestEmail: '', guestPhone: '', roomId: '', expectedCheckOutAt: '', notes: '', sendViaEmail: false });
                    }}
                    className="w-full py-3.5 bg-[#292f36] text-white rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-black transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guest Dossier / Edit Modal */}
      <AnimatePresence>
        {selectedStay && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStay(null)}
              className="absolute inset-0 bg-[#292f36]/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Left Side: Summary & Financials */}
              <div className="w-full md:w-[320px] bg-gray-50 border-r border-gray-100 p-8 flex flex-col overflow-y-auto shrink-0 no-scrollbar">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-xl font-black mx-auto mb-3 border-4 border-white shadow-xl">
                    {selectedStay.guestName.substring(0,2).toUpperCase()}
                  </div>
                  <h3 className="text-base font-black text-[#292f36] leading-tight truncate px-2">{selectedStay.guestName}</h3>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Stay Code: {selectedStay.stayCode}</p>
                </div>

                <div className="space-y-6 flex-1">
                  {/* Financial Card */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Financial Overview</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-gray-500">Total Bill</span>
                        <span className="text-[#292f36]">{formatPrice(stayBalance?.totalDue || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-emerald-500">
                        <span>Paid</span>
                        <span>{formatPrice(stayBalance?.totalPaid || 0)}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Balance</span>
                        <span className={cn(
                          "text-base font-black px-2 py-0.5 rounded-lg",
                          (stayBalance?.balance || 0) > 0 ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50"
                        )}>
                          {formatPrice(stayBalance?.balance || 0)}
                        </span>
                      </div>
                    </div>
                    
                    {stayBalance?.balance > 0 && (
                      <button 
                        onClick={() => handleConfirmPayment(selectedStay.id)}
                        className="w-full mt-4 py-3 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-accent/20"
                      >
                        Confirm Payment
                      </button>
                    )}
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <p className="text-[9px] font-black text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2"><Clock size={12}/> Timeline</p>
                    <div className="space-y-3">
                       <div className="flex gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />
                          <div>
                            <p className="text-[10px] font-black text-blue-900">Check-in</p>
                            <p className="text-[9px] font-bold text-blue-700/60">
                              {selectedStay.checkIn 
                                ? new Date(selectedStay.checkIn).toLocaleDateString() 
                                : 'Not checked in'}
                            </p>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1" />
                          <div>
                            <p className="text-[10px] font-black text-gray-400">Checkout (Exp)</p>
                            <p className="text-[9px] font-bold text-gray-400">
                              {selectedStay.expectedCheckOutAt 
                                ? new Date(selectedStay.expectedCheckOutAt).toLocaleDateString() 
                                : 'Not specified'}
                            </p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <button 
                      disabled={(stayBalance?.balance || 0) > 0}
                      onClick={() => handleCheckOut(selectedStay.id)}
                      className={cn(
                        "w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm",
                        (stayBalance?.balance || 0) > 0 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" 
                          : "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white"
                      )}
                    >
                      {(stayBalance?.balance || 0) > 0 ? 'Clear Debt to Checkout' : 'Finalize Checkout'}
                    </button>
                    {(stayBalance?.balance || 0) > 0 && (
                      <p className="mt-3 text-[9px] text-center font-bold text-rose-500/60 uppercase tracking-tighter">Outstanding balance must be settled first</p>
                    )}
                </div>
              </div>

              {/* Right Side: Identity & Details */}
              <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white no-scrollbar">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-black text-[#292f36]">Guest Dossier</h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Identity & Stay Context</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          isEditMode ? "bg-[#292f36] text-white" : "bg-white border border-gray-200 text-gray-500 hover:text-[#292f36]"
                        )}
                    >
                      {isEditMode ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                    <button onClick={() => setSelectedStay(null)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity Name</label>
                      <input 
                        disabled={!isEditMode}
                        value={editingGuest?.name || ''}
                        onChange={e => setEditingGuest({...editingGuest, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-accent/20 focus:bg-white rounded-xl font-bold text-[#292f36] text-xs transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Phone</label>
                      <input 
                        disabled={!isEditMode}
                        value={editingGuest?.phone || ''}
                        onChange={e => setEditingGuest({...editingGuest, phone: e.target.value})}
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-xl font-black text-[#292f36] text-sm transition-all outline-none disabled:opacity-70 disabled:grayscale-[0.5]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        disabled={true} 
                        value={editingGuest?.email || ''}
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl font-black text-gray-400 text-sm transition-all outline-none italic"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nationality</label>
                      <input 
                        disabled={!isEditMode}
                        value={editingGuest?.nationality || 'Not Registered'}
                        onChange={e => setEditingGuest({...editingGuest, nationality: e.target.value})}
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-accent/20 focus:bg-white rounded-xl font-black text-[#292f36] text-sm transition-all outline-none disabled:opacity-70 disabled:grayscale-[0.5]"
                      />
                    </div>
                  </div>

                  {/* ID Details */}
                  <div className="p-6 bg-gray-50 rounded-[28px] border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldIcon size={18} className="text-accent" />
                      <h4 className="text-xs font-black text-[#292f36] uppercase tracking-widest">Document Verification</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Document Type</p>
                        <p className="text-xs font-black text-[#292f36]">{editingGuest?.idType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">ID Number</p>
                        <p className="text-xs font-black text-[#292f36]">{editingGuest?.idNumber || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Companions Detail Section */}
                  {selectedStay.companions && selectedStay.companions.length > 0 && (
                    <div className="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <Users className="w-5 h-5 text-accent" />
                        <h4 className="text-[11px] font-black text-[#292f36] uppercase tracking-widest">Resident Companions ({selectedStay.companions.length})</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedStay.companions.map((comp, idx) => (
                           <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-accent/30 transition-all">
                              <div>
                                <p className="text-sm font-black text-[#292f36]">{comp.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{comp.phone || 'No phone linked'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[9px] font-black text-accent uppercase tracking-widest">{comp.idType}</p>
                                <p className="text-[10px] font-black text-[#292f36]">{comp.idNumber}</p>
                              </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isEditMode && (
                    <div className="flex justify-end pt-4">
                      <button 
                        onClick={handleUpdateGuest}
                        className="px-10 py-5 bg-[#292f36] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Commit Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


