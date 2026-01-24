'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';

export const About = () => {
    return (
        <section className="section-padding bg-white overflow-hidden" id="about">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Text Content */}
                    <div className="flex-1 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="max-w-xl"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-[#292f36] leading-[1.2] mb-6">
                                We Tackle The Most <br />
                                Challenging <span className="font-normal italic">Designs</span>
                            </h2>

                            <p className="text-[#4d5053] text-base mb-8 leading-relaxed">
                                At Unica House, every detail matters. We have an insatiable curiosity about transformative stays and how to make every guest feel unique in a modern, well-crafted environment.
                            </p>

                            {/* Contact Element */}
                            <div className="flex items-center gap-4 mb-12 group">
                                <div className="w-16 h-16 bg-[#f4f0ec] rounded-full flex items-center justify-center transition-colors group-hover:bg-accent/10">
                                    <Phone className="w-7 h-7 text-accent" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-[#292f36]">012345678</span>
                                    <span className="text-[#4d5053] text-sm font-medium">Call Us Anytime</span>
                                </div>
                            </div>

                            <button className="btn-dark">
                                Get Free Estimate
                                <ArrowRight className="w-5 h-5 text-accent" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Curved Image - Top Right curved */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 order-1 lg:order-2 w-full max-w-2xl"
                    >
                        <div className="relative aspect-square w-full overflow-hidden rounded-interno-tr border-8 border-white shadow-xl">
                            <Image
                                src="/images/UNICA_House_Backyard_Entrance_view.jpg"
                                alt="Unica House Backyard"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
