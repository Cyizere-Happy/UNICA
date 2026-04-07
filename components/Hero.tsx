'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BedDouble, Building2, Compass, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const heroImages = [
    { src: "/Images/UNICA_Morning_Front_view.jpg", alt: "Unica House Morning View" },
    { src: "/Images/UNICA_House_Evening_side_view.jpg", alt: "Unica House Evening Side View" },
    { src: "/Images/UNICA_House_Evening_Front_view.jpg", alt: "Unica House Evening Front View" },
    { src: "/Images/UNICA_House_Night_Front_View.jpg", alt: "Unica House Night View" },
    { src: "/Images/UNICA_Morning_Side_View.jpg", alt: "Unica House Morning Side View" },
];

export const Hero = () => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen overflow-hidden px-4 md:px-8 pt-24 pb-4 bg-[#eceff2]">
            <div className="relative mx-auto h-full max-w-7xl overflow-hidden rounded-[32px] bg-[#37424d]">
                <div className="absolute inset-0 z-0">
                    {heroImages.map((image, idx) => (
                        <motion.div
                            key={image.src}
                            className="absolute inset-0"
                            initial={false}
                            animate={{
                                opacity: idx === currentImage ? 1 : 0,
                                scale: idx === currentImage ? 1 : 1.01,
                            }}
                            transition={{
                                opacity: { duration: 2.1, ease: "easeInOut" },
                                scale: { duration: 2.1, ease: "easeOut" },
                            }}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                priority={idx === 0}
                                className="object-cover"
                            />
                        </motion.div>
                    ))}
                    <div className="absolute inset-0 bg-[#2d3742]/10" />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/14 via-black/20 to-black/40" />
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-8 text-center pb-44 md:pb-40 pt-8">
                    <div className="w-full max-w-3xl">
                        <span className="inline-flex items-center rounded-full bg-white/14 border border-white/30 px-3 py-1 text-[10px] md:text-xs font-semibold tracking-[0.22em] uppercase text-[#e7f0ff] mb-5 md:mb-6">
                            Unica Signature Stay
                        </span>
                        <h1 className="text-[2.4rem] md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.42)]">
                            <span style={{ color: '#d6e6ff' }}>Find Your </span>
                            <span
                                className="text-accent italic font-normal"
                                style={{ textShadow: '0 1px 1px rgba(0,0,0,0.38), 0 0 8px rgba(98,129,255,0.3), 0 0 16px rgba(98,129,255,0.16)' }}
                            >
                                Perfect Stay.
                            </span>
                        </h1>
                        <p
                            className="text-sm md:text-lg font-medium mt-6 max-w-xl mx-auto leading-relaxed drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)] bg-black/28 backdrop-blur-[1px] rounded-xl px-4 py-2.5"
                            style={{ color: '#e4efff' }}
                        >
                            Experience the zenith of Rwandan hospitality.
                            <br className="hidden md:block" />
                            A house designed for the unique traveler.
                        </p>
                        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
                            <Link href="/rooms">
                                <button className="px-7 py-3.5 rounded-xl bg-[#0e0e0e] text-white text-sm md:text-base font-semibold tracking-wide shadow-[0_14px_34px_rgba(0,0,0,0.42)] hover:bg-black hover:scale-[1.02] hover:shadow-[0_18px_38px_rgba(0,0,0,0.5)] active:scale-[0.99] transition-all duration-300 ring-1 ring-white/15 min-w-[170px]">
                                    Browse Rooms
                                </button>
                            </Link>
                            <Link href="/contact">
                                <button className="px-6 py-3.5 rounded-xl bg-white/18 text-white text-sm md:text-base font-semibold tracking-wide border border-white/50 backdrop-blur-md hover:bg-white/26 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-[0_10px_26px_rgba(0,0,0,0.25)] min-w-[170px]">
                                    Check Availability
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-28 md:bottom-24 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-5xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_15px_45px_rgba(0,0,0,0.18)]">
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

                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-4xl">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="rounded-2xl bg-white px-4 py-2.5 flex items-center gap-3 border border-[#e9edf2] shadow-[0_10px_22px_rgba(0,0,0,0.18)]">
                            <BedDouble className="w-5 h-5 text-accent" />
                            <div className="text-left">
                                <p className="text-sm font-semibold text-[#292f36]">Rooms</p>
                                <p className="text-xs text-[#4d5053]">Comfort-first stays</p>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-2.5 flex items-center gap-3 border border-[#e9edf2] shadow-[0_10px_22px_rgba(0,0,0,0.18)]">
                            <Building2 className="w-5 h-5 text-accent" />
                            <div className="text-left">
                                <p className="text-sm font-semibold text-[#292f36]">Apartments</p>
                                <p className="text-xs text-[#4d5053]">Longer living options</p>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-2.5 flex items-center gap-3 border border-[#e9edf2] shadow-[0_10px_22px_rgba(0,0,0,0.18)]">
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
