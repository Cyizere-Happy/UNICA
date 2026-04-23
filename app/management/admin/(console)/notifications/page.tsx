'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/lib/gatepass/apiService';
import { 
  Bell, AlertCircle, Utensils, Package, ClipboardList, 
  Clock, CheckCircle2, ChefHat, Sparkles, X, Plus, Trash,
  ChevronRight, Save, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [userRole, setUserRole] = useState<string>('ADMIN');
  const [stats, setStats] = useState<any>(null);
  const [pendingTasks, setPendingTasks] = useState<any>({ orders: [], services: [] });
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [usageItems, setUsageItems] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [stockOptions, setStockOptions] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const user = await apiService.getProfile();
      setUserRole(user.role);
      const currentRole = user.role;

      const promises: Promise<any>[] = [];
      const keys: string[] = [];

      if (['ADMIN', 'KITCHEN'].includes(currentRole)) {
        promises.push(apiService.getStockStats().catch(() => null));
        keys.push('stats');
        promises.push(apiService.getPendingStockTasks().catch(() => ({ orders: [], services: [] })));
        keys.push('tasks');
        promises.push(apiService.getOrders().catch(() => []));
        keys.push('orders');
      }

      if (['ADMIN', 'RECEPTION'].includes(currentRole)) {
        promises.push(apiService.getCleaningRequests().catch(() => []));
        keys.push('services');
      }

      const results = await Promise.all(promises);
      const dataMap: any = {};
      keys.forEach((key, i) => { dataMap[key] = results[i]; });

      if (dataMap.stats) setStats(dataMap.stats);
      if (dataMap.tasks) setPendingTasks(dataMap.tasks);
      if (dataMap.orders) setOrders(dataMap.orders.filter((order: any) => order.status === 'PENDING'));
      if (dataMap.services) setServices(dataMap.services.filter((s: any) => s.status === 'PENDING'));

    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenDeductModal = async (type: 'ORDER' | 'SERVICE', id: string, title: string) => {
    try {
      setLoading(true);
      const options = type === 'ORDER' 
        ? await apiService.getFoodStock() 
        : await apiService.getGeneralAssets();
      
      setStockOptions(options.filter((i: any) => i.isActive));
      setSelectedTask({ type, id, title });
      setUsageItems([{ stockId: '', quantity: 1 }]);
    } catch (err) {
      toast.error('Failed to load stock items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setUsageItems([...usageItems, { stockId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setUsageItems(usageItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const newItems = [...usageItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setUsageItems(newItems);
  };

  const handleSubmitUsage = async () => {
    if (usageItems.some(i => !i.stockId)) {
      toast.error('Please select items');
      return;
    }
    
    setSubmitting(true);
    try {
      await apiService.recordStockUsage({
        type: selectedTask.type,
        id: selectedTask.id,
        items: usageItems
      });
      toast.success('Stock updated successfully');
      setSelectedTask(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to update stock');
    } finally {
      setSubmitting(false);
    }
  };

  const allNotifications = [
    ...(stats?.lowStockFoodCount > 0 && ['ADMIN', 'KITCHEN'].includes(userRole) ? [{
      id: 'low-food',
      type: 'LOW_STOCK',
      title: 'Kitchen Inventory Alert',
      message: `${stats.lowStockFoodCount} food items are below reorder level.`,
      severity: 'high',
      icon: Utensils,
      link: '/management/admin/food-stock'
    }] : []),
    ...(stats?.lowStockAssetsCount > 0 && ['ADMIN', 'RECEPTION'].includes(userRole) ? [{
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
      time: o.orderTime,
      role: ['ADMIN', 'KITCHEN', 'RECEPTION']
    })).filter(n => n.role.includes(userRole)),
    ...services.map((s: any) => ({
      id: `incoming-service-${s.id}`,
      type: 'INCOMING_SERVICE',
      title: 'Incoming Service Request',
      message: `Room ${s.room?.name || 'Unknown'} requested ${s.type}.`,
      severity: 'high',
      icon: Sparkles,
      link: '/management/admin/service-requests',
      time: s.createdAt,
      role: ['ADMIN', 'RECEPTION']
    })).filter(n => n.role.includes(userRole)),
    ...pendingTasks.orders.map((o: any) => ({
      id: `task-order-${o.id}`,
      type: 'TASK',
      title: 'Pending Stock Deduction (Kitchen)',
      message: `${o.title} - ${o.subtitle}. Update stock usage for delivered order.`,
      severity: 'medium',
      icon: ClipboardList,
      link: 'modal',
      action: () => handleOpenDeductModal('ORDER', o.id, o.title),
      time: o.createdAt,
      role: ['ADMIN', 'KITCHEN', 'RECEPTION']
    })).filter(n => n.role.includes(userRole)),
    ...pendingTasks.services.map((s: any) => ({
      id: `task-service-${s.id}`,
      type: 'TASK',
      title: 'Pending Stock Deduction (Services)',
      message: `${s.title} - ${s.subtitle}. Record material usage for completed service.`,
      severity: 'medium',
      icon: ClipboardList,
      link: 'modal',
      action: () => handleOpenDeductModal('SERVICE', s.id, s.title),
      time: s.createdAt,
      role: ['ADMIN', 'RECEPTION']
    })).filter(n => n.role.includes(userRole))
  ];

  if (loading && !stats && !selectedTask) {
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
                    {n.link === 'modal' ? (
                      <button 
                        onClick={n.action}
                        className="px-4 py-1.5 bg-[#292f36] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-accent transition-all"
                      >
                        Record Usage
                      </button>
                    ) : (
                      <a 
                        href={n.link}
                        className="px-4 py-1.5 bg-[#292f36] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-accent transition-all"
                      >
                        Take Action
                      </a>
                    )}
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

      {/* Usage Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Deduction</p>
                  <h3 className="text-xl font-black text-[#292f36] leading-tight">{selectedTask.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="p-2 text-gray-300 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-xl"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6">
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Instructions</p>
                  <p className="text-xs text-blue-800 font-medium">Please select the items and quantities used for this fulfillment. This will automatically deduct from the main inventory.</p>
                </div>

                <div className="space-y-4">
                  {usageItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-end group animate-in slide-in-from-top-1 duration-300">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Item</label>
                        <select
                          value={item.stockId}
                          onChange={(e) => handleUpdateItem(idx, 'stockId', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-accent/30 focus:bg-white rounded-xl font-bold text-[#292f36] text-xs outline-none transition-all appearance-none"
                        >
                          <option value="">Choose item...</option>
                          {stockOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name} ({opt.quantity} {opt.unit} left)</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24 space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-accent/30 focus:bg-white rounded-xl font-bold text-[#292f36] text-xs outline-none transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(idx)}
                        className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleAddItem}
                  className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-accent/30 hover:text-accent transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Another Item
                </button>
              </div>

              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 py-4 px-6 border border-gray-200 text-gray-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitUsage}
                  disabled={submitting}
                  className="flex-[2] py-4 px-6 bg-[#292f36] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale disabled:scale-100"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Commit Stock Deduction
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
