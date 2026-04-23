'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, ShieldCheck, UserPlus, ArrowRight, CheckCircle2, 
    AlertCircle, Globe, CreditCard, MapPin, 
    Calendar, Clock, Users, ArrowLeft, Building2, Hotel
} from 'lucide-react';
import Image from 'next/image';
import { useGuestAuth } from '@/context/GuestAuthContext';
import { cn } from '@/lib/utils';

type IdType = 'NATIONAL_ID' | 'PASSPORT' | 'RESIDENCE_PERMIT';
type StayType = 'ROOM' | 'APARTMENT';

interface Companion {
    name: string;
    nationality: string;
    idType: IdType;
    idNumber: string;
    phone: string;
}

export default function GuestEntryModal() {
    const { 
        entryModalOpen, 
        setEntryModalOpen, 
        verifyStayCode, 
        registerGuest, 
        isAuthenticated, 
        isRegistered,
        logout,
        guestUser
    } = useGuestAuth() as any;

    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        nationality: 'Rwandan',
        idType: 'NATIONAL_ID' as IdType,
        idNumber: '',
        residenceAddress: '',
        stayType: 'ROOM' as StayType,
        purposeOfVisit: 'Tourism',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        numAdditionalGuests: 0,
        checkInAt: '',
        expectedCheckOutAt: ''
    });

    const [companions, setCompanions] = useState<Companion[]>([]);
    const [currentCompanionIdx, setCurrentCompanionIdx] = useState(0);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const success = await verifyStayCode(code);
        if (success) {
            // Check if profile is already complete
            // We use a small timeout to let the context state settle or just check if we should proceed
            // Actually, the useEffect in this component handles step transition based on isRegistered
            // So we just need to NOT close the modal if they aren't registered yet.
            
            // Note: isRegistered is updated by verifyStayCode in the context
        } else {
            setError('Invalid Stay Code.');
        }
        setLoading(false);
    };

    const nextStep = () => {
        if (step === 3) {
            if (form.numAdditionalGuests > 0) {
                // Initialize companions array if empty or size changed
                if (companions.length !== form.numAdditionalGuests) {
                    const newComps = Array(form.numAdditionalGuests).fill(null).map((_, i) => 
                        companions[i] || { name: '', nationality: 'Rwandan', idType: 'NATIONAL_ID', idNumber: '', phone: '' }
                    );
                    setCompanions(newComps);
                }
                setStep(4);
                setCurrentCompanionIdx(0);
            } else {
                setStep(5); // Skip Step 4 (Companions) if solo
            }
        } else if (step === 4 && currentCompanionIdx < form.numAdditionalGuests - 1) {
            setCurrentCompanionIdx(prev => prev + 1);
        } else {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (step === 4 && currentCompanionIdx > 0) {
            setCurrentCompanionIdx(prev => prev - 1);
        } else if (step === 5 && form.numAdditionalGuests === 0) {
            setStep(3); // Go back from Stay Details to Group if solo
        } else {
            setStep(prev => prev - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const success = await registerGuest({ ...form, companions });
        if (success) {
            setStep(6); // Success step
        } else {
            setError('Registration failed. Please check your data.');
        }
        setLoading(false);
    };

    // Reset state when modal opens
    React.useEffect(() => {
        if (entryModalOpen) {
            if (!isAuthenticated) {
                setStep(1);
            } else if (!isRegistered) {
                setStep(2);
            } else {
                setStep(6);
            }
            setError('');
        }
    }, [entryModalOpen, isAuthenticated, isRegistered]);

    if (!entryModalOpen) return null;

    const progress = (step / 5) * 100;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 md:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                    if (isAuthenticated && !isRegistered) return;
                    setEntryModalOpen(false);
                }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px] max-h-[90vh]"
            >
                {/* Visual Sidebar */}
                <div className="w-full md:w-[32%] bg-accent relative flex flex-col p-6 md:p-10 text-white shrink-0 hidden md:flex overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
                    
                    <div className="relative z-10 flex-1 flex flex-col justify-between py-4">
                        <div className="mb-0">
                             <div className="relative w-full aspect-square max-w-[180px] mx-auto mb-8 rounded-[38px] overflow-hidden shadow-2xl border-4 border-white/20 group hover:scale-105 transition-transform duration-700">
                                <Image 
                                    src={step === 1 ? "/unica_mascot_welcome.png" : "/admin_mascot_register.png"}
                                    alt="Mascot"
                                    fill
                                    className="object-cover"
                                />
                             </div>
                            <h2 className="text-2xl font-black tracking-tight leading-tight mb-3">
                                {step === 1 ? 'Welcome to Unicavilla.' : 'Finalizing Your Stay.'}
                            </h2>
                            <p className="text-white/80 text-xs font-medium leading-relaxed">
                                {step === 1 
                                    ? 'Enter your premium stay code to begin your personalized UNICA journey.'
                                    : 'Please provide accurate details as requested by law and for your safety.'}
                            </p>
                        </div>

                        {/* Step Indicators */}
                        <div className="space-y-8 my-10">
                            {[
                                { s: 1, label: 'Verification', icon: ShieldCheck },
                                { s: 2, label: 'Primary Guest', icon: UserPlus },
                                { s: 4, label: 'Companions', icon: Users, hideOnSolo: true },
                                { s: 5, label: 'Stay Details', icon: Calendar },
                            ]
                            .filter(item => !item.hideOnSolo || form.numAdditionalGuests > 0)
                            .map((item) => (
                                <div key={item.s} className={cn(
                                    "flex items-center gap-5 transition-all duration-500",
                                    step < item.s ? "opacity-20 grayscale" : "opacity-100",
                                    step === item.s ? "translate-x-2" : ""
                                )}>
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all",
                                        step === item.s ? "bg-white text-accent shadow-[0_4px_20px_rgba(255,255,255,0.4)]" : "bg-white/10 text-white"
                                    )}>
                                        <item.icon size={18} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-[0.15em]",
                                        step === item.s ? "text-white" : "text-white/60"
                                    )}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                             <motion.div 
                                className="h-full bg-white transition-all duration-1000"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                             />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 md:p-10 relative flex flex-col bg-white overflow-y-auto CustomScroll">
                    {(!isAuthenticated || isRegistered) && (
                        <button
                            onClick={() => setEntryModalOpen(false)}
                            className="absolute top-6 right-6 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-all group z-20"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    )}

                    <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full py-4">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl md:text-4xl font-black text-[#292f36] tracking-tight">Welcome to UNICA.</h3>
                                        <p className="text-sm font-medium text-gray-500 mt-2">Enter your approved stay code provided by reception.</p>
                                    </div>
                                    
                                    <form onSubmit={handleVerify} className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#292f36] uppercase tracking-[0.2em] ml-1">Access Code</label>
                                            <input
                                                type="text"
                                                value={code}
                                                onChange={e => setCode(e.target.value.toUpperCase())}
                                                placeholder="UNICA-XXX"
                                                className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/30 transition-all font-black text-xl tracking-widest text-center"
                                                required
                                            />
                                            {error && <p className="text-red-500 text-[11px] font-bold italic flex items-center gap-2"><AlertCircle size={14}/> {error}</p>}
                                        </div>
                                        <button disabled={loading} className="w-full py-5 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-accent/90 transition-all flex items-center justify-center gap-3 active:scale-95">
                                            {loading ? 'Validating...' : 'Unlock Membership'}
                                            {!loading && <ArrowRight size={16} />}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-[#292f36]">Primary Guest Info</h3>
                                        <span className="text-[10px] font-black text-accent uppercase bg-accent/5 px-2 py-1 rounded-md">Step 2 of 5</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-bold"
                                                value={form.name}
                                                onChange={e => setForm({...form, name: e.target.value})}
                                                placeholder="Enter your full names"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                            <input 
                                                type="email" 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-bold"
                                                value={form.email}
                                                onChange={e => setForm({...form, email: e.target.value})}
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                            <input 
                                                type="tel" 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-bold"
                                                value={form.phone}
                                                onChange={e => setForm({...form, phone: e.target.value})}
                                                placeholder="+250..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Globe size={12}/> Nationality</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-bold"
                                                value={form.nationality}
                                                onChange={e => setForm({...form, nationality: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><CreditCard size={12}/> ID Type</label>
                                            <select 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-bold appearance-none"
                                                value={form.idType}
                                                onChange={e => setForm({...form, idType: e.target.value as IdType})}
                                            >
                                                <option value="NATIONAL_ID">National ID</option>
                                                <option value="PASSPORT">Passport</option>
                                                <option value="RESIDENCE_PERMIT">Residence Permit</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5 col-span-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ID / Document Number</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-bold"
                                                value={form.idNumber}
                                                onChange={e => setForm({...form, idNumber: e.target.value})}
                                                placeholder={`Enter your ${form.idType.replace('_', ' ')} Number`}
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><MapPin size={12}/> Residential Address</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-bold"
                                                value={form.residenceAddress}
                                                onChange={e => setForm({...form, residenceAddress: e.target.value})}
                                                placeholder="Street, City, Country"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button onClick={prevStep} className="flex-1 py-4 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#292f36] transition-all">Back</button>
                                        <button onClick={nextStep} className="flex-[2] py-4 bg-[#292f36] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all">Next Details</button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="text-center">
                                        <Users className="w-16 h-16 text-accent mx-auto mb-6 bg-accent/5 p-4 rounded-3xl" />
                                        <h3 className="text-2xl font-black text-[#292f36]">Group Registration</h3>
                                        <p className="text-sm font-medium text-gray-500 mt-2">Are you traveling with others? We need their details too.</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-center mb-4">Number of Additional Guests</label>
                                        <div className="flex items-center justify-center gap-6">
                                            <button 
                                                onClick={() => setForm({...form, numAdditionalGuests: Math.max(0, form.numAdditionalGuests - 1)})}
                                                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-2xl font-black text-[#292f36] hover:shadow-md transition-all active:scale-90"
                                            >-</button>
                                            <span className="text-4xl font-black text-[#292f36] w-12 text-center">{form.numAdditionalGuests}</span>
                                            <button 
                                                onClick={() => setForm({...form, numAdditionalGuests: Math.min(10, form.numAdditionalGuests + 1)})}
                                                className="w-12 h-12 rounded-2xl bg-[#292f36] text-white flex items-center justify-center text-2xl font-black hover:shadow-xl transition-all active:scale-90"
                                            >+</button>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button onClick={prevStep} className="flex-1 py-4 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#292f36] transition-all">Back</button>
                                        <button onClick={nextStep} className="flex-[2] py-4 bg-[#292f36] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all">
                                            {form.numAdditionalGuests > 0 ? 'Register Guests' : 'Continue Solo'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div key="companion" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-black text-[#292f36]">Guest #{currentCompanionIdx + 1}</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Companion Info</p>
                                        </div>
                                        <span className="text-[10px] font-black text-accent bg-accent/5 px-2 py-1 rounded-md">
                                            {currentCompanionIdx + 1} of {form.numAdditionalGuests}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-bold"
                                                value={companions[currentCompanionIdx]?.name || ''}
                                                onChange={e => {
                                                    const newComps = [...companions];
                                                    newComps[currentCompanionIdx] = { ...newComps[currentCompanionIdx], name: e.target.value };
                                                    setCompanions(newComps);
                                                }}
                                                placeholder="Companion's full names"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nationality</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-bold"
                                                value={companions[currentCompanionIdx]?.nationality || ''}
                                                onChange={e => {
                                                    const newComps = [...companions];
                                                    newComps[currentCompanionIdx] = { ...newComps[currentCompanionIdx], nationality: e.target.value };
                                                    setCompanions(newComps);
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ID Type</label>
                                            <select 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-bold appearance-none"
                                                value={companions[currentCompanionIdx]?.idType || 'NATIONAL_ID'}
                                                onChange={e => {
                                                    const newComps = [...companions];
                                                    newComps[currentCompanionIdx] = { ...newComps[currentCompanionIdx], idType: e.target.value as IdType };
                                                    setCompanions(newComps);
                                                }}
                                            >
                                                <option value="NATIONAL_ID">National ID</option>
                                                <option value="PASSPORT">Passport</option>
                                                <option value="RESIDENCE_PERMIT">Residence Permit</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ID Number</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-bold"
                                                value={companions[currentCompanionIdx]?.idNumber || ''}
                                                onChange={e => {
                                                    const newComps = [...companions];
                                                    newComps[currentCompanionIdx] = { ...newComps[currentCompanionIdx], idNumber: e.target.value };
                                                    setCompanions(newComps);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button onClick={prevStep} className="flex-1 py-4 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-accent transition-all">Back</button>
                                        <button onClick={nextStep} className="flex-[2] py-4 bg-accent text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-accent/90 transition-all">
                                            {currentCompanionIdx < form.numAdditionalGuests - 1 ? 'Next Guest' : 'Review Stay'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 5 && (
                                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="flex items-center justify-between space-x-4">
                                        <h3 className="text-2xl font-black text-[#292f36]">Stay Configuration</h3>
                                        <span className="text-[10px] font-black text-accent bg-accent/5 px-2 py-1 rounded-md">Step 5 of 5</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Accommodation Type</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button 
                                                    onClick={() => setForm({...form, stayType: 'ROOM'})}
                                                    className={cn(
                                                        "p-4 rounded-[24px] border-2 transition-all flex flex-col items-center gap-2",
                                                        form.stayType === 'ROOM' ? "border-[#292f36] bg-[#292f36] text-white shadow-xl" : "border-gray-100 text-gray-400 hover:border-gray-200"
                                                    )}
                                                >
                                                    <Hotel size={24} />
                                                    <span className="text-[11px] font-black uppercase tracking-wider">One-Night Stay</span>
                                                </button>
                                                <button 
                                                    onClick={() => setForm({...form, stayType: 'APARTMENT'})}
                                                    className={cn(
                                                        "p-4 rounded-[24px] border-2 transition-all flex flex-col items-center gap-2",
                                                        form.stayType === 'APARTMENT' ? "border-[#292f36] bg-[#292f36] text-white shadow-xl" : "border-gray-100 text-gray-400 hover:border-gray-200"
                                                    )}
                                                >
                                                    <Building2 size={24} />
                                                    <span className="text-[11px] font-black uppercase tracking-wider">Apartment</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Calendar size={12}/> Check-In Date</label>
                                                <input 
                                                    type="date" 
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-black text-lg"
                                                    value={form.checkInAt ? form.checkInAt.substring(0, 10) : ''}
                                                    onChange={e => setForm({...form, checkInAt: new Date(e.target.value).toISOString()})}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Calendar size={12}/> Check-Out Date</label>
                                                <input 
                                                    type="date" 
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-accent/30 font-black text-lg"
                                                    value={form.expectedCheckOutAt ? form.expectedCheckOutAt.substring(0, 10) : ''}
                                                    onChange={e => setForm({...form, expectedCheckOutAt: new Date(e.target.value).toISOString()})}
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-accent/5 rounded-[24px] p-6 border border-accent/10">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] font-black text-accent uppercase tracking-widest">Pricing Overview</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-bold text-gray-400">Total Bill</span>
                                                    <span className="text-xl font-black text-accent">${guestUser?.roomPrice || 0}</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-medium text-gray-500 leading-relaxed italic">
                                                 This amount covers your room stay. Any Food & Beverage or Premium services will be added to your final statement at checkout.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button onClick={prevStep} className="flex-1 py-4 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#292f36] transition-all">Back</button>
                                        <button onClick={handleSubmit} disabled={loading} className="flex-[2] py-4 bg-accent text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-2">
                                            {loading ? 'Activating...' : 'Activate Membership'}
                                            {!loading && <CheckCircle2 size={16} />}
                                        </button>
                                    </div>
                                    {error && <p className="text-red-500 text-center text-[10px] font-bold italic">{error}</p>}
                                </motion.div>
                            )}

                            {step === 6 && (
                                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                                    <div className="w-24 h-24 bg-green-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-white shadow-green-100/50">
                                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-[#292f36] mb-4">You&apos;re a Member!</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-[300px] mx-auto font-medium">
                                        Your registration is complete. Welcome to the UNICA family. You now have full access to our premium hospitality services.
                                    </p>
                                    <button
                                        onClick={() => setEntryModalOpen(false)}
                                        className="w-full py-5 bg-[#292f36] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-black hover:-translate-y-1 transition-all active:translate-y-0"
                                    >
                                        Enter Guest Portal
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
