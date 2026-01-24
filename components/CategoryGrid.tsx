'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const CategoryGrid = () => {
    const categories = [
        {
            title: 'Interior Design',
            desc: 'Enhancing the interior to achieve a healthier environment for the people using right space.',
        },
        {
            title: 'Furniture',
            desc: 'Movable articles that are used to make a room or building suitable for living or working.',
        },
        {
            title: 'Flooring',
            desc: 'Thin object any finished material applied over a floor structure to provide a walking surface.',
        }
    ];

    return (
        <section className="bg-white py-12 px-6 md:px-12 lg:px-40">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <h3 className="text-xl font-bold mb-3 text-[#292f36]">{cat.title}</h3>
                        <p className="text-[#4d5053] text-sm leading-relaxed mb-6 max-w-[260px]">
                            {cat.desc}
                        </p>
                        <Link href="#rooms" className="group flex items-center gap-2 font-bold text-[#292f36] hover:text-accent transition-colors text-xs">
                            View More
                            <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
