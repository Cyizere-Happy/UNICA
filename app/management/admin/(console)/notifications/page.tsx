'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/lib/gatepass/apiService';
import { Bell, AlertCircle, Utensils, Package, ClipboardList, Clock, CheckCircle2, ChefHat, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPage() {
  const [stats, setStats] = useState<any>(null);
  const [pendingTasks, setPendingTasks] = useState<any>({ orders: [], services: [] });
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [s, t, o, sv] = await Promise.all([
        apiService.getStockStats(),
        apiService.getPendingStockTasks(),
        apiService.getOrders(),
        apiService.getCleaningRequests()
      ]);
      setStats(s);
      setPendingTasks(t);
      setOrders(o.filter((order: any) => order.status === 'PENDING'));
      setServices(sv.filter((s: any) => s.status === 'PENDING'));
    } catch (err) {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const allNotifications = [
    ...(stats?.lowStockFoodCount > 0 ? [{
      id: 'low-food',
      type: 'LOW_STOCK',
      title: 'Kitchen Inventory Alert',
      message: `${stats.lowStockFoodCount} food items are below reorder level.`,
      severity: 'high',
      icon: Utensils,
      link: '/management/admin/food-stock'
    }] : []),
    ...(stats?.lowStockAssetsCount > 0 ? [{
      id: 'low-assets',
      type: 'LOW_STOCK',
      title: 'Asset Inventory Alert',
      message: `${stats.lowStockAssetsCount} maintenance items are below reorder level.`,
      severity: 'high',
      icon: Package,
      link: '/management/admin/assets-management'
    }] : []),
    ...orders.map((o: any) => ({
      id: `incoming-order-${o.id}`,
      type: 'INCOMING_ORDER',
      title: 'Incoming Kitchen Order',
      message: `Room ${o.roomNumber} ordered ${o.items.length} items. Total: ${Number(o.totalAmount).toLocaleString()} RWF`,
      severity: 'high',
      icon: ChefHat,
      link: '/management/admin/kitchen-commands',
      time: o.orderTime
    })),
    ...services.map((s: any) => ({
      id: `incoming-service-${s.id}`,
      type: 'INCOMING_SERVICE',
      title: 'Incoming Service Request',
      message: `Room ${s.room?.name || 'Unknown'} requested ${s.type}.`,
      severity: 'high',
      icon: Sparkles,
      link: '/management/admin/services',
      time: s.createdAt
    })),
    ...pendingTasks.orders.map((o: any) => ({
      id: `task-order-${o.id}`,
      type: 'TASK',
      title: 'Pending Stock Deduction (Kitchen)',
      message: `${o.title} - ${o.subtitle}. Update stock usage for delivered order.`,
      severity: 'medium',
      icon: ClipboardList,
      link: '/management/admin/food-stock',
      time: o.createdAt
    })),
    ...pendingTasks.services.map((s: any) => ({
      id: `task-service-${s.id}`,
      type: 'TASK',
      title: 'Pending Stock Deduction (Services)',
      message: `${s.title} - ${s.subtitle}. Record material usage for completed service.`,
      severity: 'medium',
      icon: ClipboardList,
      link: '/management/admin/assets-management',
      time: s.createdAt
    }))
  ];

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Synchronizing Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-black text-[#292f36] tracking-tight flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-xl text-accent">
            <Bell size={28} />
          </div>
          Notifications
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Real-time operational alerts and inventory tasks.
        </p>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {allNotifications.length > 0 ? (
            allNotifications.map((n) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={n.id}
                className={cn(
                  "p-5 rounded-[24px] border-2 transition-all flex items-start gap-5",
                  n.severity === 'high' ? "bg-rose-50/30 border-rose-100/50" : "bg-white border-gray-50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  n.severity === 'high' ? "bg-rose-100 text-rose-600" : "bg-accent/10 text-accent"
                )}>
                  <n.icon size={24} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-black text-[#292f36]">{n.title}</h4>
                    {n.time && (
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase tracking-widest">
                        <Clock size={10} />
                        {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{n.message}</p>
                  
                  <div className="mt-4 flex gap-3">
                    <a 
                      href={n.link}
                      className="px-4 py-1.5 bg-[#292f36] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-accent transition-all"
                    >
                      Take Action
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4 shadow-sm">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-black text-[#292f36]">You're all caught up!</h3>
              <p className="text-sm text-gray-400 font-medium">No urgent tasks or low stock alerts at the moment.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
