'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Bed, Maximize, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { operationalData } from '@/lib/gatepass/operationalData';
import { Room } from '@/lib/gatepass/types';
import { formatPrice } from '@/lib/utils';

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>(operationalData.getRooms());
  const [isAdding, setIsAdding] = useState(false);

  // Simplified Add Room for Mock UI
  const handleAddRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: 'New Luxury Room',
      type: 'room',
      description: 'Newly added premium space for absolute comfort.',
      price: 50,
      capacity: 2,
      size: '30m²',
      features: ['WiFi', 'Air Conditioning'],
      mainImage: '/Images/UNICA_Bedroom_view.jpg',
      gallery: [],
      status: 'AVAILABLE'
    };
    operationalData.addRoom(newRoom);
    setRooms(operationalData.getRooms());
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'AVAILABLE': return 'text-green-600 bg-green-50';
      case 'OCCUPIED': return 'text-amber-600 bg-amber-50';
      case 'MAINTENANCE': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#292f36] tracking-tight">Room Inventory</h1>
          <p className="text-sm text-[#4d5053] font-medium">Manage UNICA-House active rooms and suites.</p>
        </div>
        <button
          onClick={handleAddRoom}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4d668f] text-white rounded-xl font-bold hover:bg-[#3a4f6e] transition-all shadow-md group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Add New Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-44 group">
              <img src={room.mainImage} alt={room.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-black text-[#292f36] text-lg">{room.name}</h3>
                <span className="font-bold text-[#4d668f] text-lg">{formatPrice(room.price)}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex items-center gap-1.5 text-[11px] text-[#4d5053] font-bold uppercase tracking-tighter">
                  <Maximize className="w-3.5 h-3.5 text-[#4d668f]" />
                  {room.size}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#4d5053] font-bold uppercase tracking-tighter">
                  <Users className="w-3.5 h-3.5 text-[#4d668f]" />
                  {room.capacity} Guests
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#4d5053] font-bold uppercase tracking-tighter">
                  <Bed className="w-3.5 h-3.5 text-[#4d668f]" />
                  {room.type}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-[#4d668f] hover:bg-blue-50 rounded-lg transition-all" title="Edit Guest Details">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Remove Room">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="px-4 py-1.5 text-[12px] font-bold text-[#4d668f] border border-[#4d668f]/20 rounded-lg hover:bg-[#4d668f] hover:text-white transition-all">
                  Manage Gallery
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
