'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const heroImages = [
    { src: "/Images/UNICA_Morning_Front_view.jpg", alt: "Unica House Morning View" },
    { src: "/Images/UNICA_House_Evening_side_view.jpg", alt: "Unica House Evening Side View" },
    { src: "/Images/UNICA_House_Evening_Front_view.jpg", alt: "Unica House Evening Front View" },
    { src: "/Images/UNICA_House_Night_Front_View.jpg", alt: "Unica House Night View" },
    { src: "/Images/UNICA_Morning_Side_View.jpg", alt: "Unica House Morning Side View" },
];

export const Hero = () => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full min-h-[80vh] bg-white flex items-center pt-40 pb-20 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 lg:px-40">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-40">

                    {/* Text Content - Resonate Bold Proportions */}
                    <div className="flex-1 text-left z-10 lg:max-w-[60%]">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#292f36] mb-8 leading-[1.05] tracking-[-0.04em]">
                                Live the <br />
                                <span className="text-accent underline decoration-black/5 underline-offset-8">Unique Life.</span>
                            </h1>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-12">
                                <Link href="/rooms">
                                    <button className="btn-dark text-lg px-10 py-5">
                                        Explore UNICA House
                                        <ArrowRight className="w-5 h-5 ml-4" />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Image Content - Precise Mockup Aspect Ratio & Shadow */}
                    <div className="flex-shrink-0 w-full lg:w-[40%] relative aspect-[4/5]">
                        <div className="relative w-full h-full overflow-hidden rounded-[40px] shadow-bloom border border-black/5">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImage}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={heroImages[currentImage].src}
                                        alt={heroImages[currentImage].alt}
                                        fill
                                        priority
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-accent/5 mix-blend-multiply" />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
