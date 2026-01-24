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
        <main className="min-h-screen bg-[#F2EEE9]">
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
                    animation: marquee 40s linear infinite;
                }
                .marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Editorial Header */}
            <header className="relative pt-48 pb-20 px-6 overflow-hidden">
                <div className="container mx-auto">
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <span className="text-accent font-black text-xs uppercase tracking-[0.4em] border-b-2 border-accent pb-2">Exclusive Discovery</span>
                        </motion.div>
                        <h1 className="text-6xl md:text-9xl font-black text-[#292f36] tracking-tighter mb-4 leading-none">
                            Discovery
                        </h1>
                    </div>

                    {/* Background text */}
                    <span className="absolute left-1/2 top-48 -translate-x-1/2 text-[18vw] font-black text-black/[0.05] select-none pointer-events-none uppercase tracking-widest whitespace-nowrap">
                        UNICA HOUSE
                    </span>
                </div>
            </header>

            {/* CSS Marquee Gallery */}
            <section className="pb-40 overflow-hidden">
                <div className="container mx-auto mb-12 px-6">
                    <p className="text-zinc-400 font-medium text-sm tracking-widest uppercase">
                        Exploring Detail <span className="ml-4 animate-pulse">●</span>
                    </p>
                </div>

                <div className="marquee">
                    {marqueeSlides.map((slide, idx) => (
                        <div
                            key={`${slide.id}-${idx}`}
                            className={cn(
                                "relative w-[85vw] md:w-[450px] border-l border-black/10 flex flex-col pt-12 pr-12 group last:border-r shrink-0",
                                idx % 2 === 1 ? "mt-12" : "mt-0"
                            )}
                        >
                            {/* Slide Label */}
                            <div className="mb-6 pl-12">
                                <span className="text-zinc-400 font-serif italic text-sm">SLIDE {(slide.id)}</span>
                            </div>

                            {/* Image Composition - Aspect Ratio based for responsiveness */}
                            <div className="relative pl-12">
                                <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl group-hover:rounded-[32px] transition-all duration-700 shadow-bloom border border-black/5">
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        sizes="(max-width: 768px) 85vw, 450px"
                                        className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                                    />

                                    {/* Hover Description Overlay */}
                                    <div className="absolute inset-0 bg-[#0e0e0e]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-center px-8 text-white">
                                        <div className="space-y-4">
                                            <h3 className="text-xl md:text-2xl font-black tracking-tight">{slide.title}</h3>
                                            <p className="text-sm md:text-base font-light leading-relaxed text-white/70 italic line-clamp-6">
                                                "{slide.perfectDesc}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Overlapping secondary image */}
                                <div className="absolute -bottom-6 -left-4 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-2xl border-2 border-white z-20 hidden sm:block group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700">
                                    <Image
                                        src={slide.imageSecondary}
                                        alt="Detail"
                                        fill
                                        sizes="(max-width: 768px) 96px, 128px"
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Description Below */}
                            <div className="mt-12 pl-12 max-w-sm">
                                <h3 className="text-lg font-black text-[#292f36] mb-3 group-hover:text-accent transition-colors">{slide.title}</h3>
                                <p className="text-zinc-500 font-medium leading-relaxed text-[12px] md:text-[13px] line-clamp-3">
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
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
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
