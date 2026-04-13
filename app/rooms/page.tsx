'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { Room } from '@/lib/gatepass/types';
import { Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { formatPrice, resolveImageUrl } from '@/lib/utils';

export default function RoomsPage() {
    const [allRooms, setAllRooms] = React.useState<Room[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const rooms = await apiService.getRooms();
                setAllRooms(rooms);
            } catch (err) {
                console.error('Failed to fetch rooms:', err);
                setError('Unable to load rooms. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const featuredRoom = allRooms.find(r => r.id === 'room-3') || (allRooms.length > 0 ? allRooms[0] : null);
    const otherRooms = allRooms.filter(r => !featuredRoom || r.id !== featuredRoom.id);

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Header Section - Resonate Style */}
            <section className="pt-36 pb-12 px-6 md:px-12 lg:px-40">
                <div className="container mx-auto">
                    <span className="text-accent font-black text-xs tracking-[0.3em] uppercase mb-4 block">
                        Our Accommodations
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-[#292f36] tracking-tight mb-8">
                        Comfort & <span className="italic font-normal">Style.</span>
                    </h1>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 text-accent animate-spin" />
                            <p className="text-muted font-bold tracking-widest uppercase text-[10px]">Fetching available rooms...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-rose-50 border border-rose-100 p-10 rounded-[40px] text-center">
                            <p className="text-rose-600 font-bold mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-[#292f36] text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : allRooms.length === 0 ? (
                        <div className="bg-zinc-50 border border-zinc-100 p-10 rounded-[40px] text-center">
                            <p className="text-muted font-bold tracking-widest uppercase text-[10px]">No rooms available at the moment.</p>
                        </div>
                    ) : (
                        <>
                            {featuredRoom && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-[40px] overflow-hidden shadow-bloom border border-black/5 flex flex-col lg:flex-row mb-16"
                        >
                            <div className="lg:w-3/5 relative min-h-[340px]">
                                <div className="absolute top-8 left-8 z-10">
                                    <span className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        Featured Stay
                                    </span>
                                </div>
                                <Image
                                    src={resolveImageUrl(featuredRoom.mainImage)}
                                    alt={featuredRoom.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="lg:w-2/5 p-8 md:p-10 flex flex-col justify-center">
                                <div className="flex items-center gap-6 text-[10px] tracking-[0.2em] uppercase font-black text-accent mb-6">
                                    <span>{featuredRoom.type}</span>
                                    <span>·</span>
                                    <div className="flex items-center gap-2 text-muted/60">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Instant Booking</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-[#292f36] mb-6 leading-tight">
                                    {featuredRoom.name}
                                </h2>
                                <p className="text-[#4d5053] text-base leading-relaxed mb-10 font-medium">
                                    {featuredRoom.description}
                                </p>
                                <Link
                                    href={`/rooms/${featuredRoom.id}`}
                                    className="flex items-center gap-4 text-sm font-black text-[#292f36] group hover:text-accent transition-colors"
                                >
                                    <span className="border-b-2 border-black group-hover:border-accent pb-1 transition-colors uppercase tracking-widest">
                                        View Room Details
                                    </span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* Rooms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {otherRooms.map((room) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-[32px] overflow-hidden shadow-bloom border border-black/5 group flex flex-col"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <div className="absolute top-6 left-6 z-10">
                                        <span className="bg-[#0e0e0e] text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                            {room.type}
                                        </span>
                                    </div>
                                    <Image
                                        src={resolveImageUrl(room.mainImage)}
                                        alt={room.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-[9px] tracking-[0.15em] uppercase font-black text-accent/60 mb-3">
                                        <span>{room.size}</span>
                                        <span>·</span>
                                        <span>{room.capacity} Guests</span>
                                    </div>
                                    <h3 className="text-lg font-black text-[#292f36] mb-3 group-hover:text-accent transition-colors">
                                        {room.name}
                                    </h3>
                                    <p className="text-[#4d5053] text-[11px] leading-relaxed mb-6 flex-1 opacity-80 line-clamp-2">
                                        {room.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-black/5">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black text-[#292f36] leading-none">
                                                {formatPrice(room.price)}
                                            </span>
                                            <span className="text-[9px] uppercase font-black tracking-widest text-muted/40">
                                                per night
                                            </span>
                                        </div>
                                        <Link
                                            href={`/rooms/${room.id}`}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#292f36] hover:text-accent transition-colors"
                                        >
                                            View Room <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    </section>

            <Footer />
        </main>
    );
}
