'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BedDouble, Building2, Compass, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const heroImages = [
    { src: "/Images/UNICA_Morning_Front_view.jpg", alt: "Unicavilla Morning View" },
    { src: "/Images/UNICA_House_Evening_side_view.jpg", alt: "Unicavilla Evening Side View" },
    { src: "/Images/UNICA_House_Evening_Front_view.jpg", alt: "Unicavilla Evening Front View" },
    { src: "/Images/UNICA_House_Night_Front_View.jpg", alt: "Unicavilla Night View" },
    { src: "/Images/UNICA_Morning_Side_View.jpg", alt: "Unicavilla Morning Side View" },
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
        <section className="relative h-screen overflow-hidden px-3 sm:px-4 md:px-8 pt-24 sm:pt-28 pb-3 sm:pb-4 bg-[#eceff2]">
            <div className="relative mx-auto h-full max-w-7xl overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#37424d]">
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
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center pt-6 sm:pt-8">
                    <div className="w-full max-w-3xl">
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-white mb-6"
                        >
                            Unica Signature Stay
                        </motion.span>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                        >
                            <span className="text-[#d6e6ff]">Find Your </span>
                            <span className="text-accent italic font-normal">Perfect Stay.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-[15px] sm:text-base md:text-lg font-semibold mt-6 max-w-xl mx-auto leading-relaxed text-zinc-50 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] bg-black/30 backdrop-blur-md rounded-xl px-6 py-3"
                        >
                            Experience the zenith of Rwandan hospitality.
                            <br className="hidden sm:block" />
                            A villa designed for the unique traveler.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link href="/rooms">
                                <button className="px-8 py-3.5 rounded-xl bg-accent text-white text-sm md:text-base font-bold tracking-wide shadow-2xl hover:scale-105 transition-all duration-300 min-w-[200px] border border-white/10">
                                    Browse Rooms
                                </button>
                            </Link>
                            <Link href="/contact">
                                <button className="px-8 py-3.5 rounded-xl bg-white/10 text-white text-sm md:text-base font-bold tracking-wide border border-white/30 backdrop-blur-lg hover:bg-white/20 transition-all duration-300 min-w-[200px] shadow-xl">
                                    Check Availability
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
