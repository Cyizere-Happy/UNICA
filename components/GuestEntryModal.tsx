'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, UserPlus, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useGuestAuth } from '@/context/GuestAuthContext';
import { cn } from '@/lib/utils';
import Lottie from 'lottie-react';

// New Lottie animation for verification/travel
const verificationLottie = "https://lottie.host/7e04f0f9-251c-43f1-945b-4375b404d412/1v7a87e5b0.json";

export default function GuestEntryModal() {
  const { entryModalOpen, setEntryModalOpen, verifyStayCode, registerGuest, isAuthenticated, isRegistered } = useGuestAuth();
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roomNumber: ''
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const success = await verifyStayCode(code);
    if (success) {
      setStep(2);
    } else {
      setError('Invalid Stay Code.');
    }
    setLoading(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerGuest(formData);
  };

  if (!entryModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 md:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setEntryModalOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[24px] md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-hidden"
      >
        {/* Left Column: Visual/Mascot */}
        <div className="w-full md:w-[42%] bg-[#4d668f] relative flex flex-col items-center justify-center p-8 md:p-12 text-center text-white shrink-0 min-h-[200px] md:min-h-auto">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="relative z-10 w-32 md:w-full max-w-[240px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step === 3 || (step === 2 && isRegistered) ? 'welcome' : 'verifying'}
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                        className="relative bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-[40px] border border-white/10 shadow-2xl"
                    >
                        <Image 
                            src={step === 3 || (step === 2 && isRegistered) 
                              ? "/unica_mascot_welcome.png" 
                              : "/unica_mascot_verifying.png"
                            }
                            alt="Unica Mascot"
                            width={300}
                            height={300}
                            className="w-full h-auto drop-shadow-2xl object-contain rounded-2xl"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-4 md:mt-8 relative z-10 hidden md:block">
                <h3 className="text-xl md:text-2xl font-black mb-2">
                    {step === 1 ? 'Priority Access' : 'Almost There!'}
                </h3>
                <p className="text-white/70 text-xs md:text-sm font-medium leading-relaxed max-w-[200px]">
                    {step === 1 
                      ? 'Enter your unique stay code to unlock premium guest services.' 
                      : 'Just a final registration to get you started with UNICA.'}
                </p>
            </div>
            
            {/* Decorations */}
            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 flex gap-1.5">
                {[1, 2, 3].map(i => (
                    <div key={i} className={cn("w-1 h-1 rounded-full", step === i ? "bg-white" : "bg-white/20")} />
                ))}
            </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-[58%] p-6 md:p-12 relative flex flex-col bg-white">
            <button 
                onClick={() => setEntryModalOpen(false)} 
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-black/5 rounded-full transition-all group z-20"
            >
                <X className="w-5 h-5 text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 md:py-8">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 md:space-y-8"
                        >
                            <div className="space-y-2 text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-black text-[#292f36]">Resident Login</h2>
                                <p className="text-xs md:text-sm font-medium text-gray-500">Provide your approved stay code to order.</p>
                            </div>

                            <form onSubmit={handleVerify} className="space-y-5 md:space-y-6">
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[10px] font-black text-[#292f36] uppercase tracking-[0.2em] ml-1">
                                        Stay Code
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="Enter your code"
                                            className={cn(
                                                "w-full px-5 md:px-6 py-3.5 md:py-4 bg-gray-50 border border-black/5 rounded-xl md:rounded-2xl outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-[#292f36] placeholder:text-gray-300",
                                                error && "border-red-200 bg-red-50 focus:ring-red-500/5 focus:border-red-500/40"
                                            )}
                                            required
                                        />
                                        {code && !error && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    {error && (
                                        <p className="flex items-center gap-2 text-red-500 text-[10px] font-bold leading-tight px-1 italic">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            {error}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 md:py-5 bg-[#292f36] text-white rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-black hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 group"
                                >
                                    {loading ? 'Validating...' : 'Join Now'}
                                    {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>

                            <p className="text-center text-[10px] text-gray-400 font-medium">
                                By entering, you agree to our <span className="text-[#292f36] font-bold cursor-pointer hover:underline">Privacy Policy</span> and <span className="text-[#292f36] font-bold cursor-pointer hover:underline">Terms of Use</span>.
                            </p>
                        </motion.div>
                    ) : !isRegistered ? (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 md:space-y-8"
                        >
                            <div className="space-y-2 text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-black text-[#292f36]">Member Info</h2>
                                <p className="text-xs md:text-sm font-medium text-gray-500">Just a few details to finalize your access.</p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-4 md:space-y-5">
                                <div className="grid gap-4">
                                    <div className="space-y-1.5 md:space-y-2 text-left">
                                        <label className="text-[10px] font-black text-[#292f36] uppercase tracking-widest ml-1 block">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-gray-50 border border-black/5 rounded-xl md:rounded-2xl outline-none focus:border-accent/30 transition-all font-bold"
                                            placeholder="Guest Name"
                                        />
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2 text-left">
                                        <label className="text-[10px] font-black text-[#292f36] uppercase tracking-widest ml-1 block">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-gray-50 border border-black/5 rounded-xl md:rounded-2xl outline-none focus:border-accent/30 transition-all font-bold"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2 text-left">
                                        <label className="text-[10px] font-black text-[#292f36] uppercase tracking-widest ml-1 block">Room Number</label>
                                        <input
                                            type="text"
                                            value={formData.roomNumber}
                                            onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
                                            className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-gray-50 border border-black/5 rounded-xl md:rounded-2xl outline-none focus:border-accent/30 transition-all font-bold"
                                            placeholder="Room #"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 md:py-5 bg-accent text-white rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-accent/90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    Activate Membership
                                    <CheckCircle2 className="w-4 h-4" />
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="w-20 md:w-24 h-20 md:h-24 bg-green-100 rounded-[24px] md:rounded-[32px] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner">
                                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-[#292f36] mb-3 md:mb-4">You&apos;re All Set!</h3>
                            <p className="text-gray-500 text-[13px] md:text-sm leading-relaxed mb-8 md:mb-10 max-w-[280px] mx-auto font-medium">
                                Welcome back! You now have full access to our residential dining services.
                            </p>
                            <button
                                onClick={() => setEntryModalOpen(false)}
                                className="w-full py-4 md:py-5 bg-[#292f36] text-white rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all"
                            >
                                Start Ordering
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
