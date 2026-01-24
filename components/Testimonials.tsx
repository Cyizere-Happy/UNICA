'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { testimonials } from '@/lib/data';

export const Testimonials = () => {
    return (
        <section className="px-6 md:px-12 lg:px-40 py-20 bg-white" id="testimonials">
            <div className="container mx-auto bg-[#f4f0ec] rounded-[70px] py-16 px-6 md:px-12 lg:px-20">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#292f36] leading-tight max-w-2xl mx-auto">
                        What People Think <br />
                        About <span className="font-normal italic">Unica House</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[35px] shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-accent/20">
                                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg text-[#292f36]">{t.name}</span>
                                    <span className="text-xs text-[#4d5053] font-medium tracking-wide">{t.role}</span>
                                </div>
                            </div>

                            <p className="text-[#4d5053] leading-relaxed text-sm italic">
                                "{t.content}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
