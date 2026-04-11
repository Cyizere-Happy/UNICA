'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Star, Search, Filter, MailOpen, Mail, 
  Trash2, ExternalLink, Calendar, CheckCircle2, User, ChevronRight, Send, Reply
} from 'lucide-react';
import { toast } from 'sonner';
import { operationalData } from '@/lib/gatepass/operationalData';
import { ContactMessage, FoodOrder } from '@/lib/gatepass/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Messages() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'feedback'>('inquiries');
  const [search, setSearch] = useState('');
  
  // Reply flow state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [userRole, setUserRole] = useState<string>('ADMIN');
  
  // State
  const [messages, setMessages] = useState<ContactMessage[]>(operationalData.getMessages());
  const [ordersWithFeedback, setOrdersWithFeedback] = useState<FoodOrder[]>([]);

  // Sync logic
  useEffect(() => {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        setUserRole(u.role || 'ADMIN');
        if (u.role === 'KITCHEN') {
          setActiveTab('feedback');
        }
      } catch (e) { /* ignore */ }
    }

    const handleSync = () => {
      setMessages(operationalData.getMessages());
      setOrdersWithFeedback(
        operationalData.getOrders().filter(o => o.testimonial || o.rating)
      );
    };
    handleSync(); // Initial load
    window.addEventListener('storage', handleSync);
    window.addEventListener('fica-data-update', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('fica-data-update', handleSync);
    };
  }, []);

  // Handlers
  const handleMarkAsRead = (id: string, currentStatus: string) => {
    if (currentStatus === 'UNREAD') {
        operationalData.markMessageRead(id);
    }
  };

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) {
        toast.error('Please draft a response first.');
        return;
    }
    // Simulate backend sending email
    toast.success('Email successfully routed and sent to recipient.');
    operationalData.markMessageRead(id);
    setReplyingTo(null);
    setReplyText('');
  };

  // Filtering
  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFeedback = ordersWithFeedback.filter(o =>
    o.guestName.toLowerCase().includes(search.toLowerCase()) ||
    o.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
    (o.testimonial && o.testimonial.toLowerCase().includes(search.toLowerCase()))
  );

  const unreadCount = messages.filter(m => m.status === 'UNREAD').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-jost pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#292f36] tracking-tight flex items-center gap-2">
            <MessageSquare className="text-accent" size={26} />
            Unified Inbox
          </h1>
          <p className="text-xs text-[#4d5053] font-medium mt-1">
            Manage public inquiries and culinary feedback in one place.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-[12px] font-bold text-[#292f36] outline-none focus:ring-2 focus:ring-accent/10 transition-all w-64 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit">
        {userRole !== 'KITCHEN' && (
          <button
            onClick={() => setActiveTab('inquiries')}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all",
              activeTab === 'inquiries' 
                ? "bg-[#292f36] text-white shadow-md shadow-[#292f36]/20" 
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Mail size={14} />
            Direct Inquiries
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-md text-[9px] font-black leading-none ml-1">
                {unreadCount}
              </span>
            )}
          </button>
        )}
        <button
          onClick={() => setActiveTab('feedback')}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all",
            activeTab === 'feedback' 
              ? "bg-[#292f36] text-white shadow-md shadow-[#292f36]/20" 
              : "text-gray-500 hover:bg-gray-50"
          )}
        >
          <Star size={14} />
          Order Feedback
          <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md text-[9px] font-black leading-none ml-1">
            {ordersWithFeedback.length}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'inquiries' && (
          <motion.div
            key="inquiries"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
          >
            {filteredMessages.length === 0 ? (
              <div className="bg-white rounded-[28px] border border-gray-100 p-20 text-center shadow-sm">
                <MailOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-500 font-black text-sm uppercase tracking-widest mb-1">Inbox Empty</h3>
                <p className="text-xs text-gray-400 font-medium">No new inquiries at this time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                        "bg-white rounded-[24px] p-6 border transition-all duration-300",
                        msg.status === 'UNREAD' 
                            ? "border-accent/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" 
                            : "border-gray-100 shadow-sm opacity-70"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm",
                            msg.status === 'UNREAD' ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-500"
                        )}>
                            {msg.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <h3 className={cn(
                              "font-black text-sm",
                              msg.status === 'UNREAD' ? "text-[#292f36]" : "text-gray-500"
                          )}>
                              {msg.name}
                          </h3>
                          <p className="text-[10px] text-gray-400 font-bold tracking-wide">{msg.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                        {msg.status === 'UNREAD' && (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-md text-[9px] font-black uppercase tracking-widest">
                                New
                            </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-5">
                      <h4 className="font-bold text-sm text-[#292f36]">{msg.subject}</h4>
                      <p className="text-xs text-[#4d5053] font-medium leading-relaxed bg-[#fafafa] p-4 rounded-xl border border-gray-50">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <button 
                            className="text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                        <div className="flex gap-2">
                           {msg.status === 'UNREAD' && (
                               <button 
                                   onClick={() => handleMarkAsRead(msg.id, msg.status)}
                                   className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-1.5"
                               >
                                   <CheckCircle2 size={12} /> Mark Read
                               </button>
                           )}
                           <button 
                               onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                               className="px-4 py-1.5 bg-[#292f36] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md shadow-[#292f36]/20 hover:bg-black transition-all flex items-center gap-1.5"
                           >
                               <Reply size={12} /> Reply via Email
                           </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {replyingTo === msg.id && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={`Draft your email response to ${msg.name}...`}
                                        className="w-full h-24 p-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none font-medium text-[#292f36]"
                                    />
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => handleSendReply(msg.id)}
                                            className="px-5 py-2 bg-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            Send Email <Send size={12} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
          >
            {filteredFeedback.length === 0 ? (
              <div className="bg-white rounded-[28px] border border-gray-100 p-20 text-center shadow-sm">
                 <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-gray-500 font-black text-sm uppercase tracking-widest mb-1">No Feedback</h3>
                 <p className="text-xs text-gray-400 font-medium">There are no food order ratings to display yet.</p>
              </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFeedback.map(order => (
                    <div key={order.id} className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                         <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                            <div>
                                <h3 className="font-black text-[#292f36] text-sm flex items-center gap-1.5">
                                    <User size={14} className="text-gray-400" />
                                    {order.guestName}
                                </h3>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{order.roomNumber}</p>
                            </div>
                            <div className="flex bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={12} 
                                        className={cn(
                                            i < (order.rating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-300"
                                        )} 
                                    />
                                ))}
                            </div>
                         </div>
                         
                         <div className="mb-4">
                             <h4 className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Review</h4>
                             <p className="text-xs text-[#4d5053] italic font-medium leading-relaxed bg-[#fcfcfc] p-3 rounded-lg border-l-2 border-l-accent">
                                "{order.testimonial || 'No written testimonial provided.'}"
                             </p>
                         </div>

                         <div className="flex flex-wrap gap-1.5 mt-auto">
                            {order.items.map((item, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded-md text-[9px] font-black uppercase tracking-wider truncate max-w-full">
                                    {item.quantity}x {item.name}
                                </span>
                            ))}
                         </div>
                    </div>
                  ))}
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
