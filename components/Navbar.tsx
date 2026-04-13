'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, ShoppingBag, User, LogOut, FileText, LayoutDashboard, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

import { useGuestAuth } from '@/context/GuestAuthContext';
import { Sparkles } from 'lucide-react';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { toggleCart, cartItems } = useCart();
    const { 
        isAuthenticated, 
        isRegistered, 
        guestUser, 
        setEntryModalOpen, 
        setCheckoutModalOpen,
        serviceModalOpen,
        setServiceModalOpen,
        logout
    } = useGuestAuth();

    const cartCount = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);

    const handleAuthAction = () => {
        if (!isAuthenticated || !isRegistered) {
            setEntryModalOpen(true);
        } else {
            setCheckoutModalOpen(true);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Rooms', href: '/rooms' },
        { name: 'Food', href: '/food-services' },
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
                        unica<span className="text-accent font-medium">villa</span>
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
                <div className="flex items-center gap-2 md:gap-4">
                    {isAuthenticated && guestUser?.stayType !== 'APARTMENT' && (
                        <button 
                            onClick={toggleCart}
                            className="p-2.5 rounded-xl text-[#292f36] hover:bg-black/5 transition-all relative group"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    )}
 
                    {!isAuthenticated ? (
                        <button 
                            onClick={() => setEntryModalOpen(true)}
                            className="px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all active:scale-95 bg-[#0e0e0e] text-white hover:bg-black"
                        >
                            Enter
                        </button>
                    ) : (
                        <div className="relative group/menu">
                            <button 
                                className="flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-100 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                    <User size={18} />
                                </div>
                                <div className="hidden md:flex flex-col items-start leading-none gap-1">
                                    <span className="text-[10px] font-black text-[#292f36] uppercase tracking-wider">{guestUser?.name?.split(' ')[0]}</span>
                                    <span className="text-[8px] font-bold text-gray-400">{guestUser?.roomNumber || 'Guest'}</span>
                                </div>
                                <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition-transform duration-300" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 translate-y-2 group-hover/menu:translate-y-0 z-[60]">
                                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Portal Access</p>
                                </div>
                                <button 
                                    onClick={() => setServiceModalOpen(true)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-[#292f36] transition-colors group/item"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-accent/5 text-accent flex items-center justify-center group-hover/item:bg-accent group-hover/item:text-white transition-all">
                                        <Sparkles size={16} />
                                    </div>
                                    <span className="text-xs font-bold font-jost">Cleaning Service</span>
                                </button>
                                <button 
                                    onClick={() => setCheckoutModalOpen(true)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-[#292f36] transition-colors group/item"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center group-hover/item:bg-rose-50 group-hover/item:text-rose-500 transition-all">
                                        <LogOut size={16} />
                                    </div>
                                    <span className="text-xs font-bold font-jost">Initiate Checkout</span>
                                </button>
                                <div className="mt-2 pt-2 border-t border-gray-50">
                                    <button 
                                        onClick={() => {
                                            logout();
                                        }}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-rose-50/50 text-rose-500 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                            <LogOut size={16} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                        <div className="flex flex-col gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn("text-base font-semibold py-2", pathname === link.href ? "text-accent" : "text-[#292f36]")}
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
