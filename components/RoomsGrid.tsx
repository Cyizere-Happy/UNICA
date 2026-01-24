'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { rooms } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

export const RoomsGrid = () => {
    return (
        <section className="section-padding bg-white" id="rooms">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#292f36] mb-4 tracking-tight">Beautiful Rooms</h2>
                    <p className="text-[#4d5053] text-lg max-w-xl mx-auto">Selected for your comfort and aesthetic satisfaction.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {rooms.slice(0, 3).map((room, index) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group flex flex-col h-full rounded-interno-tr border border-border overflow-hidden hover:border-accent/40 bg-white hover:shadow-lg transition-all"
                        >
                            {/* Image with Interno curve style applied to card top right */}
                            <div className="relative h-48 lg:h-56 overflow-hidden">
                                <Image
                                    src={room.mainImage}
                                    alt={room.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                            </div>

                            {/* Content - Compact and Clean */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-lg md:text-xl font-bold text-[#292f36]">{room.name}</h4>
                                    <div className="flex flex-col items-end">
                                        <span className="text-base font-bold text-[#292f36]">{formatPrice(room.price)}</span>
                                        <span className="text-[9px] text-[#4d5053] uppercase font-bold tracking-widest leading-none">per night</span>
                                    </div>
                                </div>

                                <p className="text-[#4d5053] text-[13px] mb-6 line-clamp-2 leading-relaxed">
                                    {room.description}
                                </p>

                                <Link
                                    href={`/rooms/${room.id}`}
                                    className="mt-auto group/btn flex items-center justify-between font-bold text-[#292f36] hover:text-accent transition-colors text-sm"
                                >
                                    View Details
                                    <div className="w-12 h-12 bg-[#f4f0ec] rounded-full flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:text-white transition-all">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
