'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Package, Shield, AlertCircle, 
  Search, Filter, ArrowUpRight, ArrowDownRight,
  ChevronRight, Calendar, Save, X, Camera,
  Info, History, Trash2, LayoutGrid, List, Sparkles, ClipboardList
} from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { resolveImageUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AssetManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [pendingTasks, setPendingTasks] = useState<{ orders: any[], services: any[] }>({ orders: [], services: [] });
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [usedItems, setUsedItems] = useState<{ id: string, type: 'food' | 'asset', quantity: number, name: string }[]>([]);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalSpentThisMonth: 0, lowStockCount: 0, totalAssetItems: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Cleaning', 'Linens', 'Toiletries', 'Furniture', 'Electronics', 'Others'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [foodData, assetData, statsData, tasksData] = await Promise.all([
        apiService.getFoodStock(),
        apiService.getGeneralAssets(),
        apiService.getStockStats(),
        apiService.getPendingStockTasks()
      ]);
      setItems(assetData || []);
      setStats(statsData || { totalAssetItems: 0, lowStockAssetsCount: 0, totalSpentAssets: 0 });
      setPendingTasks(tasksData || { orders: [], services: [] });
    } catch (err) {
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createGeneralAsset(editingItem);
      toast.success('Asset created successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save asset');
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Archive this asset? It will be removed from current view but kept for reports.')) return;
    try {
      await apiService.toggleAssetActive(id, false);
      toast.success('Asset archived');
      fetchData();
    } catch (err) {
      toast.error('Failed to archive asset');
    }
  };

  const handleEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const quantity = Number(formData.get('quantity'));
    const unitPrice = Number(formData.get('unitPrice'));
    const reason = formData.get('reason') as string;

    try {
      await apiService.recordAssetEntry(selectedItem.id, { quantity, unitPrice, reason });
      toast.success('Stock entry and purchase recorded');
      setIsEntryModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to record entry');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const { url } = await apiService.uploadImage(file, 'rooms'); // Using 'rooms' folder for assets
      setEditingItem({ ...editingItem, imageUrl: url });
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
      toast.success('Cleaning supplies recorded');
      setSelectedTask(null);
      setUsedItems([]);
      fetchData();
    } catch (err) {
      toast.error('Failed to record usage');
    }
  };
  return (
    <div className="max-w-[1600px] mx-auto space-y-8 font-jost pb-20 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#292f36] tracking-tight flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl text-accent">
              <Sparkles size={28} />
            </div>
            Property Assets
          </h1>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Track general property assets, cleaning supplies, and reusable items.
          </p>
        </div>
        <div className="flex gap-3">
          {pendingTasks.services.length > 0 && (
            <button
              onClick={() => setIsTasksModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm relative group"
            >
              <ClipboardList className="w-4 h-4" strokeWidth={3} />
              Cleaning Tasks
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg group-hover:scale-110 transition-transform">
                {pendingTasks.services.length}
              </span>
            </button>
          )}
          <button
            onClick={() => {
              setEditingItem({ name: '', category: 'Others', quantity: 0, unit: 'pcs', condition: 'New', reorderLevel: 10, unitPrice: 0 });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#292f36] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-accent transition-all shadow-xl group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" strokeWidth={3} />
            Register Asset
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'TOTAL ASSETS', value: stats.totalAssetItems, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'LOW STOCK', value: stats.lowStockAssetsCount, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
          { label: 'PENDING TASKS', value: pendingTasks.services.length, icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'SPENT ON ASSETS', value: `${(stats as any).totalSpentAssets?.toLocaleString()} RWF`, icon: History, color: 'text-accent', bg: 'bg-accent/10' },
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

      {/* Grid */}
      <div className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-accent/20 outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                categoryFilter === cat ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
        </div>
      ) : (
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
                    src={resolveImageUrl(item.imageUrl) || '/Images/placeholder-asset.jpg'} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-accent shadow-sm">
                      {item.condition}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-black text-[#292f36] text-lg leading-tight">{item.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
                  </div>

                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">In Inventory</p>
                      <h4 className="text-2xl font-black text-[#292f36]">{item.quantity} <span className="text-xs text-gray-400 font-bold uppercase">{item.unit}</span></h4>
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
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals similar to FoodManagement but with Accent theme */}
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
                      <h3 className="text-xl font-black text-[#292f36]">Record Asset Entry</h3>
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
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Available: {selectedItem?.quantity} {selectedItem?.unit}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity Added</label>
                      <input 
                        name="quantity"
                        type="number" 
                        required
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit Price (RWF)</label>
                      <input 
                        name="unitPrice"
                        type="number" 
                        step="0.01"
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      />
                    </div>
                  </div>
                   <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes</label>
                    <textarea 
                      name="reason"
                      rows={2}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#292f36] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl active:scale-95">
                    Confirm Entry & Record Cost
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Property</p>
                      <h3 className="text-xl font-black text-[#292f36]">Register Property Asset</h3>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-[#292f36]">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Name</label>
                      <input 
                        type="text" 
                        required
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity</label>
                      <input 
                        type="number" 
                        required
                        value={editingItem?.quantity || 0}
                        onChange={(e) => setEditingItem({...editingItem, quantity: Number(e.target.value)})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                      <input 
                        type="text" 
                        value={editingItem?.unit || ''}
                        onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reorder Level</label>
                      <input 
                        type="number" 
                        required
                        value={editingItem?.reorderLevel || 10}
                        onChange={(e) => setEditingItem({...editingItem, reorderLevel: Number(e.target.value)})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Purchase Unit Price (RWF)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={editingItem?.unitPrice || ''}
                        onChange={(e) => setEditingItem({...editingItem, unitPrice: Number(e.target.value)})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condition</label>
                    <select 
                      value={editingItem?.condition || 'New'}
                      onChange={(e) => setEditingItem({...editingItem, condition: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                    >
                      <option value="New">Brand New</option>
                      <option value="Good">Good Condition</option>
                      <option value="Fair">Fair / Used</option>
                      <option value="Maintenance">Needs Repair</option>
                    </select>
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

                  <button type="submit" className="w-full py-4 bg-[#292f36] text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl active:scale-95">
                    Deploy to Assets
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Cleaning Tasks Modal */}
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
              className="w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#292f36]">Cleaning Usage Tasks</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deduct supplies for completed services</p>
                  </div>
                </div>
                <button onClick={() => setIsTasksModalOpen(false)} className="p-2 text-gray-400 hover:text-[#292f36]">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex">
                <div className="w-1/3 border-r border-gray-100 overflow-y-auto p-4 space-y-3">
                  {pendingTasks.services.map((task) => (
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

                <div className="flex-1 overflow-y-auto p-6">
                  {selectedTask ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-black text-[#292f36] text-lg mb-1">{selectedTask.title}</h4>
                        <p className="text-sm text-gray-500">{selectedTask.subtitle}</p>
                        {selectedTask.notes && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-xl text-[11px] font-bold text-gray-600 italic">
                            Notes: "{selectedTask.notes}"
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Supplies Used</label>
                        <div className="grid grid-cols-2 gap-2">
                          {items.map(item => (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (usedItems.find(i => i.id === item.id)) {
                                  setUsedItems(usedItems.filter(i => i.id !== item.id));
                                } else {
                                  setUsedItems([...usedItems, { id: item.id, type: 'asset', quantity: 1, name: item.name }]);
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
                          {foodItems.map(item => (
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
                        </div>
                      </div>

                      {usedItems.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specify Quantities</label>
                          <div className="space-y-2">
                            {usedItems.map(used => {
                              const source = used.type === 'food' ? foodItems : items;
                              const unit = source.find(i => i.id === used.id)?.unit;
                              return (
                                <div key={used.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                  <span className="font-bold text-[#292f36] text-sm">{used.name}</span>
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="number"
                                      value={used.quantity}
                                      onChange={(e) => setUsedItems(usedItems.map(i => i.id === used.id ? {...i, quantity: Number(e.target.value)} : i))}
                                      className="w-16 px-2 py-1.5 bg-white rounded-lg border border-gray-200 text-center font-bold text-accent"
                                      step="0.1"
                                    />
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{unit}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <button 
                            onClick={handleRecordUsage}
                            className="w-full py-4 bg-[#292f36] text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl"
                          >
                            Deduct Supplies & Close Task
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                      <ClipboardList size={48} className="mb-4" />
                      <p className="font-black uppercase tracking-widest text-[10px]">Select a cleaning task</p>
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
