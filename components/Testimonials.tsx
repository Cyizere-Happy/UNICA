'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { testimonials as data } from '@/lib/data';

export const Testimonials = () => {
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % data.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setIndex((prev) => (prev + 1) % data.length);
    const prev = () => setIndex((prev) => (prev - 1 + data.length) % data.length);

    // Get 3 items to show (prev, current, next)
    const getVisibleItems = () => {
        const items = [];
        for (let i = -1; i <= 1; i++) {
            const idx = (index + i + data.length) % data.length;
            items.push({ ...data[idx], position: i });
        }
        return items;
    };

    return (
        <section className="py-16 md:py-24 bg-[#FAFAFA] overflow-hidden relative" id="testimonials">
            <div className="container mx-auto px-6">
                {/* Header Section - Airy Spacing */}
                <div className="text-center mb-12 md:mb-16 relative">
                    <span className="text-accent font-black text-xs tracking-[0.3em] uppercase mb-3 block">
                        Experiences from our guests
                    </span>
                    <div className="relative inline-block">
                        {/* Background transparent text - Refined Scaling */}
                        <span className="absolute left-1/2 -top-4 -translate-x-1/2 text-6xl md:text-8xl font-black text-black/[0.02] select-none pointer-events-none whitespace-nowrap tracking-tighter">
                            Testimonials
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-[#292f36] relative z-10 tracking-[-0.03em]">
                            Testimonials
                        </h2>
                    </div>
                </div>

                {/* Carousel Wrapper */}
                <div className="relative flex items-center justify-center min-h-[380px]">
                    {/* Navigation Arrows - Resonate Style */}
                    <button
                        onClick={prev}
                        className="absolute left-4 md:left-12 z-30 p-3 rounded-full bg-white shadow-bloom text-[#292f36] hover:bg-[#0e0e0e] hover:text-white transition-all active:scale-90"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 md:right-12 z-30 p-3 rounded-full bg-white shadow-bloom text-[#292f36] hover:bg-[#0e0e0e] hover:text-white transition-all active:scale-90"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Slider Cards - Soft Bloom Shadows */}
                    <div className="flex items-center justify-center gap-6 md:gap-10 w-full max-w-5xl">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {getVisibleItems().map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        scale: item.position === 0 ? 1 : 0.82,
                                        opacity: item.position === 0 ? 1 : 0.3,
                                        zIndex: item.position === 0 ? 20 : 10,
                                    }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                        opacity: { duration: 0.2 }
                                    }}
                                    className={cn(
                                        "bg-white rounded-[32px] p-8 md:p-10 shadow-bloom flex flex-col items-center text-center transition-all",
                                        item.position === 0 ? "w-full max-w-md" : "hidden md:flex w-full max-w-xs"
                                    )}
                                >
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-accent/5 ring-8 ring-accent/5">
                                        <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                                    </div>

                                    <h4 className="text-xl font-black text-[#292f36] mb-1 tracking-tight">{item.name}</h4>
                                    <p className="text-accent font-bold text-[10px] mb-6 tracking-widest uppercase">{item.role}</p>

                                    <p className="text-[#292f36]/70 leading-relaxed italic text-lg font-medium line-clamp-4 px-4">
                                        "{item.content}"
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-4 mt-12 md:mt-16">
                    {data.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={cn(
                                "w-3 h-3 rounded-full transition-all duration-500",
                                index === i ? "bg-accent w-10 shadow-[0_0_15px_rgba(205,162,116,0.3)]" : "bg-black/10 hover:bg-black/20"
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};


