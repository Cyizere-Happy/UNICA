'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';

type MealType = 'Breakfast' | 'Lunch' | 'Dinner';

type FoodItem = {
    id: string;
    name: string;
    meal: MealType;
    price: number;
    image: string;
    description: string;
};

const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner'];

const foodItems: FoodItem[] = [
    { id: 'b1', name: 'Sunrise Omelette', meal: 'Breakfast', price: 8, image: '/food/sunrise_omelette.png', description: 'Farm eggs, herbs, toast, and seasonal fruit.' },
    { id: 'b2', name: 'Granola Bowl', meal: 'Breakfast', price: 7, image: '/food/granola_bowl.png', description: 'Yogurt, house granola, banana, and honey drizzle.' },
    { id: 'b3', name: 'Pancake Stack', meal: 'Breakfast', price: 9, image: '/food/pancake_stack.png', description: 'Fluffy pancakes served with syrup and berries.' },
    { id: 'l1', name: 'Grilled Chicken Wrap', meal: 'Lunch', price: 12, image: '/food/chicken_wrap.png', description: 'Crisp greens, grilled chicken, and garlic aioli.' },
    { id: 'l2', name: 'Garden Bowl', meal: 'Lunch', price: 11, image: '/food/garden_bowl.png', description: 'Fresh greens, avocado, roasted seeds, and dressing.' },
    { id: 'l3', name: 'Beef Burger', meal: 'Lunch', price: 13, image: '/food/beef_burger.png', description: 'Toasted bun, premium beef patty, and fries.' },
    { id: 'd1', name: 'Steak Plate', meal: 'Dinner', price: 21, image: '/food/steak_plate.png', description: 'Pan-seared steak, mashed potatoes, and vegetables.' },
    { id: 'd2', name: 'Herb Salmon', meal: 'Dinner', price: 19, image: '/food/herb_salmon.png', description: 'Oven baked salmon with lemon butter and greens.' },
    { id: 'd3', name: 'Pasta Alfredo', meal: 'Dinner', price: 16, image: '/food/pasta_alfredo.png', description: 'Creamy sauce, parmesan, and fresh parsley.' },
];

export default function FoodServicesPage() {
    const [activeMeal, setActiveMeal] = useState<MealType>('Breakfast');
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const filteredItems = useMemo(
        () => foodItems.filter((item) => item.meal === activeMeal),
        [activeMeal]
    );

    const updateQty = (id: string, change: number) => {
        setQuantities((prev) => {
            const next = Math.max(0, (prev[id] ?? 0) + change);
            return { ...prev, [id]: next };
        });
    };

    const totalItems = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                                className="bg-white rounded-2xl border border-black/5 shadow-[0_10px_24px_rgba(0,0,0,0.07)] overflow-hidden"
                            >
                                <div className="relative h-44">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-black text-[#292f36] mb-1">{item.name}</h3>
                                    <p className="text-[13px] text-[#4d5053] leading-relaxed mb-4">{item.description}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-black text-[#292f36]">${item.price.toFixed(2)}</span>

                                        <div className="flex items-center gap-2 bg-[#f5f6f8] rounded-xl p-1">
                                            <button
                                                onClick={() => updateQty(item.id, -1)}
                                                className="w-8 h-8 rounded-lg bg-white text-[#292f36] hover:bg-zinc-100 flex items-center justify-center"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-7 text-center text-sm font-bold text-[#292f36]">
                                                {quantities[item.id] ?? 0}
                                            </span>
                                            <button
                                                onClick={() => updateQty(item.id, 1)}
                                                className="w-8 h-8 rounded-lg bg-[#0e0e0e] text-white hover:bg-black flex items-center justify-center"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

