'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate email sending
        setIsSubmitted(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Header Section */}
            <section className="pt-36 pb-8 px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-black text-[#292f36] mb-4 leading-tight">
                            Get in <span className="text-accent underline decoration-black/5 underline-offset-8">Touch.</span>
                        </h1>
                        <p className="text-[#4d5053] text-base font-medium max-w-lg mx-auto opacity-80">
                            Have a suggestion or need help? We're here to listen to you.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="pb-32 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Contact Info */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="space-y-6">
                                <div className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Call Us</h3>
                                        <p className="text-lg font-black text-[#292f36]">0788507076</p>
                                        <p className="text-lg font-black text-[#292f36]">0788860616</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email</h3>
                                        <p className="text-lg font-black text-[#292f36]">stay@unicahouse.com</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Location</h3>
                                        <p className="text-lg font-black text-[#292f36]">Gikondo, Kicukiro</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-foreground text-background shadow-bloom space-y-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-accent" />
                                    <h4 className="font-black text-[10px] uppercase tracking-widest">Privacy Assured</h4>
                                </div>
                                <p className="text-[12px] opacity-70 leading-relaxed font-medium">
                                    Your suggestions are confidential. We value your input.
                                </p>
                            </div>
                        </div>

                        {/* Suggestion Form */}
                        <div className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white rounded-[3rem] p-8 md:p-12 border border-zinc-100 shadow-xl shadow-black/[0.02]"
                                    >
                                        <div className="mb-6">
                                            <h2 className="text-xl font-black text-[#292f36] mb-2">Suggestion Box</h2>
                                            <p className="text-zinc-500 text-[13px] font-medium opacity-80">How can we improve?</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Your Name"
                                                        className="w-full bg-zinc-50 border-none rounded-xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="your@email.com"
                                                        className="w-full bg-zinc-50 border-none rounded-xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Subject</label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Subject"
                                                    className="w-full bg-zinc-50 border-none rounded-xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Message</label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows={4}
                                                    placeholder="Tell us what you think..."
                                                    className="w-full bg-zinc-50 border-none rounded-xl p-5 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all outline-none resize-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-accent text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                Send Suggestion
                                                <Send className="w-3.5 h-3.5" />
                                            </button>
                                        </form>

                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-[3rem] p-12 text-center space-y-8 border border-zinc-100 shadow-xl"
                                    >
                                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                                            <CheckCircle2 className="w-10 h-10 text-white" />
                                        </div>
                                        <div className="space-y-3">
                                            <h2 className="text-3xl font-black text-[#292f36]">Thank You!</h2>
                                            <p className="text-zinc-500 font-medium max-w-xs mx-auto leading-relaxed">
                                                We've received your suggestion and will review it carefully. Your feedback helps us build a better Unica House.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsSubmitted(false)}
                                            className="px-8 py-4 bg-[#0e0e0e] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                                        >
                                            Send Another
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
