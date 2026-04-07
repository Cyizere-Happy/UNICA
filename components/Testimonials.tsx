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
        <section className="py-10 md:py-14 bg-[#FAFAFA] overflow-hidden relative" id="testimonials">
            <div className="container mx-auto px-6">
                {/* Header Section - Airy Spacing */}
                <div className="text-center mb-8 md:mb-10 relative">
                    <span className="text-accent font-black text-xs tracking-[0.3em] uppercase mb-3 block">
                        Experiences from our guests
                    </span>
                    <div className="relative inline-block">
                        {/* Background transparent text - Refined Scaling */}
                        <span className="absolute left-1/2 -top-3 -translate-x-1/2 text-4xl md:text-6xl font-black text-black/[0.02] select-none pointer-events-none whitespace-nowrap tracking-tighter">
                            Testimonials
                        </span>
                        <h2 className="text-xl md:text-2xl font-black text-[#292f36] relative z-10 tracking-[-0.03em]">
                            Testimonials
                        </h2>
                    </div>
                </div>

                {/* Carousel Wrapper */}
                <div className="relative flex items-center justify-center min-h-[300px]">
                    {/* Navigation Arrows - Resonate Style */}
                    <button
                        onClick={prev}
                        className="absolute left-2 md:left-8 z-30 p-2.5 rounded-full bg-white shadow-bloom text-[#292f36] hover:bg-[#0e0e0e] hover:text-white transition-all active:scale-90"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 md:right-8 z-30 p-2.5 rounded-full bg-white shadow-bloom text-[#292f36] hover:bg-[#0e0e0e] hover:text-white transition-all active:scale-90"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Slider Cards - Soft Bloom Shadows */}
                    <div className="flex items-center justify-center gap-4 md:gap-6 w-full max-w-4xl">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {getVisibleItems().map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, x: item.position * 40 }}
                                    animate={{
                                        scale: item.position === 0 ? 1 : 0.82,
                                        opacity: item.position === 0 ? 1 : 0.35,
                                        zIndex: item.position === 0 ? 20 : 10,
                                        x: item.position * 26,
                                    }}
                                    exit={{ opacity: 0, scale: 0.9, x: item.position * -36 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 120,
                                        damping: 22,
                                        mass: 0.95,
                                        opacity: { duration: 0.35, ease: "easeInOut" }
                                    }}
                                    className={cn(
                                        "bg-white rounded-[24px] p-5 md:p-6 shadow-bloom flex flex-col items-center text-center transition-all",
                                        item.position === 0 ? "w-full max-w-sm" : "hidden md:flex w-full max-w-[240px]"
                                    )}
                                >
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden mb-4 border-2 border-accent/10 ring-4 ring-accent/5">
                                        <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                                    </div>

                                    <h4 className="text-base font-black text-[#292f36] mb-1 tracking-tight">{item.name}</h4>
                                    <p className="text-accent font-bold text-[9px] mb-4 tracking-widest uppercase">{item.role}</p>

                                    <p className="text-[#292f36]/70 leading-relaxed italic text-sm font-medium line-clamp-3 px-2">
                                        &quot;{item.content}&quot;
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-3 mt-7 md:mt-9">
                    {data.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={cn(
                                "w-2.5 h-2.5 rounded-full transition-all duration-500",
                                index === i ? "bg-accent w-8 shadow-[0_0_12px_rgba(205,162,116,0.3)]" : "bg-black/10 hover:bg-black/20"
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};


