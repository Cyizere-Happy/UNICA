'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Wifi, Car, Wine, ShieldCheck, Utensils,
    Thermometer, Tv, Coffee
} from 'lucide-react';

const facilities = [
    { name: 'Wifi', icon: Wifi },
    { name: 'Parking', icon: Car },
    { name: 'Rooftop', icon: Wine },
    { name: 'Security', icon: ShieldCheck },
    { name: 'Kitchen', icon: Utensils },
    { name: 'AC', icon: Thermometer },
    { name: 'TV', icon: Tv },
    { name: 'Coffee', icon: Coffee }
];

export const Facilities = () => {
    return (
        <section className="py-20 px-10 md:px-20 lg:px-40 bg-white" id="facilities">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">World-Class Facilities</h2>
                    <p className="text-muted max-w-xl mx-auto">Selected for your comfort.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
                    {facilities.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="w-16 h-16 bg-beige rounded-full flex items-center justify-center group hover:bg-accent transition-all">
                                <item.icon className="w-6 h-6 text-foreground group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-sm font-semibold text-foreground">{item.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
