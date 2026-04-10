'use client';

import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield,
  Bed,
  Utensils,
  ShoppingCart,
  BookOpen,
} from 'lucide-react';
import { useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: string;
  onLogout: () => void;
}

export default function Sidebar({ currentPage, onNavigate, userRole, onLogout }: SidebarProps) {
  const { collapsed, setCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const allItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'SECURITY'] },
    { id: 'order-history', label: 'Order History', icon: ShoppingCart, roles: ['ADMIN'] },
    { id: 'analytics', label: 'Analytics', icon: FileText, roles: ['ADMIN'] },
  ];

  const menuItems = allItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        {mobileOpen ? <X className="w-6 h-6 text-[#292f36]" /> : <Menu className="w-6 h-6 text-[#292f36]" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[40] backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed lg:relative h-screen bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 ease-in-out z-50 group
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'lg:w-20' : 'lg:w-64'} w-64
        `}
      >
        {/* Collapse Toggle Button (Desktop Only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-9 z-50 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-50 transition-all duration-200"
        >
          {collapsed ? <ChevronRight className="w-4 h-4 text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-600" />}
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center min-h-[5.5rem]">
          {!collapsed ? (
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-2xl font-black tracking-tighter flex items-center gap-0.5">
                <span className="text-[#292f36]">UNICA</span>
                <span className="text-accent">-</span>
                <span className="text-[#292f36]">HOUSE</span>
              </h1>
              <p className="text-[10px] text-accent font-bold tracking-widest uppercase mt-0.5">Admin Portal</p>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center">
              <span className="text-[#292f36] font-black text-xl tracking-tighter">UH.</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => onNavigate(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
                  ${isActive
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-accent'
                    } ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <div className={`flex items-center ${collapsed ? '' : 'gap-4'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-current'} transition-colors duration-300 group-hover:scale-110`} />
                    {!collapsed && <span className="text-sm tracking-tight">{item.label}</span>}
                  </div>

                  {/* Active Indicator */}
                  {isActive && !collapsed && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-accent rounded-r-full transition-all duration-300 shadow-[0_0_12px_rgba(77,102,143,0.5)]" />
                  )}
                </button>

                {/* Tooltip when collapsed */}
                {collapsed && hoveredItem === item.id && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent border-r-gray-900" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* Logout */}
          <div className="relative">
            <button
              onClick={onLogout}
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-300 group
              ${collapsed ? 'justify-center' : 'justify-start'}`}
            >
              <LogOut className="w-5 h-5 transition-colors duration-300 group-hover:scale-110" />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>

            {collapsed && hoveredItem === 'logout' && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50">
                Logout
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent border-r-red-600" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
