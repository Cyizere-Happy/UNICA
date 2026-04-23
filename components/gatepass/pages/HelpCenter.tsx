'use client';

import React, { useState } from 'react';
import { 
  Rocket, 
  HelpCircle, 
  Phone, 
  Mail, 
  Search, 
  ThumbsUp, 
  ThumbsDown,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 p-6", className)}>
    {children}
  </div>
);

const FAQItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left group transition-all"
      >
        <span className={cn("text-[15px] font-semibold transition-colors", isOpen ? "text-accent" : "text-[#292f36] group-hover:text-accent")}>
          {question}
        </span>
        <div className={cn("p-1 rounded-lg transition-all", isOpen ? "bg-accent/10 text-accent rotate-180" : "bg-gray-50 text-gray-400 group-hover:bg-accent/5 group-hover:text-accent")}>
          <ChevronDown size={18} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-[14px] text-gray-500 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  const steps = [
    {
      title: "Step 1: Add Your First Dish",
      content: (
        <ul className="space-y-2 mt-2">
          <li className="flex gap-2">
            <span className="text-accent font-bold">1.</span>
            <span>Navigate to the <strong>"Menu Mgmt"</strong> section</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">2.</span>
            <span>Click on <strong>"Add New Dish"</strong></span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">3.</span>
            <span>Fill in Name, Price, Description, and Image</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">4.</span>
            <span>Click <strong>"Save"</strong> to go live</span>
          </li>
        </ul>
      )
    },
    {
      title: "Step 2: Manage Orders",
      content: (
        <ul className="space-y-2 mt-2">
          <li className="flex gap-2">
            <span className="text-accent font-bold">1.</span>
            <span>Go to <strong>"Kitchen Command"</strong></span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">2.</span>
            <span>View incoming orders in real-time</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">3.</span>
            <span>Click any order to see details</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">4.</span>
            <span>Update status: Pending → Preparing → Completed</span>
          </li>
        </ul>
      )
    },
    {
      title: "Step 3: Update Availability",
      content: (
        <p className="mt-2">
          If a dish is unavailable, go to <strong>"Menu Mgmt"</strong>, select the dish, and toggle <strong>"Available"</strong> OFF.
        </p>
      )
    },
    {
      title: "Step 4: View Dashboard",
      content: (
        <p className="mt-2">
          The dashboard provides an overview of performance: <strong>Total Orders</strong>, <strong>Revenue</strong>, and <strong>Active Dishes</strong>.
        </p>
      )
    }
  ];

  const faqs = [
    {
      question: "Why am I not seeing new orders?",
      answer: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Check your internet connection</li>
          <li>Refresh the page</li>
          <li>Ensure your account is active and has KITCHEN role</li>
        </ul>
      )
    },
    {
      question: "How do I edit a dish?",
      answer: "Go to \"Menu Mgmt\", select the dish you want to modify, edit the details in the form, and click \"Save Changes\"."
    },
    {
      question: "Why is my dish not visible to customers?",
      answer: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Ensure the dish is marked as \"Available\"</li>
          <li>Make sure all required fields are filled</li>
          <li>Confirm that a price has been set</li>
        </ul>
      )
    },
    {
      question: "How do I reset my password?",
      answer: "Go to \"Settings\" in the bottom menu, click \"Change Password\", and follow the prompts to update your credentials."
    },
    {
      question: "Why is my image not uploading?",
      answer: "Ensure the image is less than 5MB, use JPG or PNG format, and check your internet connection."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header & Search */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-[#292f36] tracking-tight">Help Center</h1>
          <p className="text-gray-500 font-medium">Welcome to the Chef Admin Dashboard Support. How can we help you today?</p>
        </div>

        <div className="relative max-w-xl mx-auto group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search for help topics (orders, menu, account...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all text-[15px]"
          />
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-xl shadow-xl border border-gray-50 z-50 text-left">
              <p className="text-[13px] text-gray-400">No results found for "{searchQuery}". Please try another keyword.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Start */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <Rocket size={20} />
          </div>
          <h2 className="text-2xl font-black text-[#292f36] tracking-tight">Quick Start</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step, idx) => (
            <Card key={idx} className="hover:border-accent/20 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-accent font-black text-sm group-hover:bg-accent group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-[#292f36]">{step.title}</h3>
                  <div className="text-[13px] text-gray-500">
                    {step.content}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 text-accent rounded-lg">
            <HelpCircle size={20} />
          </div>
          <h2 className="text-2xl font-black text-[#292f36] tracking-tight">Frequently Asked Questions</h2>
        </div>

        <Card className="divide-y divide-gray-50">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </Card>
      </section>

      {/* Contact Support */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#292f36] tracking-tight">Contact Support</h2>
            <p className="text-gray-500 text-[14px]">Need more help? Our support team is here for you.</p>
          </div>

          <div className="space-y-3">
            <a href="mailto:support@yourapp.com" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white hover:ring-1 hover:ring-accent/20 transition-all group">
              <div className="p-3 bg-white rounded-xl text-accent shadow-sm group-hover:bg-accent group-hover:text-white transition-colors">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Email Us</p>
                <p className="font-bold text-[#292f36]">support@yourapp.com</p>
              </div>
              <ChevronRight className="ml-auto text-gray-300" size={16} />
            </a>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 transition-all">
              <div className="p-3 bg-white rounded-xl text-accent shadow-sm">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Call Us</p>
                <p className="font-bold text-[#292f36]">+250 XXX XXX XXX</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#292f36]">Report an Issue</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Name</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-accent transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Email</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-accent transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Description</label>
              <textarea rows={3} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-accent transition-all resize-none" placeholder="What happened?"></textarea>
            </div>
            <button className="w-full py-3 bg-[#292f36] text-white rounded-xl font-bold text-[14px] hover:bg-black transition-all transform active:scale-[0.98] shadow-lg shadow-black/10">
              Submit Request
            </button>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="bg-accent/5 rounded-3xl p-8 text-center space-y-6 border border-accent/10">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-[#292f36] tracking-tight">Was this page helpful?</h2>
          <p className="text-gray-500 text-[14px]">Your feedback helps us improve the system.</p>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setFeedback('yes')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
              feedback === 'yes' ? "bg-accent text-white scale-105" : "bg-white text-gray-600 hover:bg-accent/10 hover:text-accent shadow-sm"
            )}
          >
            <ThumbsUp size={18} />
            <span>Yes</span>
          </button>
          <button 
            onClick={() => setFeedback('no')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
              feedback === 'no' ? "bg-red-500 text-white scale-105" : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 shadow-sm"
            )}
          >
            <ThumbsDown size={18} />
            <span>No</span>
          </button>
        </div>

        {feedback && (
          <p className="text-[13px] text-accent font-bold animate-in fade-in slide-in-from-bottom-2">
            Thank you for your feedback!
          </p>
        )}
      </section>
    </div>
  );
}
