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
        { name: 'Attractions', href: '/attractions' },
        { name: 'Contact Us', href: '/contact' },
    ];

    return (
        <nav className={cn(
            "fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl transition-all duration-500",
            scrolled ? "top-3" : "top-6"
        )}>
            <div className={cn(
                "rounded-2xl border border-black/10 bg-white transition-all duration-500 px-4 py-3 md:px-6 md:py-3.5 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.08)]",
                scrolled && "shadow-[0_16px_45px_rgba(0,0,0,0.15)]"
            )}>

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="text-accent">
                        <Home className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-black tracking-tight text-[#292f36]">
                        unica<span className="text-accent font-medium">house</span>
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-[13px] font-semibold transition-all duration-300 relative",
                                pathname === link.href ? "text-[#292f36]" : "text-[#4d5053] hover:text-[#292f36]"
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
                        <button className="px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all active:scale-95 bg-[#0e0e0e] text-white hover:bg-black">
                            Rooms
                        </button>
                    </Link>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-lg transition-all text-[#292f36] hover:bg-black/5"
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
                        className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] p-6 lg:hidden border border-black/10"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn("text-base font-semibold", pathname === link.href ? "text-accent" : "text-[#292f36]")}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link href="/rooms" onClick={() => setIsOpen(false)}>
                                <button className="bg-[#0e0e0e] text-white w-full py-3 rounded-xl font-semibold text-sm">
                                    Rooms
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
