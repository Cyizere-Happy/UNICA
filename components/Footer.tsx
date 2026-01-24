import React from 'react';
import Link from 'next/link';
import { Home, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-foreground text-background py-16 px-6" id="contact">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="space-y-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-gold p-2 rounded-lg">
                            <Home className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            UNICA <span className="text-gold">HOUSE</span>
                        </span>
                    </Link>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Experience the perfect blend of modern luxury and welcoming comfort at Unica House. Your home away from home.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-gold transition-colors"><Facebook className="w-5 h-5" /></Link>
                        <Link href="#" className="hover:text-gold transition-colors"><Instagram className="w-5 h-5" /></Link>
                        <Link href="#" className="hover:text-gold transition-colors"><Twitter className="w-5 h-5" /></Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-6">
                    <h4 className="text-white font-semibold text-lg">Quick Links</h4>
                    <ul className="space-y-3">
                        <li><Link href="/rooms" className="text-zinc-400 hover:text-white transition-colors text-sm">Our Rooms</Link></li>
                        <li><Link href="/about" className="text-zinc-400 hover:text-white transition-colors text-sm">About Us</Link></li>
                        <li><Link href="/#facilities" className="text-zinc-400 hover:text-white transition-colors text-sm">Facilities</Link></li>
                        <li><Link href="/#contact" className="text-zinc-400 hover:text-white transition-colors text-sm">Location</Link></li>
                    </ul>
                </div>

                {/* Rooms & Apartments */}
                <div className="space-y-6">
                    <h4 className="text-white font-semibold text-lg">Stay With Us</h4>
                    <ul className="space-y-3">
                        <li><Link href="/rooms" className="text-zinc-400 hover:text-white transition-colors text-sm">Superior Bedrooms</Link></li>
                        <li><Link href="/rooms" className="text-zinc-400 hover:text-white transition-colors text-sm">Modern Apartments</Link></li>
                        <li><Link href="/about" className="text-zinc-400 hover:text-white transition-colors text-sm">Unique Experience</Link></li>
                        <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Contact info */}
                <div className="space-y-6">
                    <h4 className="text-white font-semibold text-lg">Contact Us</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-zinc-400 text-sm">
                            <MapPin className="w-5 h-5 text-gold shrink-0" />
                            <span>123 Hospitality Lane, City Center</span>
                        </li>
                        <li className="flex items-center gap-3 text-zinc-400 text-sm">
                            <Phone className="w-5 h-5 text-gold shrink-0" />
                            <span>+1 (234) 567-890</span>
                        </li>
                        <li className="flex items-center gap-3 text-zinc-400 text-sm">
                            <Mail className="w-5 h-5 text-gold shrink-0" />
                            <span>stay@unicahouse.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-zinc-800 text-center">
                <p className="text-zinc-500 text-xs text-center">
                    © {new Date().getFullYear()} Unica House Hotel. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
