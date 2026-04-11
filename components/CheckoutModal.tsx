'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useGuestAuth } from '@/context/GuestAuthContext';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { operationalData } from '@/lib/gatepass/operationalData';
import { toast } from 'sonner';

export default function CheckoutModal() {
  const { 
      checkoutModalOpen, 
      setCheckoutModalOpen, 
      guestUser, 
      logout 
  } = useGuestAuth();
  
  const { clearCart } = useCart();
  const [testimonial, setTestimonial] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!checkoutModalOpen || !guestUser) return null;

  const isEarlyCheckout = guestUser.checkOutDate 
    ? new Date() < new Date(guestUser.checkOutDate)
    : false;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1200));

    if (testimonial.trim()) {
        try {
            // Push the testimonial as a structured feedback message to the admin dashboard
            operationalData.saveMessage({
                id: `MSG-${Date.now()}`,
                name: guestUser.name,
                email: guestUser.email,
                subject: 'Guest Testimonial & Feedback',
                message: testimonial,
                status: 'UNREAD',
                createdAt: new Date().toISOString()
            });
        } catch (err) {
            console.error(err);
        }
    }

    // Find and update the active stay status for the admin dashboard
    const allStays = operationalData.getStays();
    const guestStay = allStays.find(s => s.guestName === guestUser.name && s.status === 'CHECKED_IN');
    if (guestStay) {
        operationalData.updateStayStatus(guestStay.id, 'CHECKED_OUT');
    }

    toast.success("Checkout Successful. Thank you for staying with UNICA!");
    setIsSubmitting(false);
    clearCart(); // Clear any pending room service
    setCheckoutModalOpen(false);
    logout(); // Officially end guest session
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 md:p-4 font-jost">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setCheckoutModalOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[24px] md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-hidden"
      >
        {/* Mascot / Visual Side - Warm Orange Theme for departure */}
        <div className="w-full md:w-[42%] bg-[#cf6a36] relative flex flex-col items-center justify-center p-8 md:p-12 text-center text-white shrink-0 min-h-[200px] md:min-h-auto">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="relative z-10 w-28 md:w-full max-w-[180px]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative bg-white/10 backdrop-blur-sm p-3 md:p-5 rounded-[32px] md:rounded-[40px] border border-white/10 shadow-2xl"
                >
                    <Image 
                        src="/unica_mascot_checkout.png"
                        alt="Unica Mascot Goodbye"
                        width={240}
                        height={240}
                        className="w-full h-auto drop-shadow-2xl object-contain rounded-xl md:rounded-2xl"
                    />
                </motion.div>
            </div>

            <div className="mt-4 md:mt-8 relative z-10 hidden md:block">
                <h3 className="text-xl md:text-2xl font-black mb-2">
                    Departing So Soon?
                </h3>
                <p className="text-white/80 text-xs md:text-sm font-medium leading-relaxed max-w-[220px]">
                    {isEarlyCheckout 
                      ? 'We noticed you are checking out ahead of schedule. Is everything okay?' 
                      : 'We hope you had a wonderful stay at UNICA House!'}
                </p>
            </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-[58%] p-6 md:p-12 relative flex flex-col bg-white">
            <button 
                onClick={() => setCheckoutModalOpen(false)} 
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-black/5 rounded-full transition-all group z-20"
            >
                <X className="w-5 h-5 text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 md:py-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6 md:space-y-8"
                >
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-black text-[#292f36]">Checkout Procedure</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                            {guestUser.name} • {guestUser.roomNumber || guestUser.stayCode}
                        </p>
                    </div>

                    {isEarlyCheckout && (
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
                            <AlertCircle className="text-amber-500 shrink-0 w-5 h-5 mt-0.5" />
                            <div>
                                <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1">Early Checkout Warning</p>
                                <p className="text-xs text-amber-600/80 font-bold leading-relaxed">
                                    Your scheduled departure is {new Date(guestUser.checkOutDate!).toLocaleDateString()}. Are you absolutely certain you wish to end your stay right now?
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleCheckout} className="space-y-5 md:space-y-6">
                        
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black text-[#292f36] uppercase tracking-[0.2em] ml-1 block">
                                Share Your Experience (Optional)
                            </label>
                            <textarea
                                value={testimonial}
                                onChange={(e) => setTestimonial(e.target.value)}
                                placeholder="How was your stay? Any feedback for our chef or management?"
                                className="w-full px-5 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-[#cf6a36]/40 focus:ring-4 focus:ring-[#cf6a36]/5 transition-all text-sm font-medium text-[#292f36] placeholder:text-gray-300 resize-none h-32"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 md:py-5 bg-[#292f36] text-white rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 group"
                        >
                            {isSubmitting ? 'Finalizing Checkout...' : 'Confirm Checkout'}
                            {!isSubmitting && <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <p className="text-center text-[10px] text-gray-400 font-bold">
                        Upon checkout, your room pin will be detached and your tab will be sent to your email.
                    </p>
                </motion.div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
