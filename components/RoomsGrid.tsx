'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { rooms as staticRooms } from '@/lib/data';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import { Room } from '@/lib/gatepass/types';

export const RoomsGrid = () => {
    // Initialize with static data for SSR matching, then update with live data
    const [roomsList, setRoomsList] = React.useState<Room[]>(staticRooms as Room[]);
    const [loading, setLoading] = React.useState(true);

    // Fetch live data from the backend
    React.useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const rooms = await apiService.getRooms();
                if (rooms && rooms.length > 0) {
                    setRoomsList(rooms);
                }
            } catch (err) {
                console.error('Failed to fetch rooms for home grid:', err);
                // Fallback to static data is already set in initial state
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    return (
        <section className="section-padding bg-white" id="rooms">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-4xl font-black text-[#292f36] mb-4 tracking-tight">Distinctive Stays</h2>
                    <p className="text-[#4d5053] text-base font-medium max-w-xl mx-auto">Discover our collection of unique rooms and apartments designed for your absolute comfort.</p>
                </div>

                {loading && roomsList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                        <p className="text-muted font-bold tracking-widest uppercase text-[9px]">Discovering available rooms...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {roomsList.slice(0, 3).map((room, index) => (
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
                                        src={resolveImageUrl(room.mainImage)}
                                        alt={room.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                </div>

                                {/* Content - Compact and Clean */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-base font-bold text-[#292f36]">{room.name}</h4>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[13px] font-bold text-[#292f36]">{formatPrice(room.price, 'RWF')}</span>
                                            <span className="text-[8px] text-[#4d5053] uppercase font-bold tracking-widest leading-none">per night</span>
                                        </div>
                                    </div>

                                    <p className="text-[#4d5053] text-[11px] mb-5 line-clamp-2 leading-relaxed opacity-80">
                                        {room.description}
                                    </p>

                                    <Link
                                        href={`/rooms/${room.id}`}
                                        className="mt-auto group/btn flex items-center justify-between font-bold text-[#292f36] hover:text-accent transition-colors text-[12px]"
                                    >
                                        View Details
                                        <div className="w-10 h-10 bg-[#f4f0ec] rounded-full flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:text-white transition-all">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className="mt-16 text-center">
                    <Link
                        href="/rooms"
                        className="inline-flex items-center gap-4 bg-[#0e0e0e] text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all shadow-bloom group"
                    >
                        View More Rooms
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};
