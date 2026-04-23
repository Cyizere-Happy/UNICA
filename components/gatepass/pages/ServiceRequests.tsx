'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, Clock, 
  AlertCircle, Eraser, BedSingle, 
  Filter, Search, ArrowRight, User
} from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ServiceRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');

  const fetchRequests = async () => {
    try {
      const data = await apiService.getCleaningRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load service requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Poll every 30 seconds for new requests
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiService.updateCleaningStatus(id, status);
      toast.success(`Request marked as ${status.replace('_', ' ').toLowerCase()}.`);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'ALL' || req.status === filter;
    const matchesSearch = 
      req.stay?.guest?.name?.toLowerCase().includes(search.toLowerCase()) ||
      req.stay?.room?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-jost pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-[#292f36] tracking-tight flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl">
                <Sparkles className="text-accent" size={28} />
            </div>
            Service Protocol
          </h1>
          <p className="text-[13px] text-[#4d5053] font-medium max-w-md">
            Monitor and coordinate maintenance tasks requested by guests in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 flex items-center shrink-0">
                {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === f ? "bg-[#292f36] text-white shadow-lg" : "text-gray-400 hover:text-[#292f36]"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
        <input 
            type="text" 
            placeholder="Search by guest or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all shadow-sm"
        />
      </div>

      {/* Requests Table/List */}
      <div className="space-y-4">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-accent rounded-full animate-spin mb-4" />
                <p className="text-sm font-bold text-gray-400">Syncing with Protocol Engine...</p>
            </div>
        ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200 text-center px-6">
                <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-lg font-black text-[#292f36]">No Pending Protocol Tasks</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-xs font-medium">All guest requests have been addressed or no requests match your filter.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredRequests.map((req) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={req.id}
                            className="bg-white rounded-[32px] border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-xl hover:border-accent/10 transition-all group"
                        >
                            {/* Icon & Type */}
                            <div className="flex items-center gap-5 shrink-0 w-full md:w-auto">
                                <div className={cn(
                                    "w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 border-2 transition-transform group-hover:rotate-6",
                                    req.type === 'MOPPING' ? "bg-blue-50 border-blue-100 text-blue-500" : "bg-purple-50 border-purple-100 text-purple-500"
                                )}>
                                    {req.type === 'MOPPING' ? <Eraser size={28} /> : <BedSingle size={28} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-[#292f36] leading-none mb-1.5">{req.type.replace('_', ' ')}</h3>
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} className="text-gray-400" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Guest & Room Info */}
                            <div className="flex-1 flex flex-col md:flex-row items-center gap-6 w-full">
                                <div className="flex-1 flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 w-full">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                                        <User size={18} className="text-gray-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{req.stay?.room?.name || 'ROOM'}</p>
                                        <p className="font-black text-[#292f36] text-[15px] truncate">{req.stay?.guest?.name || 'Guest'}</p>
                                    </div>
                                </div>

                                <div className="flex-1 w-full bg-white p-4 rounded-2xl border border-gray-100 min-h-[72px] flex items-center">
                                    <p className="text-xs font-medium text-gray-500 italic leading-relaxed">
                                        {req.notes ? `"${req.notes}"` : 'No specific instructions provided.'}
                                    </p>
                                </div>
                            </div>

                            {/* Status & Actions */}
                            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
                                <div className={cn(
                                    "px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest min-w-[120px] text-center",
                                    getStatusStyle(req.status)
                                )}>
                                    {req.status.replace('_', ' ')}
                                </div>

                                <div className="flex items-center gap-2">
                                    {req.status === 'PENDING' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(req.id, 'IN_PROGRESS')}
                                            className="px-5 py-2.5 bg-[#292f36] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                                        >
                                            Start Task
                                        </button>
                                    )}
                                    {req.status === 'IN_PROGRESS' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(req.id, 'COMPLETED')}
                                            className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                                        >
                                            Mark Done
                                        </button>
                                    )}
                                    {req.status === 'COMPLETED' && (
                                        <div className="flex items-center gap-3">
                                            <a 
                                              href="/management/admin/notifications"
                                              className="px-5 py-2.5 bg-accent/10 text-accent rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all border border-accent/20 flex items-center gap-2"
                                            >
                                                <Eraser size={14} />
                                                Deduct Stock
                                            </a>
                                            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100">
                                                <CheckCircle2 size={20} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )}
      </div>
    </div>
  );
}
