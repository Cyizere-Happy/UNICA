'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, X, Zap, Leaf, Flame, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { cn, resolveImageUrl } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';
import { apiService } from '@/lib/gatepass/apiService';

import { useCart } from '@/context/CartContext';
import { useGuestAuth } from '@/context/GuestAuthContext';

type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner'];

export default function FoodServicesPage() {
    const [activeMeal, setActiveMeal] = useState<MealType>('Breakfast');
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const { cartItems, updateCart } = useCart();
    const { isAuthenticated, isRegistered, guestUser, setEntryModalOpen } = useGuestAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        apiService.getMenu()
            .then(items => {
                setMenuItems(items);
                setError(null);
            })
            .catch(err => {
                console.error('Failed to fetch menu:', err);
                setError('Our kitchen is currently being updated. Please check back soon.');
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredItems = useMemo(
        () => menuItems.filter((item) => item.meal === activeMeal),
        [activeMeal, menuItems]
    );

    const getItemQty = (id: string) => {
        return cartItems.find(i => i.id === id)?.cartQuantity || 0;
    };

    const totalItems = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);
    const isFullGuest = isAuthenticated && isRegistered;
    const canOrderInterface = isAuthenticated; // Allow authenticated but unregistered guests to add to cart
    const isApartmentGuest = guestUser?.stayType === 'APARTMENT';

    return (
        <main className="min-h-screen bg-[#f6f7f9]">
            <Navbar />

            <section className="pt-36 pb-20 px-6 md:px-10">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-10">
                        <span className="text-accent font-black text-xs tracking-[0.28em] uppercase mb-3 block">
                            Food Services
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-[#292f36] tracking-tight">
                            Order Your <span className="italic font-normal">Meals.</span>
                        </h1>
                        <p className="text-[#4d5053] text-sm md:text-base font-medium mt-4 max-w-xl mx-auto">
                            Select breakfast, lunch, or dinner and add your favorites to the order.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-3 border border-black/5 shadow-[0_12px_36px_rgba(0,0,0,0.08)] flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-2">
                            {mealTypes.map((meal) => (
                                <button
                                    key={meal}
                                    onClick={() => setActiveMeal(meal)}
                                    className={cn(
                                        'px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                                        activeMeal === meal
                                            ? 'bg-[#0e0e0e] text-white shadow-md'
                                            : 'bg-[#f4f5f7] text-[#4d5053] hover:bg-[#eceff2]'
                                    )}
                                >
                                    {meal}
                                </button>
                            ))}
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-xl bg-accent/10 text-accent px-4 py-2 text-sm font-bold">
                            <ShoppingBag className="w-4 h-4" />
                            {totalItems} item{totalItems === 1 ? '' : 's'} selected
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted font-bold tracking-widest uppercase text-[10px]">Preparing the menu...</p>
                        </div>
                    ) : error || filteredItems.length === 0 ? (
                        <div className="bg-white border border-black/5 p-12 rounded-[32px] text-center shadow-bloom max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Leaf className="w-10 h-10 text-accent/40" />
                            </div>
                            <h3 className="text-xl font-black text-[#292f36] mb-3">
                                {error ? 'Kitchen Service Offline' : `No ${activeMeal} items found`}
                            </h3>
                            <p className="text-[#4d5053] text-sm font-medium mb-8">
                                {error || `We don't have any items listed for ${activeMeal} at the moment. Please check our other meal times.`}
                            </p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-[#0e0e0e] text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                            >
                                Refresh Menu
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layoutId={`card-${item.id}`}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35 }}
                                    onClick={() => setSelectedItem(item)}
                                    className="bg-white rounded-2xl border border-black/5 shadow-[0_10px_24px_rgba(0,0,0,0.07)] overflow-hidden cursor-pointer group"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <Image 
                                            src={resolveImageUrl(item.image)} 
                                            alt={item.name} 
                                            fill 
                                            className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg">
                                                <Zap className="w-4 h-4 text-accent" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-black text-[#292f36] mb-1">{item.name}</h3>
                                        <p className="text-[13px] text-[#4d5053] leading-relaxed mb-4 line-clamp-2">{item.description}</p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-black text-[#292f36]">{item.price} RWF</span>

                                            {canOrderInterface ? (
                                                isApartmentGuest ? (
                                                    <div className="px-4 py-2 bg-gray-100 text-[#292f36]/40 text-[9px] font-black uppercase tracking-widest rounded-xl border border-black/5">
                                                        Menu Only
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 bg-[#f5f6f8] rounded-xl p-1" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => updateCart(item, -1)}
                                                            className="w-8 h-8 rounded-lg bg-white text-[#292f36] hover:bg-zinc-100 flex items-center justify-center transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-7 text-center text-sm font-bold text-[#292f36]">
                                                            {getItemQty(item.id)}
                                                        </span>
                                                        <button
                                                            onClick={() => updateCart(item, 1)}
                                                            className="w-8 h-8 rounded-lg bg-[#0e0e0e] text-white hover:bg-black flex items-center justify-center transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )
                                            ) : (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEntryModalOpen(true);
                                                    }}
                                                    className="px-4 py-2 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent hover:text-white transition-all"
                                                >
                                                    Member Only
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-md overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-2xl overflow-hidden relative"
                        >
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-6 right-6 z-20 p-2.5 bg-black/5 hover:bg-black/10 rounded-full transition-colors group"
                            >
                                <X className="w-5 h-5 text-gray-800 transition-transform group-hover:rotate-90 duration-300" />
                            </button>

                            <div className="flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[80vh]">
                                {/* Left Side - Image */}
                                <div className="md:w-[45%] h-36 md:h-auto relative shrink-0">
                                    <Image src={resolveImageUrl(selectedItem.image)} alt={selectedItem.name} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                                </div>

                                {/* Right Side - Details */}
                                <div className="md:w-[55%] p-5 md:p-8 flex flex-col h-full overflow-y-auto">
                                    <div className="mb-4">
                                        <span className="text-accent font-black text-[9px] tracking-[0.2em] uppercase mb-1 block">
                                            {selectedItem.meal} Menu
                                        </span>
                                        <h2 className="text-xl md:text-3xl font-black text-[#292f36] leading-tight mb-1.5">
                                            {selectedItem.name}
                                        </h2>
                                        <p className="text-gray-500 text-xs md:text-[13px] font-medium leading-relaxed">
                                            {selectedItem.description}
                                        </p>
                                    </div>

                                    {/* Nutritional Info */}
                                    <div className="grid grid-cols-4 gap-2 mb-4">
                                        {[
                                            { label: 'Cals', val: selectedItem.calories, icon: Flame },
                                            { label: 'Prot', val: selectedItem.protein, icon: ShieldCheck },
                                            { label: 'Carbs', val: selectedItem.carbs, icon: Zap },
                                            { label: 'Fat', val: selectedItem.fat, icon: Leaf },
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100/50">
                                                <stat.icon className="w-2.5 h-2.5 text-accent mx-auto mb-1 opacity-60" />
                                                <p className="font-black text-[#292f36] text-[11px]">{stat.val}</p>
                                                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Ingredients */}
                                    <div className="mb-4">
                                        <h4 className="text-[10px] font-black text-[#292f36] uppercase tracking-[0.12em] mb-2">Ingredients</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedItem.ingredients?.map((ing: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-[#f5f6f8] text-[#4d5053] text-[9px] font-semibold rounded-md border border-black/5">
                                                    {ing}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Sticky Footer for Action */}
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between shrink-0">
                                        <div className="flex flex-col">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Price</p>
                                            <span className="text-xl font-black text-[#292f36]">
                                                {selectedItem.price * Math.max(1, getItemQty(selectedItem.id))} RWF
                                            </span>
                                        </div>

                                        {canOrderInterface ? (
                                            isApartmentGuest ? (
                                                <div className="px-6 py-3 bg-gray-100 text-[#292f36]/40 rounded-xl font-black text-[10px] uppercase tracking-widest border border-black/5">
                                                    Dining Preview Mode
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2.5 bg-[#f5f6f8] rounded-xl p-1.5">
                                                        <button
                                                            onClick={() => updateCart(selectedItem, -1)}
                                                            className="w-8 h-8 rounded-lg bg-white text-[#292f36] hover:bg-zinc-100 flex items-center justify-center shadow-sm transition-all active:scale-90"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-6 text-center text-base font-black text-[#292f36]">
                                                            {getItemQty(selectedItem.id)}
                                                        </span>
                                                        <button
                                                            onClick={() => updateCart(selectedItem, 1)}
                                                            className="w-8 h-8 rounded-lg bg-[#0e0e0e] text-white hover:bg-black flex items-center justify-center shadow-md transition-all active:scale-90"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <button 
                                                onClick={() => setEntryModalOpen(true)}
                                                className="px-6 py-3 bg-[#292f36] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                                            >
                                                Register to Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
