'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info, Calendar, Home, Star, PartyPopper, Zap } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const pricingDetails = [
    {
        title: "Apartments",
        icon: Home,
        description: "Elegant living spaces for long-term or short-term stay.",
        options: [
            { label: "Fully Furnished", price: "600,000 FRW", subPrice: "$412", period: "month", features: ["Full Kitchen", "Premium Furniture", "Laundry Access"] },
            { label: "Unfurnished", price: "500,000 FRW", subPrice: "$343", period: "month", features: ["Spacious Layout", "Wardrobe", "Standard Utilities"] },
            { label: "Nightly Stay", price: "$100", subPrice: "145,000 FRW", period: "night", features: ["Luxury Service", "Fast WiFi", "Welcome Drink"] }
        ],
        highlight: true
    },
    {
        title: "Superior Rooms",
        icon: Star,
        description: "Perfect for single travelers seeking premium comfort.",
        options: [
            { label: "One Night Stay", price: "50,000 FRW", subPrice: "$35", period: "night", features: ["King Size Bed", "En-suite Bathroom", "High-speed WiFi", "4K TV"] }
        ]
    },
    {
        title: "Rooftop Venue",
        icon: PartyPopper,
        description: "Host exquisite parties with panoramic city views.",
        options: [
            { label: "Full Day Hosting", price: "$60", subPrice: "87,000 FRW", period: "day", features: ["Panoramic Views", "Music Infrastructure", "Bar Access", "Security"] }
        ]
    }
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-36 pb-6 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-black text-[#292f36] mb-3 leading-tight">
                            Simple & Clear <span className="text-accent">Pricing</span>
                        </h1>
                        <p className="text-[#4d5053] text-[15px] font-medium max-w-lg mx-auto opacity-80">
                            Transparent rates for our premium living spaces.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="pb-16 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pricingDetails.map((category, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={cn(
                                    "relative flex flex-col p-6 rounded-[2rem] border transition-all duration-500",
                                    category.highlight
                                        ? "bg-foreground text-background border-foreground shadow-bloom scale-[1.01] z-10"
                                        : "bg-white border-zinc-100 hover:border-accent/30 shadow-lg shadow-black/[0.01]"
                                )}
                            >
                                <div className="flex items-center gap-2.5 mb-5">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center",
                                        category.highlight ? "bg-accent text-white" : "bg-accent/10 text-accent"
                                    )}>
                                        <category.icon className="w-4 h-4" />
                                    </div>
                                    <h2 className={cn(
                                        "text-lg font-black tracking-tight",
                                        category.highlight ? "text-white" : "text-[#292f36]"
                                    )}>
                                        {category.title}
                                    </h2>
                                </div>

                                <p className={cn(
                                    "text-[12px] mb-8 leading-relaxed font-medium opacity-70",
                                    category.highlight ? "text-zinc-300" : "text-zinc-500"
                                )}>
                                    {category.description}
                                </p>

                                <div className="space-y-3 flex-1">
                                    {category.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="space-y-1.5">
                                            <div className="border-b pb-2 border-black/5">
                                                <div className="flex justify-between items-start">
                                                    <span className={cn(
                                                        "text-[8px] font-black uppercase tracking-widest",
                                                        category.highlight ? "text-accent" : "text-zinc-400"
                                                    )}>
                                                        {opt.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className={cn(
                                                        "text-xl font-black",
                                                        category.highlight ? "text-white" : "text-[#292f36]"
                                                    )}>
                                                        {opt.price}
                                                    </span>
                                                    <span className={cn(
                                                        "text-[9px] font-bold opacity-60",
                                                        category.highlight ? "text-zinc-400" : "text-zinc-500"
                                                    )}>
                                                        / {opt.period}
                                                    </span>
                                                </div>
                                                <div className={cn(
                                                    "text-[10px] font-bold",
                                                    category.highlight ? "text-accent/80" : "text-accent"
                                                )}>
                                                    ≈ {opt.subPrice}
                                                </div>
                                            </div>

                                            <ul className="space-y-1">
                                                {opt.features.map((feature, fIdx) => (
                                                    <li key={fIdx} className="flex items-center gap-2">
                                                        <Check className="w-2.5 h-2.5 shrink-0 text-accent" />
                                                        <span className={cn(
                                                            "text-[10px] font-medium opacity-80",
                                                            category.highlight ? "text-zinc-300" : "text-zinc-600"
                                                        )}>
                                                            {feature}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                <button className={cn(
                                    "mt-5 w-full py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2 group",
                                    category.highlight
                                        ? "bg-white text-foreground hover:shadow-lg"
                                        : "bg-[#0e0e0e] text-white hover:bg-black"
                                )}>
                                    Learn More
                                    <Zap className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Compact Note box */}
                    <div className="mt-12 p-4 rounded-[2rem] bg-zinc-50 border border-zinc-100 flex flex-col md:flex-row items-center gap-4 max-w-3xl mx-auto">
                        <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                            <Info className="w-4 h-4" />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-[10px] font-black text-[#292f36] uppercase tracking-widest mb-0.5">Custom Requirements?</h4>
                            <p className="text-[#4d5053] text-[12px] font-medium opacity-80">Reach out to us for tailored packages or corporate booking needs.</p>
                        </div>
                        <button className="md:ml-auto whitespace-nowrap px-5 py-2.5 bg-foreground text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all">
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// Utility for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
