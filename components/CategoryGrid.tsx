'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const CategoryGrid = () => {
    const categories = [
        {
            title: 'Exclusive Living',
            desc: 'Refined, modern spaces designed for individuals who want their home to reflect their success.',
        },
        {
            title: 'Modern Comfort',
            desc: 'Sourcing the finest materials to provide a premium living experience tailored to your lifestyle.',
        },
        {
            title: 'Refined Design',
            desc: 'Thoughtful interiors that set a new standard for distinctive, high-end apartment living.',
        }
    ];

    return (
        <section className="bg-white py-24 md:py-32 px-6 md:px-12 lg:px-40 border-b border-black/5">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col"
                    >
                        <h3 className="text-xl md:text-2xl font-bold mb-6 text-[#292f36] tracking-[-0.03em]">{cat.title}</h3>
                        <p className="text-[#292f36]/70 text-base leading-relaxed font-medium">
                            {cat.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
