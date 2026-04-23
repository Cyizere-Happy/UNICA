'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Package, Utensils, AlertCircle, 
  Search, Filter, ArrowUpRight, ArrowDownRight,
  ChevronRight, Calendar, Save, X, Camera,
  Info, History, Trash2, LayoutGrid, List, ClipboardList
} from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { resolveImageUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function FoodManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [pendingTasks, setPendingTasks] = useState<{ orders: any[], services: any[] }>({ orders: [], services: [] });
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [usedItems, setUsedItems] = useState<{ id: string, type: 'food' | 'asset', quantity: number, name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalFoodItems: 0, lowStockCount: 0, expiringSoonCount: 0, totalSpentThisMonth: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Vegetables', 'Meat', 'Dairy', 'Grains', 'Spices', 'Beverages', 'Others'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stockData, assetsData, statsData, tasksData] = await Promise.all([
        apiService.getFoodStock(),
        apiService.getGeneralAssets(),
        apiService.getStockStats(),
        apiService.getPendingStockTasks()
      ]);
      setItems(stockData || []);
      setAssets(assetsData || []);
      setStats(statsData || { totalFoodItems: 0, lowStockFoodCount: 0, expiringSoonCount: 0, totalSpentFood: 0 });
      setPendingTasks(tasksData || { orders: [], services: [] });
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await apiService.updateFoodStock(editingItem.id, editingItem);
        toast.success('Item updated successfully');
      } else {
        await apiService.createFoodStock(editingItem);
        toast.success('Item created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save item');
    }
  };

  const handleEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const quantity = Number(formData.get('quantity'));
    const unitPrice = Number(formData.get('unitPrice'));
    const reason = formData.get('reason') as string;

    try {
      await apiService.recordFoodEntry(selectedItem.id, { quantity, unitPrice, reason });
      toast.success('Stock entry and purchase recorded');
      setIsEntryModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to record entry');
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Archive this item? It will be removed from current view but kept for reports.')) return;
    try {
      await apiService.toggleFoodActive(id, false);
      toast.success('Item archived');
      fetchData();
    } catch (err) {
      toast.error('Failed to archive item');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const { url } = await apiService.uploadImage(file, 'food');
      setEditingItem({ ...editingItem, imageUrl: url });
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecordUsage = async () => {
    if (!selectedTask || usedItems.length === 0) return;
    try {
      await apiService.recordStockUsage({
        type: selectedTask.type,
        id: selectedTask.id,
        items: usedItems.map(i => ({
          foodStockId: i.type === 'food' ? i.id : undefined,
          generalAssetId: i.type === 'asset' ? i.id : undefined,
          quantity: i.quantity
        }))
      });
      toast.success('Stock usage recorded');
      setSelectedTask(null);
      setUsedItems([]);
      fetchData();
    } catch (err) {
      toast.error('Failed to record usage');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 font-jost pb-20 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#292f36] tracking-tight flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl text-accent">
              <Utensils size={28} />
            </div>
            Kitchen Inventory
          </h1>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Manage food supplies and consumables for the UNICA kitchen.
          </p>
        </div>
        <div className="flex gap-3">
          {pendingTasks.orders.length > 0 && (
            <button
              onClick={() => setIsTasksModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm relative group"
            >
              <ClipboardList className="w-4 h-4" strokeWidth={3} />
              Kitchen Tasks
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg group-hover:scale-110 transition-transform">
                {pendingTasks.orders.length}
              </span>
            </button>
          )}
          <button
            onClick={() => {
              setEditingItem({ name: '', category: 'Others', quantity: 0, unit: 'kg', reorderLevel: 5, expiryDate: null, unitPrice: 0 });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#292f36] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-accent transition-all shadow-xl group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" strokeWidth={3} />
            Add New Item
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'TOTAL ITEMS', value: stats.totalFoodItems, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'LOW STOCK', value: stats.lowStockFoodCount, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
          { label: 'EXPIRING SOON', value: stats.expiringSoonCount, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'SPENT ON FOOD', value: `${(stats as any).totalSpentFood?.toLocaleString()} RWF`, icon: History, color: 'text-accent', bg: 'bg-accent/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn("p-4 rounded-2xl", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className={cn(
                "font-black text-[#292f36]",
                (stat.value?.toString() || "").length > 10 ? "text-sm" :
                (stat.value?.toString() || "").length > 8 ? "text-lg" : "text-2xl"
              )}>{stat.value ?? '0'}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-accent/20 outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                categoryFilter === cat ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="h-8 w-[1px] bg-gray-100 hidden md:block" />
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-white text-accent shadow-sm" : "text-gray-400")}
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-2.5 rounded-xl transition-all", viewMode === 'list' ? "bg-white text-accent shadow-sm" : "text-gray-400")}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                className="group bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all p-4 relative overflow-hidden"
              >
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gray-50 mb-4">
                  <img 
                    src={resolveImageUrl(item.imageUrl) || '/Images/placeholder-food.jpg'} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-accent shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-[#292f36] text-lg leading-tight">{item.name}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Level</p>
                      <div className="flex items-center gap-2">
                        <h4 className={cn(
                          "text-2xl font-black",
                          Number(item.quantity) <= Number(item.reorderLevel) ? "text-rose-600" : "text-[#292f36]"
                        )}>
                          {Number(item.quantity)}
                        </h4>
                        <span className="text-xs text-gray-400 font-bold">{item.unit}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsEntryModalOpen(true);
                      }}
                      className="w-8 h-8 rounded-lg bg-accent/5 text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-sm"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                    <button
                      onClick={() => handleArchive(item.id)}
                      className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                  </div>

                  {Number(item.quantity) <= Number(item.reorderLevel) && (
                    <div className="flex items-center gap-2 p-2 bg-rose-50 rounded-xl text-rose-600 text-[10px] font-bold uppercase">
                      <AlertCircle size={14} />
                      Low Stock: Reorder at {item.reorderLevel} {item.unit}
                    </div>
                  )}

                  {item.expiryDate && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl text-accent text-[10px] font-bold uppercase">
                      <Calendar size={14} />
                      Expires: {new Date(item.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Reorder</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                        <img src={resolveImageUrl(item.imageUrl)} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-black text-[#292f36]">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-black text-lg",
                        Number(item.quantity) <= Number(item.reorderLevel) ? "text-rose-600" : "text-[#292f36]"
                      )}>
                        {Number(item.quantity)}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-500 text-sm">{item.reorderLevel} {item.unit}</td>
                  <td className="px-6 py-4">
                    {item.expiryDate ? (
                      <span className="text-[11px] font-bold text-accent">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-300">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                       onClick={() => {
                        setSelectedItem(item);
                        setIsEntryModalOpen(true);
                      }}
                      className="p-2 text-accent hover:bg-accent/5 rounded-lg transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Entry Modal */}
      <AnimatePresence>
        {isEntryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEntryModalOpen(false)}
              className="absolute inset-0 bg-[#292f36]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden relative z-10"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                      <ArrowUpRight size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory Action</p>
                      <h3 className="text-xl font-black text-[#292f36]">Record Stock Entry</h3>
                    </div>
                  </div>
                  <button onClick={() => setIsEntryModalOpen(false)} className="p-2 text-gray-400 hover:text-[#292f36]">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleEntry} className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-[24px] border border-gray-100 flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shadow-sm">
                      <img src={resolveImageUrl(selectedItem?.imageUrl)} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#292f36]">{selectedItem?.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Current: {Number(selectedItem?.quantity)} {selectedItem?.unit}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity to Add ({selectedItem?.unit})</label>
                      <input 
                        name="quantity"
                        type="number" 
                        required
                        step="0.01"
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit Price (RWF)</label>
                      <input 
                        name="unitPrice"
                        type="number" 
                        step="0.01"
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reason / Notes</label>
                    <textarea 
                      name="reason"
                      rows={2}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none resize-none"
                      placeholder="e.g. Purchased from market..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#292f36] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-accent/10 active:scale-95"
                  >
                    Confirm & Record Purchase
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#292f36]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden relative z-10"
            >
              <div className="p-6">
                 <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                      <Plus size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Asset</p>
                      <h3 className="text-xl font-black text-[#292f36]">Add Food Inventory</h3>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-[#292f36]">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Name</label>
                      <input 
                        type="text" 
                        required
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                        placeholder="e.g. Fresh Tomatoes"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                      <select 
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      >
                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Initial Quantity</label>
                      <input 
                        type="number" 
                        required
                        value={editingItem.quantity}
                        onChange={(e) => setEditingItem({...editingItem, quantity: Number(e.target.value)})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                      <select 
                        value={editingItem.unit}
                        onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      >
                        <option value="kg">Kilograms (kg)</option>
                        <option value="liters">Liters (L)</option>
                        <option value="pcs">Pieces (pcs)</option>
                        <option value="sets">Sets</option>
                        <option value="boxes">Boxes</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reorder Level</label>
                      <input 
                        type="number" 
                        required
                        value={editingItem.reorderLevel}
                        onChange={(e) => setEditingItem({...editingItem, reorderLevel: Number(e.target.value)})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Purchase Unit Price (RWF)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={editingItem.unitPrice || ''}
                        onChange={(e) => setEditingItem({...editingItem, unitPrice: Number(e.target.value)})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date (Optional)</label>
                      <input 
                        type="date" 
                        value={editingItem.expiryDate ? editingItem.expiryDate.split('T')[0] : ''}
                        onChange={(e) => setEditingItem({...editingItem, expiryDate: e.target.value ? new Date(e.target.value).toISOString() : null})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Optional Image</label>
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                          className="w-full px-6 py-3.5 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] text-xs transition-all outline-none file:hidden cursor-pointer"
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <Camera size={18} className="text-gray-400" />
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        {isUploading ? (
                          <div className="w-full h-full flex items-center justify-center bg-accent/5">
                            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : (
                          <img src={resolveImageUrl(editingItem.imageUrl)} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#292f36] text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl active:scale-95"
                  >
                    Deploy to Inventory
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Stock Tasks Modal */}
      <AnimatePresence>
        {isTasksModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsTasksModalOpen(false);
                setSelectedTask(null);
                setUsedItems([]);
              }}
              className="absolute inset-0 bg-[#292f36]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#292f36]">Kitchen Usage Tasks</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deduct stock for delivered orders</p>
                  </div>
                </div>
                <button onClick={() => setIsTasksModalOpen(false)} className="p-2 text-gray-400 hover:text-[#292f36]">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex">
                {/* Left Sidebar: Task List */}
                <div className="w-1/3 border-r border-gray-100 overflow-y-auto p-4 space-y-3">
                  {pendingTasks.orders.map((task) => (
                    <button
                      key={`${task.type}-${task.id}`}
                      onClick={() => {
                        setSelectedTask(task);
                        setUsedItems([]);
                      }}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border-2 transition-all",
                        selectedTask?.id === task.id 
                          ? "border-accent bg-accent/5 shadow-sm" 
                          : "border-transparent hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-accent uppercase tracking-widest">{task.type}</span>
                        <span className="text-[9px] text-gray-400">{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-[#292f36] truncate">{task.title}</h4>
                      <p className="text-[11px] text-gray-500 truncate">{task.subtitle}</p>
                    </button>
                  ))}
                </div>

                {/* Right Area: Deduction Form */}
                <div className="flex-1 overflow-y-auto p-8">
                  {selectedTask ? (
                    <div className="space-y-8">
                      <div>
                        <h4 className="font-black text-[#292f36] text-lg mb-2">{selectedTask.title} Usage</h4>
                        <p className="text-sm text-gray-500">{selectedTask.subtitle}</p>
                        {selectedTask.items && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-xl text-[11px] font-bold text-gray-600">
                            Ordered: {selectedTask.items}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Items Used (Food & Assets)</label>
                        <div className="grid grid-cols-2 gap-2">
                          {items.map(item => (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (usedItems.find(i => i.id === item.id)) {
                                  setUsedItems(usedItems.filter(i => i.id !== item.id));
                                } else {
                                  setUsedItems([...usedItems, { id: item.id, type: 'food', quantity: 1, name: item.name }]);
                                }
                              }}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                                usedItems.find(i => i.id === item.id)
                                  ? "border-accent bg-accent/5"
                                  : "border-gray-50 hover:bg-gray-50"
                              )}
                            >
                              <div className="w-8 h-8 rounded-lg bg-white overflow-hidden shrink-0 shadow-sm border border-gray-100">
                                <img src={resolveImageUrl(item.imageUrl)} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xs font-bold text-[#292f36] truncate">{item.name}</span>
                            </button>
                          ))}
                          {assets.map(asset => (
                            <button
                              key={asset.id}
                              onClick={() => {
                                if (usedItems.find(i => i.id === asset.id)) {
                                  setUsedItems(usedItems.filter(i => i.id !== asset.id));
                                } else {
                                  setUsedItems([...usedItems, { id: asset.id, type: 'asset', quantity: 1, name: asset.name }]);
                                }
                              }}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                                usedItems.find(i => i.id === asset.id)
                                  ? "border-accent bg-accent/5"
                                  : "border-gray-50 hover:bg-gray-50"
                              )}
                            >
                              <div className="w-8 h-8 rounded-lg bg-white overflow-hidden shrink-0 shadow-sm border border-gray-100">
                                <img src={resolveImageUrl(asset.imageUrl)} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xs font-bold text-[#292f36] truncate">{asset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {usedItems.length > 0 && (
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specify Quantities</label>
                          <div className="space-y-3">
                            {usedItems.map(used => {
                              const source = used.type === 'food' ? items : assets;
                              const unit = source.find(i => i.id === used.id)?.unit;
                              return (
                                <div key={used.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                  <span className="font-bold text-[#292f36] text-sm">{used.name}</span>
                                  <div className="flex items-center gap-3">
                                    <input 
                                      type="number"
                                      value={used.quantity}
                                      onChange={(e) => setUsedItems(usedItems.map(i => i.id === used.id ? {...i, quantity: Number(e.target.value)} : i))}
                                      className="w-20 px-3 py-2 bg-white rounded-lg border border-gray-200 text-center font-bold text-accent"
                                      step="0.1"
                                    />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                      {unit}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          <button 
                            onClick={handleRecordUsage}
                            className="w-full py-4 bg-[#292f36] text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl active:scale-95"
                          >
                            Deduct Stock & Close Task
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                      <ClipboardList size={64} className="mb-4" />
                      <p className="font-black uppercase tracking-widest text-xs">Select a task from the list</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
