'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, BedDouble, Building2, Compass, ChevronRight } from 'lucide-react';

const heroImages = [
    { src: "/Images/UNICA_Morning_Front_view.jpg", alt: "Unica House Morning View" },
    { src: "/Images/UNICA_House_Evening_side_view.jpg", alt: "Unica House Evening Side View" },
    { src: "/Images/UNICA_House_Evening_Front_view.jpg", alt: "Unica House Evening Front View" },
    { src: "/Images/UNICA_House_Night_Front_View.jpg", alt: "Unica House Night View" },
    { src: "/Images/UNICA_Morning_Side_View.jpg", alt: "Unica House Morning Side View" },
];

export const Hero = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen overflow-hidden px-4 md:px-8 pt-24 pb-4 bg-[#eceff2]">
            <div className="relative mx-auto h-full max-w-7xl overflow-hidden rounded-[32px] bg-[#37424d]">
                <AnimatePresence mode="sync" initial={false}>
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.25, scale: 1.01 }}
                        transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute inset-0 z-0"
                    >
                        <Image
                            src={heroImages[currentImage].src}
                            alt={heroImages[currentImage].alt}
                            fill
                            priority
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-[#2d3742]/10" />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/14 via-black/20 to-black/40" />
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        <span
                            className="text-accent font-black text-xs uppercase tracking-[0.35em] mb-6 inline-block"
                            style={{ textShadow: '0 1px 1px rgba(0,0,0,0.35), 0 0 6px rgba(98,129,255,0.25)' }}
                        >
                            Luxury Redefined
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.04] tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.42)]">
                            <span style={{ color: '#d6e6ff' }}>Find Your </span>
                            <span
                                className="text-accent italic font-normal"
                                style={{ textShadow: '0 1px 1px rgba(0,0,0,0.38), 0 0 8px rgba(98,129,255,0.3), 0 0 16px rgba(98,129,255,0.16)' }}
                            >
                                Perfect Stay.
                            </span>
                        </h1>
                        <p
                            className="text-sm md:text-lg font-medium mt-5 max-w-2xl mx-auto drop-shadow-[0_6px_14px_rgba(0,0,0,0.38)]"
                            style={{ color: '#e4efff' }}
                        >
                            Experience the zenith of Rwandan hospitality in a house designed for the unique traveler.
                        </p>
                    </motion.div>

                    <div className="mt-8 w-full max-w-md">
                        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/15 backdrop-blur-md px-3 py-2.5">
                            <MapPin className="w-5 h-5 text-accent shrink-0" />
                            <input
                                type="text"
                                placeholder="Search for rooms, apartments, or services..."
                                className="w-full bg-transparent outline-none text-white placeholder-white/75 text-sm font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="rounded-full bg-white text-[#292f36] p-2.5 hover:bg-zinc-100 transition-colors">
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-5xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-3 py-3 shadow-[0_15px_45px_rgba(0,0,0,0.18)]">
                        <div className="flex flex-wrap items-center gap-2">
                            <button className="px-4 py-2 rounded-xl bg-[#f7f7f7] text-[#4d5053] text-sm font-medium">Rooms</button>
                            <button className="px-4 py-2 rounded-xl bg-[#f7f7f7] text-[#4d5053] text-sm font-medium">Apartments</button>
                            <button className="px-4 py-2 rounded-xl bg-[#f7f7f7] text-[#4d5053] text-sm font-medium">Services</button>
                        </div>
                        <button className="px-5 py-2.5 rounded-xl bg-[#0e0e0e] text-white text-sm font-semibold inline-flex items-center gap-1.5">
                            History
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-4xl">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-white/95 px-4 py-2.5 flex items-center gap-3">
                            <BedDouble className="w-5 h-5 text-accent" />
                            <div className="text-left">
                                <p className="text-sm font-semibold text-[#292f36]">Rooms</p>
                                <p className="text-xs text-[#4d5053]">Comfort-first stays</p>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white/95 px-4 py-2.5 flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-accent" />
                            <div className="text-left">
                                <p className="text-sm font-semibold text-[#292f36]">Apartments</p>
                                <p className="text-xs text-[#4d5053]">Longer living options</p>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white/95 px-4 py-2.5 flex items-center gap-3">
                            <Compass className="w-5 h-5 text-accent" />
                            <div className="text-left">
                                <p className="text-sm font-semibold text-[#292f36]">Services</p>
                                <p className="text-xs text-[#4d5053]">Travel-ready support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
