'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Absolute top start - no padding-top */}
            <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[750px] rounded-interno-bl overflow-hidden flex items-center">

                {/* Background Image - Absolute Full Width */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/UNICA_Night_Side_View.jpg"
                        alt="Unica House Night View"
                        fill
                        priority
                        className="object-cover"
                    />
                    {/* Refined "White Fog" - Smooth white-to-transparent gradient for charcoal text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent lg:w-3/4" />
                </div>

                {/* Content Layer - Switched back to Charcoal (#292f36) with fog support */}
                <div className="relative z-10 w-full px-6 md:px-12 lg:px-40">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#292f36] mb-3 leading-[1.1] tracking-tight">
                            Let's Create Your <br />
                            Dream <span className="italic font-normal">Stay</span>
                        </h1>

                        <p className="text-sm md:text-base text-[#292f36] max-w-md mb-8 leading-relaxed font-semibold">
                            Experience the perfect blend of modern architecture and warm hospitality.
                            Your sanctuary in the heart of the city awaits at Unica House.
                        </p>

                        <button className="btn-dark px-6 py-3 md:px-8 md:py-4 shadow-2xl hover:scale-105 transition-transform text-xs md:text-sm">
                            Get Started
                            <ArrowRight className="w-4 h-4 md:w-5 h-5 text-accent ml-2" />
                        </button>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};
