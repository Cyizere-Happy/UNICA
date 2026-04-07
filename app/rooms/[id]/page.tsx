'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {

    ArrowLeft, Check, Users, Maximize, Calendar,
    Wifi, Tv, Coffee, Thermometer, ShieldCheck, Star
} from 'lucide-react';
import { rooms } from '@/lib/data';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { formatPrice } from '@/lib/utils';
import { BookingModal } from '@/components/BookingModal';


export default function RoomDetails() {
    const { id } = useParams();
    const router = useRouter();
    const room = rooms.find(r => r.id === id);
    const [activeImage, setActiveImage] = useState(room?.mainImage || '');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);


    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Room Not Found</h1>
                    <Link href="/" className="text-gold hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    const allImages = [room.mainImage, ...room.gallery];

    return (
        <main className="relative min-h-screen bg-background">
            <Navbar />

            {/* Spacer for navbar */}
            <div className="h-24" />

            <section className="py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-zinc-500 hover:text-accent transition-colors mb-8 font-medium text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Accommodations
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Gallery Column */}
                        <div className="lg:col-span-7 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl border border-border"
                            >
                                <Image
                                    src={activeImage}
                                    alt={room.name}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            <div className="grid grid-cols-4 gap-3">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <Image src={img} alt={`${room.name} gallery ${idx}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info Column */}
                        <div className="lg:col-span-5 space-y-10">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-accent/10 text-accent px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-accent/20">
                                        {room.type}
                                    </span>
                                    <div className="flex items-center gap-1 text-accent">
                                        <Star className="w-4 h-4 fill-accent" />
                                        <span className="text-sm font-bold">5.0</span>
                                    </div>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">{room.name}</h1>
                                <p className="text-zinc-500 text-base leading-relaxed">
                                    {room.description}
                                </p>
                            </div>

                            {/* Specs */}
                            <div className="grid grid-cols-2 gap-4 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-[1.5rem] border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center shadow-sm">
                                        <Users className="w-4 h-4 text-accent" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Capacity</span>
                                        <span className="font-bold text-sm">{room.capacity} Guests</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center shadow-sm">
                                        <Maximize className="w-4 h-4 text-accent" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Room Size</span>
                                        <span className="font-bold text-sm">{room.size}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div>
                                <h3 className="text-base font-bold mb-4">Premium Amenities</h3>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                                    {room.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-accent" />
                                            </div>
                                            <span className="text-zinc-600 dark:text-zinc-400 font-medium text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Booking Sidebar / Action Box */}
                            <div className="glass p-6 rounded-[1.5rem] mt-8 shadow-xl shadow-accent/5 border-accent/20">
                                <div className="flex items-end justify-between mb-6">
                                    <div>
                                        <span className="text-xs font-medium text-zinc-500 block mb-1">Starting from</span>
                                        <span className="text-3xl font-bold text-accent">{formatPrice(room.price)}</span>
                                        <span className="text-zinc-400 font-medium whitespace-nowrap text-sm"> / night</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full">Available</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        console.log("Opening booking modal for room:", room.id);
                                        setIsBookingModalOpen(true);
                                    }}
                                    className="w-full bg-[#0e0e0e] text-white py-4 rounded-xl text-base font-bold hover:bg-black transition-all shadow-lg shadow-black/5 hover:-translate-y-1 active:scale-95"
                                >
                                    Book This Room
                                </button>


                                <p className="text-center text-zinc-400 text-[10px] mt-4">No payment required now. Pay during check-in.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />

            <AnimatePresence>
                {isBookingModalOpen && (
                    <BookingModal
                        isOpen={isBookingModalOpen}
                        onClose={() => setIsBookingModalOpen(false)}
                        room={room}
                    />
                )}
            </AnimatePresence>
        </main>

    );
}

