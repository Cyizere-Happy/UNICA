'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Check, Users, Maximize, Calendar,
    Wifi, Tv, Coffee, Thermometer, ShieldCheck, MapPin, Star
} from 'lucide-react';
import { rooms } from '@/lib/data';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { formatPrice } from '@/lib/utils';

export default function RoomDetails() {
    const { id } = useParams();
    const router = useRouter();
    const room = rooms.find(r => r.id === id);
    const [activeImage, setActiveImage] = useState(room?.mainImage || '');

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

            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-zinc-500 hover:text-gold transition-colors mb-10 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back to Accommodations
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Gallery Column */}
                        <div className="lg:col-span-7 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border border-border"
                            >
                                <Image
                                    src={activeImage}
                                    alt={room.name}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            <div className="grid grid-cols-4 gap-4">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'}`}
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
                                    <span className="bg-gold/10 text-gold px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-gold/20">
                                        {room.type}
                                    </span>
                                    <div className="flex items-center gap-1 text-gold">
                                        <Star className="w-4 h-4 fill-gold" />
                                        <span className="text-sm font-bold">5.0</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{room.name}</h1>
                                <p className="text-zinc-500 text-lg leading-relaxed">
                                    {room.description}
                                </p>
                            </div>

                            {/* Specs */}
                            <div className="grid grid-cols-2 gap-6 p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
                                        <Users className="w-5 h-5 text-gold" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-zinc-400 uppercase tracking-tighter">Capacity</span>
                                        <span className="font-bold">{room.capacity} Guests</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
                                        <Maximize className="w-5 h-5 text-gold" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-zinc-400 uppercase tracking-tighter">Room Size</span>
                                        <span className="font-bold">{room.size}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div>
                                <h3 className="text-xl font-bold mb-6">Premium Amenities</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    {room.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                                                <Check className="w-3.5 h-3.5 text-gold" />
                                            </div>
                                            <span className="text-zinc-600 dark:text-zinc-400 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Booking Sidebar / Action Box */}
                            <div className="glass p-8 rounded-[2.5rem] mt-10 shadow-xl shadow-gold/5 border-gold/20">
                                <div className="flex items-end justify-between mb-8">
                                    <div>
                                        <span className="text-sm font-medium text-zinc-500 block mb-1">Starting from</span>
                                        <span className="text-4xl font-bold text-gold">{formatPrice(room.price)}</span>
                                        <span className="text-zinc-400 font-medium whitespace-nowrap"> / night</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full">Available</span>
                                    </div>
                                </div>

                                <button className="w-full bg-gold text-white py-5 rounded-2xl text-xl font-bold hover:bg-gold/90 transition-all shadow-lg shadow-gold/20 hover:-translate-y-1 active:scale-95">
                                    Book This Room
                                </button>
                                <p className="text-center text-zinc-400 text-xs mt-4">No payment required now. Pay during check-in.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
