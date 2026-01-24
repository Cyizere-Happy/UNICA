'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckCircle2, Target, Eye, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
    const composition = [
        { letter: 'U', name: 'UWIZEYIMANA' },
        { letter: 'N', name: 'NDAHIMANA, NGABO' },
        { letter: 'I', name: 'IHIRWE' },
        { letter: 'C', name: 'CYIZERE' },
        { letter: 'A', name: 'ADRINE' },
    ];

    const timeline = [
        {
            title: 'Discovery',
            text: 'UNICA comes from Latin (única), meaning "unique" or "one of a kind."',
            pos: { x: '10%', y: '70%' }
        },
        {
            title: 'Brand Essence',
            text: 'Uniqueness in Every Detail. Live a unique life.',
            pos: { x: '35%', y: '40%' }
        },
        {
            title: 'Vision',
            text: 'To set a new standard for distinctive apartment living.',
            pos: { x: '60%', y: '60%' }
        },
        {
            title: 'Mission',
            text: 'To create modern living spaces that combine premium quality and comfort.',
            pos: { x: '85%', y: '30%' }
        }
    ];

    const values = [
        { name: 'Uniqueness', icon: <Sparkles className="w-5 h-5 text-accent" /> },
        { name: 'Quality', icon: <CheckCircle2 className="w-5 h-5 text-accent" /> },
        { name: 'Comfort', icon: <Heart className="w-5 h-5 text-accent" /> },
        { name: 'Privacy', icon: <Target className="w-5 h-5 text-accent" /> },
        { name: 'Modern Living', icon: <Eye className="w-5 h-5 text-accent" /> },
    ];

    return (
        <main className="min-h-screen bg-[#FFFAF5]">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 md:px-12 lg:px-40">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <span className="text-accent font-black text-xs tracking-[0.3em] uppercase mb-4 block">
                            Our Legacy
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-[#292f36] tracking-tight mb-8">
                            The UNICA <span className="italic font-normal">Story.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[#4d5053] font-medium leading-relaxed max-w-2xl">
                            A home that stands apart, designed for those who do the same.
                            <span className="block mt-4 text-accent italic">"Live the Unique Life."</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Meaning & Composition Section */}
            <section className="py-20 px-6 md:px-12 lg:px-40 bg-white">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black mb-8 text-[#292f36]">What UNICA Means</h2>
                            <p className="text-lg text-[#4d5053] leading-relaxed mb-6 font-medium">
                                Derived from Latin and Romance languages, <span className="text-accent font-bold">única</span> means "unique," "one of a kind," or "the only one."
                            </p>
                            <p className="text-lg text-[#4d5053] leading-relaxed font-medium">
                                Together, "UNICA Apartment" suggests exclusive, distinctive living—a place that stands out from ordinary apartments in design, comfort, and lifestyle.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {composition.map((item, idx) => (
                                <motion.div
                                    key={item.letter}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-6 p-6 rounded-2xl bg-[#FFFAF5] border border-black/5 hover:border-accent/40 transition-colors"
                                >
                                    <span className="text-4xl font-black text-accent w-12">{item.letter}</span>
                                    <span className="text-lg font-bold text-[#292f36]">{item.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* The Journey Section - Resonate Style Timeline */}
            <section className="py-32 px-6 md:px-12 lg:px-40 bg-[#FFFAF5] overflow-hidden">
                <div className="container mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-center mb-24 text-[#292f36]">The Journey</h2>

                    <div className="relative h-[600px] md:h-[400px] w-full max-w-5xl mx-auto">
                        {/* Animated Curve Path */}
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible opacity-10" viewBox="0 0 1000 400" preserveAspectRatio="none">
                            <motion.path
                                d="M 0 300 C 200 300, 300 100, 500 250 S 800 50, 1000 150"
                                fill="transparent"
                                stroke="#cda274"
                                strokeWidth="4"
                                strokeDasharray="10 10"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                viewport={{ once: true }}
                            />
                        </svg>

                        {/* Nodes */}
                        {timeline.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + idx * 0.3 }}
                                viewport={{ once: true }}
                                className="absolute z-10 hidden md:block"
                                style={{ left: item.pos.x, top: item.pos.y }}
                            >
                                <div className="relative flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-accent relative flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
                                        <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                                    </div>
                                    <div className="absolute top-12 w-48 text-center">
                                        <h3 className="font-black text-[#292f36] mb-2">{item.title}</h3>
                                        <p className="text-[11px] text-[#4d5053] font-medium leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Mobile List View for Timeline */}
                        <div className="md:hidden space-y-12">
                            {timeline.map((item, idx) => (
                                <div key={item.title} className="flex gap-6">
                                    <div className="flex flex-col items-center">
                                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        </div>
                                        {idx !== timeline.length - 1 && <div className="w-0.5 h-full bg-accent/20 mt-2" />}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-[#292f36] text-xl mb-2">{item.title}</h3>
                                        <p className="text-sm text-[#4d5053] font-medium leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Values Section */}
            <section className="py-24 px-6 md:px-12 lg:px-40 bg-white">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-accent font-black text-[10px] tracking-[0.3em] uppercase mb-4 block">Our Values</span>
                        <h2 className="text-3xl md:text-5xl font-black text-[#292f36]">Uniqueness in Every Detail</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
                        {values.map((value, idx) => (
                            <motion.div
                                key={value.name}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center p-8 rounded-[32px] bg-[#FFFAF5] border border-black/5"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 border border-black/5">
                                    {value.icon}
                                </div>
                                <span className="font-bold text-[#292f36] text-sm">{value.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Target Market Section */}
            <section className="py-24 px-6 md:px-12 lg:px-40 bg-[#0e0e0e] text-white overflow-hidden">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">Standard for the <span className="text-accent italic">Distinctive.</span></h2>
                            <p className="text-xl text-white/60 leading-relaxed font-light mb-10">
                                UNICA House is designed for refined, modern living. We welcome residents who want their home to reflect their individuality and success.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {['Young Professionals', 'Executives', 'Expats', 'Lifestyle-focused Residents'].map(market => (
                                    <span key={market} className="px-5 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white/40">
                                        {market}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="relative aspect-video lg:aspect-square rounded-[40px] overflow-hidden">
                            <div className="absolute inset-0 bg-accent/20 mix-blend-overlay z-10" />
                            <img
                                src="/Images/UNICA_Morning_Front_view.jpg"
                                alt="UNICA Lifestyle"
                                className="w-full h-full object-cover grayscale opacity-50"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
