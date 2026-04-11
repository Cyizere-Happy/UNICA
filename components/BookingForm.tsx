'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Mail, Phone, User, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room } from '@/lib/data';

interface BookingFormProps {
    room: Room;
    onSuccess?: () => void;
}

export const BookingForm = ({ room, onSuccess }: BookingFormProps) => {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        specialRequests: ''
    });

    const steps = [
        { id: 1, name: 'Basic Details', icon: User },
        { id: 2, name: 'Booking Details', icon: Calendar },
        { id: 3, name: 'Confirmation', icon: CheckCircle2 },
    ];

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isStepValid = () => {
        if (step === 1) {
            return formData.fullName && formData.email && formData.phone;
        }
        if (step === 2) {
            return formData.checkIn && formData.checkOut;
        }
        return true;
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-bloom border border-black/5">
            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <motion.div
                        key="form-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Header / Progress */}
                        <div className="p-6 md:p-8 pb-4 text-center">
                            <h2 className="text-xl font-black text-[#292f36] mb-4 md:mb-8">Book Your Stay</h2>

                            {/* Progress Bar */}
                            <div className="relative max-w-lg mx-auto mb-8 md:mb-12 px-6">
                                <div className="absolute top-5 left-12 right-12 h-0.5 bg-zinc-100 z-0" />
                                <motion.div
                                    className="absolute top-5 left-12 h-0.5 bg-accent z-0"
                                    initial={{ right: 'auto', width: '0%' }}
                                    animate={{ 
                                        width: step === 1 ? '0%' : step === 2 ? 'calc(50% - 24px)' : 'calc(100% - 96px)'
                                    }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />

                                <div className="relative z-10 grid grid-cols-3">
                                    {steps.map((s) => {
                                        const active = step >= s.id;
                                        const current = step === s.id;

                                        return (
                                            <div key={s.id} className="flex flex-col items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 bg-white",
                                                    active ? "border-accent text-accent shadow-lg shadow-accent/10" : "border-zinc-200 text-zinc-400"
                                                )}>
                                                    {active && step > s.id ? (
                                                        <CheckCircle2 className="w-6 h-6 text-accent" />
                                                    ) : (
                                                        <span className={cn("text-xs font-black", current && "text-accent")}>{s.id}</span>
                                                    )}
                                                </div>
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase tracking-[0.15em] text-center max-w-[80px]",
                                                    current ? "text-accent" : "text-zinc-400"
                                                )}>
                                                    {s.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (step < 3) {
                                nextStep();
                            } else {
                                setIsSubmitted(true);
                                // Removed automatic onSuccess timeout to allow user to dismiss manually
                            }
                        }} className="p-6 md:p-8 pt-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    {step === 1 && (
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter your full name"
                                                        className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            placeholder="your@email.com"
                                                            className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone Number</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            placeholder="+1 (555) 000-0000"
                                                            className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-3 md:space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                                                <div className="space-y-1.5 md:space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Check-in Date</label>
                                                    <div className="relative cursor-pointer">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                        <input
                                                            type="date"
                                                            name="checkIn"
                                                            value={formData.checkIn}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-zinc-50 border-none rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5 md:space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Check-out Date</label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                        <input
                                                            type="date"
                                                            name="checkOut"
                                                            value={formData.checkOut}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-zinc-50 border-none rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
 
                                            <div className="space-y-1.5 md:space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Number of Guests</label>
                                                <div className="relative">
                                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                    <select
                                                        name="guests"
                                                        value={formData.guests}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-zinc-50 border-none rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all outline-none appearance-none"
                                                    >
                                                        {[1, 2, 3, 4, 5, 6].map(n => (
                                                            <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90" />
                                                </div>
                                            </div>
 
                                            <div className="space-y-1.5 md:space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Special Requests (Optional)</label>
                                                <textarea
                                                    name="specialRequests"
                                                    value={formData.specialRequests}
                                                    onChange={handleInputChange}
                                                    placeholder="Any special requirements?"
                                                    rows={2}
                                                    className="w-full bg-zinc-50 border-none rounded-xl md:rounded-2xl p-3 md:p-4 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="space-y-4 md:space-y-6">
                                            <div className="bg-accent/5 rounded-3xl p-5 md:p-6 border border-accent/10">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Reservation Summary</h4>
                                                <div className="space-y-3 md:space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-zinc-500 text-[10px] md:text-xs font-bold">Room</span>
                                                        <span className="text-xs md:text-sm font-black text-[#292f36]">{room.name}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-zinc-500 text-[10px] md:text-xs font-bold">Guest</span>
                                                        <span className="text-xs md:text-sm font-black text-[#292f36]">{formData.fullName}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-t border-accent/10 pt-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-zinc-500 text-[9px] md:text-xs font-bold uppercase tracking-tighter">Check-in</span>
                                                            <span className="text-xs md:text-sm font-black">{formData.checkIn}</span>
                                                        </div>
                                                        <div className="w-8 h-px bg-accent/20" />
                                                        <div className="flex flex-col text-right">
                                                            <span className="text-zinc-500 text-[9px] md:text-xs font-bold uppercase tracking-tighter">Check-out</span>
                                                            <span className="text-xs md:text-sm font-black">{formData.checkOut}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center border-t border-accent/10 pt-4">
                                                        <span className="text-zinc-500 text-[10px] md:text-xs font-bold">Total Price</span>
                                                        <span className="text-lg md:text-xl font-black text-accent">${room.price} <span className="text-[9px] text-zinc-400 uppercase tracking-widest">/ night</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 md:p-4 bg-zinc-50 rounded-2xl border border-black/5">
                                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                </div>
                                                <p className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                                                    Free cancellation until 24h before check-in
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-8 md:mt-10 flex flex-col md:flex-row gap-3 md:gap-4">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="w-full md:flex-1 border-2 border-zinc-100 text-zinc-500 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 order-2 md:order-1"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={!isStepValid()}
                                    className={cn(
                                        "w-full md:grow bg-[#0e0e0e] text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 md:order-2",
                                        step === 1 && "w-full"
                                    )}
                                >
                                    {step === 3 ? 'Confirm Booking' : 'Save & Continue'}
                                    {step < 3 && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </div>
                            {step === 1 && (
                                <p className="text-center text-zinc-400 text-[9px] mt-6 font-bold uppercase tracking-widest">
                                    Already have an account? <span className="text-accent cursor-pointer">Sign In</span>
                                </p>
                            )}
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-12 text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-[#292f36]">Booking Confirmed!</h2>
                            <p className="text-zinc-500 font-medium max-w-xs mx-auto">
                                Thank you for choosing Unica House. We've sent a confirmation email to <span className="text-accent font-bold">{formData.email}</span>.
                            </p>
                        </div>
                        <div className="pt-6 space-y-4">
                            <div className="bg-zinc-50 rounded-2xl p-4 border border-black/5 text-left">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Reservation ID:</span>
                                    <span className="text-xs font-black text-[#292f36]">#UH-{Math.floor(Math.random() * 10000)}</span>
                                </div>
                                <p className="text-[10px] text-zinc-400 font-medium">Please present this ID during check-in for verification.</p>
                            </div>

                            <button 
                                onClick={() => onSuccess?.()}
                                className="w-full py-4 bg-[#0e0e0e] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95"
                            >
                                Mark as Read & Dismiss
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
