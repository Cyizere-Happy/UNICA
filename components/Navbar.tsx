'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Rooms', href: '/rooms' },
        { name: 'Prices', href: '/prices' },
        { name: 'Attractions', href: '/attractions' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
    ];

    return (
        <nav className={cn(
            "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-fit whitespace-nowrap px-4",
            scrolled ? "top-4" : "top-8"
        )}>
            <div className="bg-white/90 backdrop-blur-xl rounded-full border border-black/5 shadow-bloom px-6 py-2 md:px-10 md:py-3 flex items-center justify-between gap-12 lg:gap-24">

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="text-accent">
                        <Home className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-[#292f36]">
                        unica<span className="text-accent font-medium">house</span>
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-bold text-[#4d5053] hover:text-[#292f36] transition-colors relative",
                                pathname === link.href && "text-[#292f36]"
                            )}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent rounded-full"
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right Action Button */}
                <div className="flex items-center gap-4">
                    <Link href="/rooms" className="hidden md:block">
                        <button className="bg-[#0e0e0e] text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                            GET STARTED
                        </button>
                    </Link>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-[#292f36] hover:bg-black/5 rounded-full transition-all"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-bloom p-8 lg:hidden border border-black/5"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "text-xl font-bold tracking-tight",
                                        pathname === link.href ? "text-accent" : "text-[#292f36]"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link href="/rooms" onClick={() => setIsOpen(false)}>
                                <button className="bg-[#0e0e0e] text-white w-full py-5 rounded-2xl font-bold text-lg shadow-bloom">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
