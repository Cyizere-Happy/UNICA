import React from 'react';
import Link from 'next/link';
import { Home, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-foreground text-background py-10 md:py-20 px-6 md:px-12 lg:px-40" id="contact">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 lg:gap-24">
                    {/* Brand */}
                    <div className="space-y-4 md:space-y-6 col-span-1 sm:col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <Home className="text-accent w-6 h-6" />
                            <span className="text-xl md:text-2xl font-black tracking-tight text-white uppercase italic">
                                UNICA<span className="text-accent font-normal">HOUSE</span>
                            </span>
                        </Link>
                        <p className="text-zinc-400 text-[13px] leading-relaxed max-w-xs font-medium opacity-80">
                            Experience the perfect blend of modern luxury and welcoming comfort at Unica House. Your home away from home.
                        </p>
                        <div className="flex gap-5 pt-2">
                            <Link href="#" className="text-zinc-400 hover:text-accent transition-colors"><Facebook className="w-5 h-5" /></Link>
                            <Link href="#" className="text-zinc-400 hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></Link>
                            <Link href="#" className="text-zinc-400 hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4 md:space-y-6">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4">Quick Links</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/rooms" className="text-zinc-400 hover:text-accent transition-all text-[13px] font-medium block">Our Rooms</Link></li>
                            <li><Link href="/attractions" className="text-zinc-400 hover:text-accent transition-all text-[13px] font-medium block">Attractions</Link></li>
                            <li><Link href="/about" className="text-zinc-400 hover:text-accent transition-all text-[13px] font-medium block">About Us</Link></li>
                            <li><Link href="/#facilities" className="text-zinc-400 hover:text-accent transition-all text-[13px] font-medium block">Facilities</Link></li>
                            <li><Link href="/#contact" className="text-zinc-400 hover:text-accent transition-all text-[13px] font-medium block">Location</Link></li>
                        </ul>
                    </div>

                    {/* Stay With Us */}
                    <div className="space-y-4 md:space-y-6">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4">Stay With Us</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/rooms" className="text-zinc-400 hover:text-accent transition-all text-[13px] font-medium block">Superior Bedrooms</Link></li>
                            <li><Link href="/rooms" className="text-zinc-400 hover:text-accent transition-all text-[13px] font-medium block">Modern Apartments</Link></li>
                            <li><Link href="/about" className="text-zinc-400 hover:text-accent transition-all text-[13px] font-medium block">Unique Experience</Link></li>
                            <li><Link href="#" className="text-zinc-400 hover:text-accent transition-all text-[13px] font-medium block">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact info */}
                    <div className="space-y-4 md:space-y-6">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-zinc-400 text-[13px] font-medium">
                                <MapPin className="w-4 h-4 text-accent shrink-0" />
                                <span>Gikondo, Kicukiro</span>
                            </li>
                            <li className="flex items-center gap-3 text-zinc-400 text-[13px] font-medium">
                                <Phone className="w-4 h-4 text-accent shrink-0" />
                                <span>0788507076 / 0788860616</span>
                            </li>
                            <li className="flex items-center gap-3 text-zinc-400 text-[13px] font-medium">
                                <Mail className="w-4 h-4 text-accent shrink-0" />
                                <span>stay@unicahouse.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 md:pt-16 mt-8 md:mt-16 border-t border-white/5 text-center">
                    <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest text-center opacity-60">
                        © {new Date().getFullYear()} Unica House Hotel. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>

    );
};
