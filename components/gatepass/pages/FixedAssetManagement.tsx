'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Package, Bed, Shield, AlertCircle, 
  Search, Filter, Save, X, Camera,
  Info, History, Trash2, LayoutGrid, List, CheckCircle2
} from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { resolveImageUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function FixedAssetManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roomFilter, setRoomFilter] = useState('All');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assetsData, roomsData] = await Promise.all([
        apiService.getFixedAssets(),
        apiService.getRooms()
      ]);
      setItems(assetsData);
      setRooms(roomsData);
    } catch (err) {
      toast.error('Failed to load fixed assets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await apiService.updateFixedAsset(editingItem.id, editingItem);
        toast.success('Asset updated');
      } else {
        await apiService.createFixedAsset(editingItem);
        toast.success('Fixed asset registered');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save fixed asset');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const { url } = await apiService.uploadImage(file, 'rooms');
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
    const matchesRoom = roomFilter === 'All' || item.room?.name === roomFilter;
    return matchesSearch && matchesRoom;
  });

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 font-jost pb-20 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#292f36] tracking-tight flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl text-accent">
              <Shield size={28} />
            </div>
            Fixed Assets Control
          </h1>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Manage inventory located within specific rooms and apartments.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem({ name: '', roomId: rooms[0]?.id || '', status: 'WORKING' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#292f36] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-accent transition-all shadow-xl group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" strokeWidth={3} />
          Record New Asset
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search assets (e.g. Smart TV)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-accent/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          <select 
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border-none rounded-xl text-[11px] font-black uppercase tracking-wider outline-none text-accent"
          >
            <option value="All">All Rooms</option>
            {rooms.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
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
                className="group bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all p-4 relative"
              >
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gray-50 mb-4">
                  <img 
                    src={resolveImageUrl(item.imageUrl) || '/Images/placeholder-fixed.jpg'} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={cn(
                      "px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                      item.status === 'WORKING' ? "text-accent" : "text-rose-600"
                    )}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-[#292f36] text-lg leading-tight">{item.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Bed size={12} className="text-accent/60" />
                        <p className="text-[10px] text-accent font-bold uppercase tracking-widest">{item.room?.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <p className="text-[9px] text-gray-400 font-medium">S/N: {item.serialNumber || 'N/A'}</p>
                    <button 
                      onClick={() => {
                        setEditingItem(item);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal for Fixed Asset registration/edit */}
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
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fixed Asset</p>
                      <h3 className="text-xl font-black text-[#292f36]">{editingItem?.id ? 'Modify Asset' : 'Register New Asset'}</h3>
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
                        type="text" required
                        value={editingItem?.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Serial Number (Optional)</label>
                      <input 
                        type="text"
                        value={editingItem?.serialNumber || ''}
                        onChange={(e) => setEditingItem({...editingItem, serialNumber: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assign to Room</label>
                      <select 
                        required
                        value={editingItem?.roomId}
                        onChange={(e) => setEditingItem({...editingItem, roomId: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      >
                        <option value="">Select a Room</option>
                        {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Status</label>
                      <select 
                        value={editingItem?.status}
                        onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                      >
                        <option value="WORKING">Working / Active</option>
                        <option value="BROKEN">Broken / Needs Repair</option>
                        <option value="MISSING">Missing / Stolen</option>
                        <option value="REPLACED">Replaced</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Image</label>
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
                          <img src={resolveImageUrl(editingItem?.imageUrl)} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 bg-[#292f36] text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl active:scale-95">
                    {editingItem?.id ? 'Apply Changes' : 'Deploy to Room'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
