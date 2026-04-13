'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';

const slides = [
    {
        id: 1,
        title: 'Vibrant Rooftop Bar',
        image: '/Images/UNICA_PARTY_RoofTop.jpg',
        imageSecondary: '/Images/UNICA_RoofTop_view.jpg',
        desc: 'Taste refined cocktails under the stars while the city hums beneath you. Our signature space for the sophisticated socialite.',
        perfectDesc: 'The apex of Kicukiro nightlife. Where every glass clinks with the music of the spheres.',
    },
    {
        id: 2,
        title: 'Reception & Grand Entry',
        image: '/Images/UNICA_House_Reception_View.jpg',
        imageSecondary: '/Images/UNICA_Entrance_Doors_view.jpg',
        desc: 'A first impression that lingers. Our reception is more than a desk; it is the gateway to your unique experience.',
        perfectDesc: 'Bespoke hospitality begins the moment you cross our threshold. Designed for the distinctive traveler.',
    },
    {
        id: 3,
        title: 'Breathtaking City Views',
        image: '/Images/UNICA_Top_View2.jpg',
        imageSecondary: '/Images/UNICA_Top_view_standing at the gorund level.jpg',
        desc: 'Perched high above, UNICA House offers perspectives that define the landscape of modern living.',
        perfectDesc: 'Own the horizon. A visual masterpiece that changes from golden hour to city lights.',
    },
    {
        id: 4,
        title: 'Rooftop Serenity',
        image: '/Images/UNICA_RoofTop_view.jpg',
        imageSecondary: '/Images/UNICA_PARTY_RoofTop.jpg',
        desc: 'Find your peaceful sanctuary above the clouds. A minimal space for maximum relaxation.',
        perfectDesc: 'Quietude in height. Where the breeze and the architecture meet in perfect harmony.',
    },
    {
        id: 5,
        title: 'Architectural Journey',
        image: '/Images/UNICA_House_stairs_view.jpg',
        imageSecondary: '/Images/UNICA_Entrance_Doors_view.jpg',
        desc: 'Every step at UNICA House is a dialogue between modern design and timeless comfort.',
        perfectDesc: 'The geometry of luxury. Moving through the house is moving through a curated art experience.',
    }
];

// Double the slides for a seamless marquee effect
const marqueeSlides = [...slides, ...slides];

export default function AttractionsPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* In-page Styles for Marquee */}
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 55s linear infinite;
                }
                .marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Editorial Header */}
            <header className="relative pt-44 pb-14 px-6 overflow-hidden">
                <div className="container mx-auto">
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <span className="text-accent font-black text-xs uppercase tracking-[0.4em] border-b-2 border-accent pb-2">Exclusive Discovery</span>
                        </motion.div>
                        <h1 className="text-xl font-black text-[#292f36] tracking-tighter uppercase italic">Unicavilla
                            Discovery
                        </h1>
                    </div>

                    {/* Background text */}
                    <span className="absolute left-1/2 top-36 -translate-x-1/2 text-[16vw] font-black text-black/[0.05] select-none pointer-events-none uppercase tracking-widest whitespace-nowrap">
                        UNICA HOUSE
                    </span>
                </div>
            </header>

            {/* CSS Marquee Gallery */}
            <section className="pb-24 overflow-hidden">
                <div className="container mx-auto mb-8 px-6">
                    <p className="text-zinc-400 font-medium text-sm tracking-widest uppercase">
                        Exploring Detail <span className="ml-4 animate-pulse">●</span>
                    </p>
                </div>

                <div className="marquee">
                    {marqueeSlides.map((slide, idx) => (
                        <div
                            key={`${slide.id}-${idx}`}
                            className={cn(
                                "relative w-[74vw] sm:w-[58vw] md:w-[340px] border-l border-black/10 flex flex-col pt-7 pr-7 group last:border-r shrink-0",
                                idx % 2 === 1 ? "mt-7" : "mt-0"
                            )}
                        >
                            {/* Slide Label */}
                            <div className="mb-4 pl-7">
                                <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-zinc-500">
                                    ATTRACTION {slide.id}
                                </span>
                            </div>

                            {/* Image Composition - Aspect Ratio based for responsiveness */}
                            <div className="relative pl-7">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl group-hover:rounded-[26px] transition-all duration-500 shadow-[0_14px_34px_rgba(0,0,0,0.16)] border border-black/5">
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        sizes="(max-width: 640px) 74vw, (max-width: 768px) 58vw, 340px"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />

                                    {/* Hover Description Overlay */}
                                    <div className="absolute inset-0 bg-[#0e0e0e]/78 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center px-5 text-white">
                                        <div className="space-y-3">
                                            <h3 className="text-base md:text-lg font-black tracking-tight">{slide.title}</h3>
                                            <p className="text-xs md:text-sm font-light leading-relaxed text-white/75 italic line-clamp-5">
                                                "{slide.perfectDesc}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Overlapping secondary image */}
                                <div className="absolute -bottom-4 -left-3 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shadow-xl border-2 border-white z-20 hidden sm:block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">
                                    <Image
                                        src={slide.imageSecondary}
                                        alt="Detail"
                                        fill
                                        sizes="(max-width: 768px) 80px, 96px"
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Description Below */}
                            <div className="mt-7 pl-7 max-w-[290px]">
                                <h3 className="text-base font-black text-[#292f36] mb-2.5 group-hover:text-accent transition-colors">{slide.title}</h3>
                                <p className="text-zinc-500 font-medium leading-relaxed text-[11px] md:text-[12px] line-clamp-3">
                                    {slide.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-32 px-6 md:px-12 lg:px-40 bg-[#0e0e0e] text-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                        Wanna Experience the <br /> <span className="text-accent italic">Unique Life?</span>
                    </h2>
                    <p className="text-white/40 max-w-xl mx-auto mb-12 text-lg font-medium">
                        Secure your spot at UNICA House and discover what makes us Rwanda's most distinctive stay.
                    </p>
                    <Link href="/rooms" className="btn-dark bg-white text-black hover:bg-accent hover:text-white px-12 py-6 text-xl">
                        Book Your Stay Now
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
