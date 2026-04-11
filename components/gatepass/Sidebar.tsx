'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Search,
  Mail,
  Zap,
  BarChart3,
  Puzzle,
  HelpCircle,
  ShoppingCart,
  CheckSquare,
  Rocket,
  Utensils,
  Package,
  MessageSquare,
  ChefHat,
  Bed
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: string;
  onLogout: () => void;
}

export default function Sidebar({ currentPage, onNavigate, userRole, onLogout }: SidebarProps) {
  const { collapsed, setCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<{ label: string, badge?: number, top: number } | null>(null);

  const sections = [
    {
      title: 'Main Menu',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'kitchen-orders', label: 'Kitchen Command', icon: ChefHat },
        { id: 'room-bookings', label: 'Booking Requests', icon: Package },
        { id: 'room-management', label: 'Rooms & Pricing', icon: Bed },
        { id: 'order-history', label: 'Order History', icon: ShoppingCart },
        { id: 'menu-management', label: 'Menu Mgmt', icon: Utensils },
        { id: 'registered-parents', label: 'Guests', icon: Users },
        { id: 'messages', label: 'Message', icon: MessageSquare, badge: 33 },
      ]
    },
    {
      title: 'Tools',
      items: [
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'automation', label: 'Automation', icon: Zap },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'integration', label: 'Integration', icon: Puzzle },
      ]
    },
    {
      title: 'Workspace',
      items: [
        { id: 'campaign', label: 'Campaign', icon: CheckSquare, badge: 5, color: 'bg-blue-500' },
        { id: 'product-plan', label: 'Product Plan', icon: CheckSquare, badge: 4, color: 'bg-pink-500' },
      ]
    }
  ];

  const bottomItems = [
    { id: 'help', label: 'Help center', icon: HelpCircle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const NavItem = ({ item, collapsed }: { item: any, collapsed: boolean }) => {
    const Icon = item.icon;
    const isActive = currentPage === item.id;

    return (
      <button
        onClick={() => onNavigate(item.id)}
        onMouseEnter={(e) => {
          if (collapsed) {
            const rect = e.currentTarget.getBoundingClientRect();
            setHoveredItem({ label: item.label, badge: item.badge, top: rect.top });
          }
        }}
        onMouseLeave={() => setHoveredItem(null)}
        className={cn(
          "w-full flex items-center transition-all duration-200 group relative",
          collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5 rounded-xl",
          !collapsed && (isActive 
            ? "bg-white shadow-sm ring-1 ring-black/5 text-[#292f36] font-bold" 
            : "text-gray-500 hover:text-[#292f36] hover:bg-gray-50"),
          collapsed && isActive && "text-[#292f36]"
        )}
      >
        {collapsed && isActive && (
          <motion.div 
            layoutId="active-pill-collapsed"
            className="absolute w-12 h-12 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-sm ring-1 ring-black/5 rounded-xl z-0" 
          />
        )}
        
        <div className={cn(
          "flex items-center justify-center w-6 h-6 z-10 transition-transform duration-200",
          isActive ? "text-[#292f36]" : "text-gray-400 group-hover:text-[#292f36]",
          collapsed && "group-hover:scale-110"
        )}>
          {item.color ? (
            <div className={cn("w-2 h-2 rounded-full", item.color)} />
          ) : (
            <Icon size={collapsed ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} />
          )}
        </div>
        
        {!collapsed && (
          <div className="flex-1 flex items-center justify-between text-left shrink-0">
            <span className="text-[13px] tracking-tight whitespace-nowrap">{item.label}</span>
            {item.badge && (
              <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </div>
        )}

        {collapsed && item.badge && !isActive && (
          <div className="absolute top-2 right-4 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#fcfcfc] z-20" />
        )}
      </button>
    );
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white border border-gray-200 rounded-lg"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/5 z-[40] backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <div className={cn(
        "fixed lg:relative h-screen bg-[#fcfcfc] border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out z-50",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        collapsed ? "w-20" : "w-64"
      )}>
        {/* Brand Header */}
        <div className="px-4 py-6">
          <div className={cn(
            "transition-all duration-300 flex items-center",
            collapsed ? "justify-center" : "justify-between bg-white border border-gray-100 rounded-2xl p-3 shadow-sm"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "bg-[#292f36] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-black/10",
                collapsed ? "w-12 h-12" : "w-10 h-10"
              )}>
                <span className={cn(
                  "text-white font-black italic opacity-90 leading-none",
                  collapsed ? "text-2xl" : "text-xl"
                )}>u.</span>
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-[13px] font-black text-[#292f36] leading-none mb-1">Unica House Inc.</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Premium Plan</span>
                </div>
              )}
            </div>
            {!collapsed && (
              <button 
                onClick={() => setCollapsed(true)} 
                className="text-gray-300 hover:text-[#292f36] transition-colors p-1"
              >
                <ChevronLeft size={16} strokeWidth={3} />
              </button>
            )}
          </div>
          {collapsed && (
            <button 
              onClick={() => setCollapsed(false)}
              className="mt-4 w-full flex justify-center text-gray-300 hover:text-[#292f36] transition-colors"
            >
              <ChevronRight size={18} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="px-4 mb-4">
          <div className={cn(
            "relative group transition-all duration-300",
            collapsed ? "flex justify-center" : ""
          )}>
            <Search className={cn(
              "text-gray-400 group-focus-within:text-[#292f36] transition-colors",
              collapsed ? "w-5 h-5" : "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            )} />
            {!collapsed && (
              <>
                <input 
                  type="text" 
                  placeholder="Search"
                  className="w-full bg-transparent border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-xs font-medium outline-none focus:bg-white focus:border-gray-200 transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
                  <span className="text-[9px] font-black text-gray-300 border border-gray-100 px-1 rounded-sm bg-gray-50">⌘</span>
                  <span className="text-[9px] font-black text-gray-300 border border-gray-100 px-1 rounded-sm bg-gray-50">K</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation Content */}
        <div className={cn(
          "flex-1 scrollbar-custom overflow-x-hidden px-4 space-y-8 scrollbar-hide py-2",
          collapsed && "space-y-6"
        )}>
          {sections.map((section) => (
            <div key={section.title} className={cn(collapsed ? "space-y-4" : "space-y-1")}>
              {!collapsed && (
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-3">
                  {section.title}
                </h3>
              )}
              <div className={cn("flex flex-col", collapsed ? "gap-4" : "gap-1")}>
                {section.items.map((item) => (
                  <NavItem key={item.id} item={item} collapsed={collapsed} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Menu */}
        <div className="p-4 pt-2">
          <div className="space-y-1">
            {bottomItems.map((item) => (
              <NavItem key={item.id} item={item} collapsed={collapsed} />
            ))}
            <button
               onClick={onLogout}
               className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <LogOut size={18} />
              {!collapsed && <span className="text-[13px] font-bold tracking-tight">Sign out</span>}
            </button>
          </div>
        </div>

        {/* Global Tooltip Portal (Floating) */}
        <AnimatePresence>
          {collapsed && hoveredItem && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="fixed z-[9999] pointer-events-none flex items-center"
              style={{
                top: hoveredItem.top + 8, // Center vertically with the button
                left: 70,
              }}
            >
              <div className="px-3 py-2 bg-[#292f36] text-white text-[11px] font-bold rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 whitespace-nowrap">
                {hoveredItem.label}
                {hoveredItem.badge && (
                  <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-md">
                    {hoveredItem.badge}
                  </span>
                )}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#292f36] rotate-45 border-l border-b border-white/10" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
