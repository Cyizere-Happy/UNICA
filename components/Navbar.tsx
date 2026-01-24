'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bird } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 120);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Rooms', href: '/rooms' },
        { name: 'Attractions', href: '/attractions' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/#footer' },
    ];

    // The state that determines if we show the full menu or just the logo
    const isExpanded = !scrolled || isHovered;

    return (
        <div className="fixed top-8 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
            <motion.nav
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                initial={false}
                animate={{
                    width: isExpanded ? 'auto' : '230px',
                    paddingLeft: isExpanded ? '2rem' : '1.5rem',
                    paddingRight: isExpanded ? '1rem' : '1.5rem',
                }}
                transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 26,
                    mass: 0.5
                }}
                className={cn(
                    "pointer-events-auto flex items-center h-14 rounded-full overflow-hidden transition-all duration-300",
                    "bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
                )}
            >
                {/* Logo - Bird + Name stay visible together */}
                <Link href="/" className="flex items-center gap-1.5 group shrink-0 mr-4">
                    <div className="text-accent group-hover:rotate-12 transition-transform duration-300">
                        <Bird className="w-6 h-6" />
                    </div>
                    <span className="text-xl md:text-2xl font-bold tracking-tight text-[#292f36] whitespace-nowrap">
                        unica<span className="text-accent font-medium">house</span>
                    </span>
                </Link>

                {/* Dynamic Links & Button */}
                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="hidden lg:flex items-center gap-2 overflow-hidden"
                        >
                            <div className="flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-sm font-semibold text-[#292f36]/70 hover:text-[#292f36] px-4 py-2 hover:bg-black/5 rounded-full transition-all whitespace-nowrap"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                            <button className="bg-[#0e0e0e] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-black/5 hover:scale-105 transition-all active:scale-95 ml-2 whitespace-nowrap">
                                Get Started
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
};
