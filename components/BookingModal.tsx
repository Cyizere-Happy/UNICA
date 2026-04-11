'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { BookingForm } from './BookingForm';
import { Room } from '@/lib/data';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room;
}

export const BookingModal = ({ isOpen, onClose, room }: BookingModalProps) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl z-10"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-all text-zinc-500 z-50 group"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <BookingForm
                        room={room}
                        onSuccess={() => {
                            // User now dismisses the modal manually via the "Mark as Read" button
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );

};
