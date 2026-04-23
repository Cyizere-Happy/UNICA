'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Bed, Maximize, Users, 
  CheckCircle2, AlertCircle, X, Camera, Image as ImageIcon, 
  Layout, Save, Trash, Wand2, Info
} from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { Room } from '@/lib/gatepass/types';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'GALLERY'>('DETAILS');
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  useEffect(() => {
    apiService.getRooms().then(setRooms).catch(console.error);
  }, []);

  const openModal = (room?: Room) => {
    if (room) {
      setEditingRoom({ ...room });
      setActiveTab('DETAILS');
    } else {
      setEditingRoom({
        id: `room-${Date.now()}`,
        name: '',
        type: 'room',
        description: '',
        price: 0,
        capacity: 2,
        size: '',
        features: ['WiFi', 'Air Conditioning'],
        mainImage: '/Images/UNICA_Bedroom_view.jpg',
        gallery: [],
        status: 'AVAILABLE'
      });
      setActiveTab('DETAILS');
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingRoom || !editingRoom.name) return;
    const roomToSave = editingRoom as Room;
    try {
      if (rooms.find(r => r.id === roomToSave.id)) {
        const updated = await apiService.updateRoom(roomToSave.id, roomToSave);
        setRooms(prev => prev.map(r => r.id === updated.id ? updated : r));
        toast.success('Room updated successfully.');
      } else {
        const created = await apiService.createRoom(roomToSave);
        setRooms(prev => [...prev, created]);
        toast.success('Room created successfully.');
      }
      setIsModalOpen(false);
      setEditingRoom(null);
    } catch (err) {
      toast.error('Failed to save room.');
      console.error(err);
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('Are you sure you want to remove this room from inventory?')) return;
    try {
      await apiService.deleteRoom(roomId);
      setRooms(prev => prev.filter(r => r.id !== roomId));
      toast.success('Room removed.');
    } catch (err) {
      toast.error('Failed to delete room.');
    }
  };

  const updateField = (field: keyof Room, value: any) => {
    setEditingRoom(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addToGallery = (url: string) => {
    if (!url) return;
    const currentGallery = editingRoom?.gallery || [];
    updateField('gallery', [...currentGallery, url]);
  };

  const removeFromGallery = (index: number) => {
    const currentGallery = editingRoom?.gallery || [];
    updateField('gallery', currentGallery.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-jost pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black text-[#292f36] tracking-tight flex items-center gap-2">
            <Bed className="text-accent" size={28} />
            Inventory & Suites
          </h1>
          <p className="text-xs text-[#4d5053] font-medium max-w-sm">
            Control the digital showcase of UNICA-House premium living spaces.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#292f36] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-accent transition-all shadow-xl group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" strokeWidth={3} />
          Launch New Room
        </button>
      </div>

      {/* Grid of Rooms - Reverting to Unified Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {rooms.map((room) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={room.id} 
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all p-3"
            >
              {/* Responsive Image Container */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-gray-50">
                <img src={resolveImageUrl(room.mainImage)} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-3 right-3">
                  <span className={cn(
                    "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md",
                    room.status === 'AVAILABLE' ? "bg-green-500/90 text-white" : 
                    room.status === 'OCCUPIED' ? "bg-amber-500/90 text-white" : 
                    "bg-rose-500/90 text-white"
                  )}>
                    {room.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-[#292f36] text-[17px] leading-tight">{room.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{room.type}</p>
                       <span className="w-1 h-1 bg-gray-200 rounded-full" />
                       <span className="text-[10px] text-accent font-black">{room.size}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-accent text-lg">{formatPrice(room.price)}</span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">/ night</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-2">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => openModal(room)}
                      className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all" title="Edit Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(room.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Remove Room"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                        setEditingRoom(room);
                        setActiveTab('GALLERY');
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 text-[10px] font-black text-[#4d668f] bg-gray-50 rounded-xl hover:bg-[#4d668f] hover:text-white transition-all uppercase tracking-widest"
                  >
                    Manage Gallery
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modern Modal Overlay */}
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
              className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[800px]"
            >
              {/* Modal Sidebar (Tabs) */}
              <div className="w-full md:w-64 bg-gray-50 p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Wand2 size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configuration</p>
                        <h4 className="font-black text-[#292f36] text-[15px]">Room Engine</h4>
                     </div>
                  </div>

                  <nav className="space-y-2">
                    <button 
                      onClick={() => setActiveTab('DETAILS')}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
                        activeTab === 'DETAILS' ? "bg-white text-accent shadow-sm" : "text-gray-400 hover:text-accent hover:bg-white/50"
                      )}
                    >
                      <Info size={16} />
                      Room Details
                    </button>
                    <button 
                      onClick={() => setActiveTab('GALLERY')}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
                        activeTab === 'GALLERY' ? "bg-white text-accent shadow-sm" : "text-gray-400 hover:text-accent hover:bg-white/50"
                      )}
                    >
                      <ImageIcon size={16} />
                      Media & Gallery
                    </button>
                  </nav>
                </div>

                <div className="hidden md:block">
                   <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                     Ensure all metrics like size and capacity are accurate for guest transparency.
                   </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-8 overflow-y-auto flex-1">
                  {activeTab === 'DETAILS' ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Title</label>
                          <input 
                            type="text" 
                            value={editingRoom?.name || ''} 
                            onChange={(e) => updateField('name', e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                            placeholder="e.g. Royal Ocean Suite"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Type</label>
                          <select 
                            value={editingRoom?.type || 'room'} 
                            onChange={(e) => updateField('type', e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                          >
                             <option value="room">Standard Room</option>
                             <option value="suite">Premium Suite</option>
                             <option value="apartment">Full Apartment</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea 
                          rows={3}
                          value={editingRoom?.description || ''} 
                          onChange={(e) => updateField('description', e.target.value)}
                          className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none resize-none"
                          placeholder="Tell us about the atmosphere..."
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price ($)</label>
                          <input 
                            type="number" 
                            value={editingRoom?.price || ''} 
                            onChange={(e) => updateField('price', Number(e.target.value))}
                            className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capacity</label>
                          <input 
                            type="number" 
                            value={editingRoom?.capacity || ''} 
                            onChange={(e) => updateField('capacity', Number(e.target.value))}
                            className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Size (m²)</label>
                          <input 
                            type="text" 
                            value={editingRoom?.size || ''} 
                            onChange={(e) => updateField('size', e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                            placeholder="e.g. 45m²"
                          />
                        </div>
                      </div>
                         <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Main Cover Image Upload</label>
                          <div className="flex gap-2">
                             <div className="flex-1 relative">
                               <input 
                                 type="file" 
                                 accept="image/*"
                                 disabled={isUploadingMain}
                                 onChange={async (e) => {
                                   const file = e.target.files?.[0];
                                   if (file) {
                                     try {
                                       setIsUploadingMain(true);
                                       const { url } = await apiService.uploadImage(file, 'rooms');
                                       updateField('mainImage', url);
                                     } catch (err) {
                                       console.error('Upload failed:', err);
                                       toast.error('Failed to upload image');
                                     } finally {
                                       setIsUploadingMain(false);
                                     }
                                   }
                                 }}
                                 className="w-full px-5 py-2.5 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] text-[11px] transition-all outline-none disabled:opacity-50"
                               />
                               {isUploadingMain && (
                                 <div className="absolute inset-y-0 right-4 flex items-center">
                                   <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                 </div>
                               )}
                             </div>
                             <div className="w-12 h-12 rounded-xl border-2 border-gray-100 overflow-hidden shrink-0 flex items-center justify-center bg-gray-50">
                                {isUploadingMain ? (
                                  <ImageIcon className="text-gray-300 animate-pulse" size={20} />
                                ) : (
                                  <img src={resolveImageUrl(editingRoom?.mainImage)} className="w-full h-full object-cover" />
                                )}
                             </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                          <select 
                            value={editingRoom?.status || 'AVAILABLE'} 
                            onChange={(e) => updateField('status', e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:border-accent/10 focus:bg-white rounded-2xl font-bold text-[#292f36] transition-all outline-none"
                          >
                             <option value="AVAILABLE">Available</option>
                             <option value="OCCUPIED">Occupied</option>
                             <option value="MAINTENANCE">Maintenance</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                    <div className="space-y-8">
                       <div className="p-6 bg-accent/5 rounded-[32px] border border-accent/10">
                          <h5 className="text-[11px] font-black text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                             <Camera size={14} /> Add to Property Gallery
                          </h5>
                          <div className="flex gap-3 relative">
                             <input 
                               id="new-gallery-file"
                               type="file" 
                               accept="image/*"
                               disabled={isUploadingGallery}
                               className="flex-1 px-5 py-2 bg-white border-2 border-transparent focus:border-accent/10 rounded-2xl font-bold text-[#292f36] text-[12px] transition-all outline-none shadow-sm disabled:opacity-50"
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   try {
                                     setIsUploadingGallery(true);
                                     const { url } = await apiService.uploadImage(file, 'rooms');
                                     addToGallery(url);
                                     e.target.value = '';
                                   } catch (err) {
                                     console.error('Upload failed:', err);
                                     toast.error('Failed to upload gallery image');
                                   } finally {
                                     setIsUploadingGallery(false);
                                   }
                                 }
                               }}
                             />
                             {isUploadingGallery && (
                               <div className="absolute inset-y-0 right-4 flex items-center">
                                 <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                               </div>
                             )}
                          </div>
                       </div>

                       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          <AnimatePresence>
                            {(editingRoom?.gallery || []).map((url, idx) => (
                              <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                key={idx} 
                                className="relative aspect-square rounded-2xl overflow-hidden group shadow-md"
                              >
                                 <img src={resolveImageUrl(url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                      onClick={() => removeFromGallery(idx)}
                                      className="p-3 bg-white text-rose-600 rounded-full hover:scale-110 transition-transform shadow-xl"
                                    >
                                       <Trash size={18} />
                                    </button>
                                 </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          {(!editingRoom?.gallery || editingRoom.gallery.length === 0) && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-[32px]">
                               <ImageIcon size={48} strokeWidth={1} className="mb-4" />
                               <p className="text-sm font-bold">No gallery assets added yet</p>
                            </div>
                          )}
                       </div>
                    </div>
                  )}
                </div>

                <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-white">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-[#292f36] transition-all"
                  >
                    Discard Changes
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-accent to-[#3a4f6e] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                  >
                    <Save size={18} />
                    Deploy to Property
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-[#292f36] transition-all md:hidden"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
