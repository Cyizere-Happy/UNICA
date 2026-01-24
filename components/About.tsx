'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

export const About = () => {
    return (
        <section className="bg-[#0e0e0e] py-12 md:py-20 px-6 md:px-12 lg:px-40 text-white overflow-hidden" id="about">
            <div className="container mx-auto">

                {/* Header Quote Style - Perfect Alignment */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black mb-6 tracking-[-0.04em] leading-[1.1]"
                    >
                        "Uniqueness in Every <br /> <span className="italic font-normal text-white/90">Detail.</span>"
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.5 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-6 text-[11px] tracking-[0.3em] uppercase font-black text-white/40"
                    >
                        <span>Bespoke</span>
                        <span>·</span>
                        <span>Modern</span>
                        <span>·</span>
                        <span>Exclusive</span>
                    </motion.div>
                </div>

                {/* Feature Cards Style - Refined Scaling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">

                    {/* Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white text-black p-8 md:p-10 rounded-[32px] shadow-bloom flex flex-col items-start justify-between min-h-[300px]"
                    >
                        <div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight">Individuality First</h3>
                            <p className="text-base leading-relaxed text-black/70 mb-8 font-medium">
                                At UNICA House, every detail is a reflection of your unique journey. We create environments where personal style meets premium comfort.
                            </p>
                        </div>

                        <button className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-all text-sm">
                            Explore Our Rooms
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#1a1a1a] border border-white/5 text-white p-8 md:p-10 rounded-[32px] flex flex-col items-start justify-between min-h-[300px]"
                    >
                        <div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight">Refined Lifestyle</h3>
                            <p className="text-base leading-relaxed text-white/50 mb-8 font-medium">
                                Elevate your stay with our bespoke services and world-class hospitality, designed specifically for lifestyle-focused residents.
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 w-full">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-widest text-white/30 font-black">Call Us Anytime</p>
                                    <p className="text-2xl font-black tracking-tight">012345678</p>
                                </div>
                            </div>

                            <button className="w-fit border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black transition-all text-xs tracking-widest uppercase">
                                Get a Quote
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
