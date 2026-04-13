'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle2, AlertCircle, Trash2, BedSingle, Eraser, History, Clock, Shirt, Wind, Wrench, Droplets } from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { cn } from '@/lib/utils';
import { useGuestAuth } from '@/context/GuestAuthContext';

interface CleaningRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CleaningRequestModal({ isOpen, onClose }: CleaningRequestModalProps) {
    const { isAuthenticated, isRegistered } = useGuestAuth();
    const [selectedType, setSelectedType] = useState<'MOPPING' | 'BEDSHEET_CHANGE' | 'LAUNDRY' | 'TOWELS' | 'MAINTENANCE' | 'REFILLS' | null>(null);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const handleFetchHistory = async () => {
        try {
            const data = await apiService.getCleaningRequests();
            setHistory(data);
            setShowHistory(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        if (!selectedType) return;
        setLoading(true);
        setError('');
        try {
            await apiService.createCleaningRequest({ type: selectedType, notes });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setSelectedType(null);
                setNotes('');
            }, 2500);
        } catch (err) {
            setError('Failed to submit request. Please try again.');
            console.error(err);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 md:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20"
            >
                {/* Header */}
                <div className="p-10 bg-[#292f36] text-white relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -ml-16 -mb-16" />
                    
                    <button 
                        onClick={onClose} 
                        className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 hover:scale-110 active:scale-90 rounded-2xl transition-all group z-20 border border-white/10"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20">
                                <Sparkles className="w-8 h-8 text-accent" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight leading-none mb-2">Cleaning Services</h2>
                                <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.2em] leading-tight">Elite Hospitality Maintenance</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto CustomScroll">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center py-12">
                                <div className="w-20 h-20 bg-green-50 rounded-[32px] flex items-center justify-center mb-6 shadow-inner border-2 border-white">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-xl font-black text-[#292f36]">Request Received</h3>
                                <p className="text-sm text-gray-500 mt-2 font-medium">Our team will be with you shortly.</p>
                            </motion.div>
                        ) : showHistory ? (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-black text-[#292f36]">Request History</h3>
                                    <button onClick={() => setShowHistory(false)} className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">New Request</button>
                                </div>
                                <div className="space-y-3">
                                    {history.length > 0 ? history.map((req, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                                                    {req.type === 'MOPPING' ? <Eraser size={18} /> : <BedSingle size={18} />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-[#292f36]">{req.type.replace('_', ' ')}</p>
                                                    <p className="text-[10px] font-bold text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider",
                                                req.status === 'COMPLETED' ? "bg-green-100 text-green-600" : 
                                                req.status === 'PENDING' ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"
                                            )}>
                                                {req.status}
                                            </span>
                                        </div>
                                    )) : (
                                        <p className="text-center text-gray-400 text-xs py-8 italic">No previous requests found.</p>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {[
                                        { id: 'MOPPING', label: 'Cleaning', icon: Eraser },
                                        { id: 'BEDSHEET_CHANGE', label: 'Linens', icon: BedSingle },
                                        { id: 'LAUNDRY', label: 'Laundry', icon: Shirt },
                                        { id: 'TOWELS', label: 'Towels', icon: Wind },
                                        { id: 'MAINTENANCE', label: 'Repair', icon: Wrench },
                                        { id: 'REFILLS', label: 'Refills', icon: Droplets }
                                    ].map((item) => (
                                        <button 
                                            key={item.id}
                                            onClick={() => setSelectedType(item.id as any)}
                                            className={cn(
                                                "p-4 rounded-[24px] border-2 transition-all flex flex-col items-center gap-2",
                                                selectedType === item.id ? "border-accent bg-accent text-white shadow-lg" : "border-gray-100 text-gray-400 hover:border-gray-200"
                                            )}
                                        >
                                            <item.icon size={22} />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-center">{item.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Additional Notes (Optional)</label>
                                    <textarea 
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-[20px] outline-none focus:border-accent/30 font-bold h-24 resize-none placeholder:text-gray-300"
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                        placeholder="Specific instructions for our staff..."
                                    />
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={loading || !selectedType}
                                        className="w-full py-5 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-accent/90 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Submitting...' : 'Confirm Request'}
                                        {!loading && <CheckCircle2 size={16} />}
                                    </button>
                                    
                                    <button 
                                        onClick={handleFetchHistory} 
                                        className="w-full py-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#292f36] flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <History size={14} />
                                        View Request History
                                    </button>
                                </div>
                                {error && <p className="text-red-500 text-center text-[10px] font-bold italic flex items-center justify-center gap-2"><AlertCircle size={14}/> {error}</p>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
