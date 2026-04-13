'use client';

import { useEffect, useState } from 'react';
import { Calendar, Plus, Users, MapPin, Edit, XCircle, Filter, Download, Settings, Trash2 } from 'lucide-react';
import Lottie from "lottie-react";
import animationData from "@/lib/gatepass/assets/Logo.json";
import { apiService } from '@/lib/gatepass/apiService';
import type { VisitingDay } from '@/lib/gatepass/types';
import { toast } from 'sonner';
import ConfirmModal from '@/components/gatepass/ConfirmModal';

// Remove local interface that conflicts with global

export default function VisitingDays() {
  const [visitingDays, setVisitingDays] = useState<VisitingDay[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<VisitingDay | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });
  const [visitType, setVisitType] = useState<'PARENTS' | 'OUTSIDE_VISITORS'>('PARENTS');
  const [newVisit, setNewVisit] = useState({
    guestName: '',
    roomName: '',
    roomType: '',
    visitorOrganization: '',
    visitDepartment: '',
    guestPhone: '',
    purpose: '',
    visitDate: '',
    visitTime: '',
    institution: '',
    email: ''
  });
  const [newVisitingDay, setNewVisitingDay] = useState({
    date: '',
    startTime: '08:00',
    endTime: '17:00',
    location: 'Main Campus',
    title: '',
    maxVisitors: 50,
    audience: 'PARENTS' as 'PARENTS' | 'OUTSIDE_VISITORS'
  });

  useEffect(() => {
    loadVisitingDays();
  }, [statusFilter]);

  // Smart Sync: Only refresh when a visiting day is scheduled to close
  useEffect(() => {
    if (visitingDays.length === 0) return;

    // Only monitor days that could auto-close (OPEN and NOT manual)
    const openDays = visitingDays.filter(day =>
      (day.status === 'OPEN' || (day.status as string) === 'active') && !day.isManual
    );

    if (openDays.length === 0) return;

    let nextRefreshDelay = Infinity;
    const now = Date.now();

    openDays.forEach(day => {
      const targetDate = new Date(day.date);
      const [hours, minutes] = (day.endTime || '17:00').split(':').map(Number);
      targetDate.setHours(hours, minutes, 0, 0);

      const delay = targetDate.getTime() - now;

      // If the time is in the future, track the one that happens soonest
      if (delay > 0 && delay < nextRefreshDelay) {
        nextRefreshDelay = delay;
      }
    });

    if (nextRefreshDelay !== Infinity) {
      // Add a 3-second secure buffer to ensure backend has processed the tick
      const timerId = setTimeout(() => {
        loadVisitingDays();
      }, nextRefreshDelay + 3000);

      return () => clearTimeout(timerId);
    }
  }, [visitingDays]);

  const loadVisitingDays = async () => {
    try {
      const { visitingDays: data } = await apiService.getVisitingDays({ status: statusFilter });
      setVisitingDays(data);
    } catch (error) {
      console.error('Failed to load visiting days:', error);
    }
  };

  const handleCreateVisitingDay = async () => {
    if (!newVisitingDay.date || !newVisitingDay.startTime || !newVisitingDay.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await apiService.createVisitingDay({
        title: newVisitingDay.title,
        date: newVisitingDay.date,
        pricePerPerson: 2000, // Default price or add to UI
        audience: newVisitingDay.audience.toUpperCase() as 'PARENTS' | 'OUTSIDE_VISITORS', // Map to Backend Enum
        status: 'OPEN',
        location: newVisitingDay.location,
        startTime: newVisitingDay.startTime,
        endTime: newVisitingDay.endTime
      });
      setShowCreateModal(false);
      loadVisitingDays();
      setNewVisitingDay({
        date: '', startTime: '08:00', endTime: '17:00', location: 'Main Campus', title: '', maxVisitors: 50, audience: 'PARENTS'
      });
    } catch (error) {
      toast.error('Failed to create visiting day');
    }
  };

  const handleDeleteVisitingDay = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Visiting Day',
      message: 'Are you sure you want to delete this visiting day? This will remove all associated visits permanently.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await apiService.deleteVisitingDay(id);
          toast.success('Visiting Day deleted successfully');
          loadVisitingDays();
        } catch (error) {
          console.error(error);
          toast.error('Failed to delete the visiting day');
        }
      }
    });
  };

  const handleToggleStatus = async (day: VisitingDay, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentStatus = day.status as string;
    const newStatus = (currentStatus === 'active' || currentStatus === 'OPEN') ? 'CLOSED' : 'OPEN';
    const action = newStatus === 'CLOSED' ? 'close' : 'open';

    setConfirmConfig({
      isOpen: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Visiting Day`,
      message: `Are you sure you want to ${action} this visiting day?`,
      type: action === 'close' ? 'warning' : 'info',
      onConfirm: async () => {
        try {
          await apiService.updateVisitingDay(day.id, { status: newStatus });
          toast.success(`Visiting Day ${action}ed successfully`);
          loadVisitingDays();
        } catch (error) {
          console.error(error);
          toast.error(`Failed to ${action} the visiting day`);
        }
      }
    });
  };

  const toggleSelectDay = (id: string) => {
    setSelectedDays(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
      OPEN: 'bg-green-100 text-green-700',
      CLOSED: 'bg-gray-100 text-gray-700',
      active_legacy: 'bg-green-100 text-green-700', // for any legacy data
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getCapacityColor = (current: number, max: number) => {
    const ratio = current / max;
    if (ratio >= 0.9) return 'text-red-600';
    if (ratio >= 0.7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const totalDays = visitingDays.length;
  const totalVisitors = visitingDays.reduce((sum, d) => sum + d.currentVisitors, 0);
  const activeDays = visitingDays.filter(d => d.status === 'active').length;
  const avgCapacity = totalDays ? Math.round(visitingDays.reduce((sum, d) => sum + (d.currentVisitors / d.maxVisitors) * 100, 0) / totalDays) : 0;

  const openVisitModal = (day: VisitingDay) => {
    setSelectedDay(day);
    setVisitType(day.audience || 'PARENTS');
    setNewVisit({
      guestName: '',
      roomName: '',
      roomType: '',
      visitorOrganization: '',
      visitDepartment: '',
      guestPhone: '',
      purpose: '',
      visitDate: day.date,
      visitTime: '',
      institution: '',
      email: ''
    });
    setShowVisitModal(true);
  };

  const handleSaveVisit = async () => {
    if (!newVisit.visitDate || !newVisit.visitTime || !newVisit.purpose) {
      toast.error('Please fill in the required fields: purpose, date and time.');
      return;
    }

    try {
      const payload = {
        guestName: newVisit.guestName,
        phoneNumber: newVisit.guestPhone,
        visitDate: newVisit.visitDate,
        visitTime: newVisit.visitTime,
        purpose: newVisit.purpose,
        visitorType: visitType,
        roomNames: visitType === 'PARENTS' ? [newVisit.roomName] : undefined,
        institution: newVisit.institution || newVisit.visitorOrganization,
        email: newVisit.email,
        visitCode: selectedDay?.visitCode || '123456'
      };

      await apiService.registerVisitor(payload);

      setShowVisitModal(false);
    } catch (error) {
      console.error('Failed to save visit:', error);
      toast.error('Failed to save visit. Please try again.');
    }
  };

  return (
    <div className="min-h-screen text-sm">
      {/* Compact Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#153d5d' }}>Management Schedule</h1>
        <p className="text-gray-600">Manage UNICA House guest stays & visitor management</p>
      </div>

      {/* Compact Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 text-white rounded font-medium flex items-center gap-1.5 text-xs"
              style={{ backgroundColor: '#153d5d' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Days', value: totalDays, icon: Calendar },
          { label: 'Total Visitors', value: totalVisitors, icon: Users },
          { label: 'Active', value: activeDays, icon: Calendar },
          { label: 'Avg. Capacity', value: `${avgCapacity}%`, icon: MapPin },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-xl font-bold" style={{ color: '#153d5d' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Compact Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-xs p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2 text-left"><input type="checkbox" className="rounded" onChange={(e) => setSelectedDays(e.target.checked ? visitingDays.map(d => d.id) : [])} /></th>
                <th className="px-3 py-2 text-left">Day</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">For</th>
                <th className="px-3 py-2 text-left">Visitors</th>
                <th className="px-3 py-2 text-left">Visit Code</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visitingDays.map(day => (
                <tr key={day.id} className={`hover:bg-gray-50 ${selectedDays.includes(day.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-3 py-2.5"><input type="checkbox" className="rounded" checked={selectedDays.includes(day.id)} onChange={() => toggleSelectDay(day.id)} /></td>
                  <td className="px-3 py-2.5 font-medium">{day.title}</td>
                  <td className="px-3 py-2.5">{new Date(day.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                  <td className="px-3 py-2.5">{day.startTime} - {day.endTime}</td>
                  <td className="px-3 py-2.5">{day.location}</td>
                  <td className="px-3 py-2.5">
                    {day.audience === 'PARENTS' ? 'Stay / Guest' : 'Temporary Visitor'}
                  </td>
                  <td className="px-3 py-2.5">{day.currentVisitors}</td>
                  <td className={`px-3 py-2.5 font-medium ${getCapacityColor(day.currentVisitors, day.maxVisitors)}`}>
                    {Math.round((day.currentVisitors / day.maxVisitors) * 100)}%
                  </td>
                  <td className="px-3 py-2.5 font-mono font-bold text-blue-700">{day.visitCode}</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(day.status)}`}>
                      {day.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-600" onClick={(e) => handleDeleteVisitingDay(day.id, e)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 ml-1"
                        onClick={() => openVisitModal(day)}
                        disabled={(day.status as string) !== 'active' && (day.status as string) !== 'OPEN'}
                      >
                        Register Visit
                      </button>
                      <button
                        className={`text-xs px-2 py-1 rounded border font-medium ml-1 ${(day.status as string) === 'active' || (day.status as string) === 'OPEN'
                          ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
                          : 'border-green-300 text-green-600 hover:bg-green-50'
                          }`}
                        onClick={(e) => handleToggleStatus(day, e)}
                      >
                        {(day.status as string) === 'active' || (day.status as string) === 'OPEN' ? 'Close' : 'Re-open'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedDays.length > 0 && (
          <div className="bg-gray-50 border-t px-4 py-2 flex items-center justify-between text-xs">
            <span>{selectedDays.length} selected</span>
            <div className="flex gap-3">
              <button className="text-gray-700 hover:text-gray-900">Edit</button>
              <button className="text-red-600 hover:text-red-700">Delete</button>
            </div>
          </div>
        )}

        <div className="bg-white border-t px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <select className="border rounded px-2 py-1"><option>10</option><option>25</option></select>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border rounded hover:bg-gray-50">Prev</button>
            <button className="px-2 py-1 rounded text-white" style={{ backgroundColor: '#153d5d' }}>1</button>
            <button className="px-2 py-1 border rounded hover:bg-gray-50">2</button>
            <button className="px-2 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Compact Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className='absolute bottom-0 right-0 w-72 h-72'>
            <Lottie animationData={animationData} loop={true} />
          </div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="bg-blue-50 px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-base" style={{ color: '#153d5d' }}>Schedule Visiting Day</h3>
              <button onClick={() => setShowCreateModal(false)} className="hover:opacity-70">
                <XCircle className="w-5 h-5" style={{ color: '#153d5d' }} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Date <span className="text-red-500">*</span></label>
                  <input type="date" value={newVisitingDay.date} onChange={e => setNewVisitingDay(prev => ({ ...prev, date: e.target.value }))} className="w-full px-3 py-1.5 border rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Visit Type <span className="text-red-500">*</span></label>
                  <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() =>
                        setNewVisitingDay(prev => ({ ...prev, audience: 'PARENTS' }))
                      }
                      className={`px-3 py-1 rounded-full font-medium ${newVisitingDay.audience === 'PARENTS'
                        ? 'bg-white text-[#153d5d] shadow-sm'
                        : 'text-gray-500'
                        }`}
                    >
                      Guest Stay
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewVisitingDay(prev => ({ ...prev, audience: 'OUTSIDE_VISITORS' }))
                      }
                      className={`px-3 py-1 rounded-full font-medium ${newVisitingDay.audience === 'OUTSIDE_VISITORS'
                        ? 'bg-white text-[#153d5d] shadow-sm'
                        : 'text-gray-500'
                        }`}
                    >
                      Temporary Visitor
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Location <span className="text-red-500">*</span></label>
                  <input type="text" value={newVisitingDay.location} onChange={e => setNewVisitingDay(prev => ({ ...prev, location: e.target.value }))} placeholder="Auditorium" className="w-full px-3 py-1.5 border rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Start <span className="text-red-500">*</span></label>
                  <input type="time" value={newVisitingDay.startTime} onChange={e => setNewVisitingDay(prev => ({ ...prev, startTime: e.target.value }))} className="w-full px-3 py-1.5 border rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">End <span className="text-red-500">*</span></label>
                  <input type="time" value={newVisitingDay.endTime} onChange={e => setNewVisitingDay(prev => ({ ...prev, endTime: e.target.value }))} className="w-full px-3 py-1.5 border rounded text-xs" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1">Title</label>
                  <textarea rows={2} value={newVisitingDay.title} onChange={e => setNewVisitingDay(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-1.5 border rounded text-xs resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Max Visitors</label>
                  <input type="number" value={newVisitingDay.maxVisitors} onChange={e => setNewVisitingDay(prev => ({ ...prev, maxVisitors: parseInt(e.target.value) || 50 }))} className="w-full px-3 py-1.5 border rounded text-xs" />
                </div>
              </div>
            </div>

            <div className="border-t px-4 py-3 flex gap-2">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-3 py-1.5 border rounded text-gray-700 hover:bg-gray-50 text-xs font-medium">Cancel</button>
              <button onClick={handleCreateVisitingDay} className="flex-1 px-3 py-1.5 text-white rounded text-xs font-medium" style={{ backgroundColor: '#153d5d' }}>Schedule</button>
            </div>
          </div>
        </div>
      )}

      {/* Register Visit Modal */}
      {showVisitModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-50 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#153d5d' }}>
                  Register Visit
                </h3>
                <p className="text-xs mt-1 text-gray-600">
                  Visiting day: {selectedDay && new Date(selectedDay.date).toLocaleDateString('en-GB')} ·{' '}
                  {selectedDay?.startTime} - {selectedDay?.endTime}
                </p>
              </div>
              <button
                onClick={() => setShowVisitModal(false)}
                className="hover:opacity-70"
              >
                <XCircle className="w-5 h-5" style={{ color: '#153d5d' }} />
              </button>
            </div>

            <div className="px-6 pt-4">
              <label className="block text-xs font-semibold mb-1">
                Visit Type <span className="text-red-500">*</span>
              </label>
              <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setVisitType('PARENTS')}
                  className={`px-3 py-1 rounded-full font-medium ${visitType === 'PARENTS'
                    ? 'bg-white text-[#153d5d] shadow-sm'
                    : 'text-gray-500'
                    }`}
                >
                  Guest Visit
                </button>
                <button
                  type="button"
                  onClick={() => setVisitType('OUTSIDE_VISITORS')}
                  className={`px-3 py-1 rounded-full font-medium ${visitType === 'OUTSIDE_VISITORS'
                    ? 'bg-white text-[#153d5d] shadow-sm'
                    : 'text-gray-500'
                    }`}
                >
                  Outside Visitor
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {visitType === 'PARENTS' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Guest Name</label>
                      <input
                        type="text"
                        value={newVisit.guestName}
                        onChange={e =>
                          setNewVisit(prev => ({ ...prev, guestName: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Host / Room</label>
                      <input
                        type="text"
                        value={newVisit.roomName}
                        onChange={e =>
                          setNewVisit(prev => ({ ...prev, roomName: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Room Type</label>
                      <input
                        type="text"
                        value={newVisit.roomType}
                        onChange={e =>
                          setNewVisit(prev => ({ ...prev, roomType: e.target.value }))
                        }
                        placeholder="e.g. Deluxe Suite"
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Purpose</label>
                      <input
                        type="text"
                        value={newVisit.purpose}
                        onChange={e =>
                          setNewVisit(prev => ({ ...prev, purpose: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Visitor Name</label>
                      <input
                        type="text"
                        value={newVisit.guestName}
                        onChange={e =>
                          setNewVisit(prev => ({ ...prev, guestName: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Institution / Organization</label>
                      <input
                        type="text"
                        value={newVisit.institution || newVisit.visitorOrganization}
                        onChange={e =>
                          setNewVisit(prev => ({
                            ...prev,
                            institution: e.target.value,
                            visitorOrganization: e.target.value
                          }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">
                        Department / Person Visited
                      </label>
                      <input
                        type="text"
                        value={newVisit.visitDepartment || newVisit.purpose}
                        onChange={e =>
                          setNewVisit(prev => ({
                            ...prev,
                            visitDepartment: e.target.value,
                            purpose: e.target.value
                          }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Contact Number</label>
                      <input
                        type="tel"
                        value={newVisit.guestPhone}
                        onChange={e =>
                          setNewVisit(prev => ({
                            ...prev,
                            guestPhone: e.target.value
                          }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newVisit.email}
                      onChange={e =>
                        setNewVisit(prev => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="visitor@example.com"
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Visit Date</label>
                  <input
                    type="date"
                    value={newVisit.visitDate}
                    onChange={e =>
                      setNewVisit(prev => ({ ...prev, visitDate: e.target.value }))
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Visit Time</label>
                  <input
                    type="time"
                    value={newVisit.visitTime}
                    onChange={e =>
                      setNewVisit(prev => ({ ...prev, visitTime: e.target.value }))
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex gap-2">
              <button
                onClick={() => setShowVisitModal(false)}
                className="flex-1 px-3 py-1.5 border rounded text-gray-700 hover:bg-gray-50 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVisit}
                className="flex-1 px-3 py-1.5 text-white rounded text-xs font-medium"
                style={{ backgroundColor: '#153d5d' }}
              >
                Save Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Display Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl flex overflow-hidden">
            {/* Left side: Report display */}
            <div className="flex-1 p-6 border-r flex flex-col h-[70vh]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold" style={{ color: '#153d5d' }}>VISITING DAYS EXPORT PREVIEW</h3>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium border border-green-200">Standardized Layout</span>
              </div>
              <div className="flex-1 overflow-auto border rounded bg-gray-50 p-4">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-gray-700 font-semibold">Title</th>
                      <th className="pb-3 text-gray-700 font-semibold">Date & Time</th>
                      <th className="pb-3 text-gray-700 font-semibold">Location</th>
                      <th className="pb-3 text-gray-700 font-semibold">Visitors / Capacity</th>
                      <th className="pb-3 text-gray-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitingDays.map(v => (
                      <tr key={v.id} className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                        <td className="py-3 font-medium text-[#153d5d]">{v.title}</td>
                        <td className="py-3 text-gray-600">
                          {new Date(v.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {` · ${v.startTime} - ${v.endTime}`}
                        </td>
                        <td className="py-3 text-gray-600">{v.location}</td>
                        <td className="py-3 text-gray-600">{v.currentVisitors} / {v.maxVisitors}</td>
                        <td className="py-3">
                          <button
                            onClick={() => {
                              apiService.exportReport(v.id);
                              toast.success(`Exporting report for ${v.title}...`);
                            }}
                            className="text-xs px-2 py-1 rounded border border-[#153d5d] text-[#153d5d] hover:bg-blue-50 font-medium flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> Export
                          </button>
                        </td>
                      </tr>
                    ))}
                    {visitingDays.length === 0 && (
                      <tr><td colSpan={4} className="py-8 text-center text-gray-500">No report data available for preview.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right side: Export Options */}
            <div className="w-80 bg-gray-50 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Export Format</h3>
                  <p className="text-xs text-gray-500 mt-1">Choose how you want to save this report</p>
                </div>
                <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-auto">
                <button
                  onClick={() => { apiService.exportAllReports(visitingDays); toast.success('Exporting all reports...'); setShowExportModal(false); }}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-500 hover:shadow-sm flex items-center gap-4 transition-all"
                >
                  <Download className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Export All (CSV)</div>
                    <div className="text-xs text-gray-500">All visiting days</div>
                  </div>
                </button>
                <div className="pt-4 pb-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</h4>
                </div>
                <button
                  onClick={() => { toast.success('Feature coming soon: Google Sheets direct sync'); }}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-green-500 hover:shadow-sm flex items-center gap-4 transition-all opacity-60"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg" alt="Google Sheets" className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Google Sheets</div>
                    <div className="text-xs text-gray-500">Direct cloud sync</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="px-5 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="font-bold text-gray-900">Filter Visiting Days</h3>
              <button onClick={() => setShowFilterModal(false)}><XCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-[#153d5d] focus:border-[#153d5d]"
                >
                  <option value="all">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Audience</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-[#153d5d] focus:border-[#153d5d]">
                  <option>All Audiences</option>
                  <option>Parents</option>
                  <option>Outside Visitors</option>
                </select>
              </div>
            </div>
            <div className="px-5 py-4 flex gap-3 border-t bg-gray-50 rounded-b-xl">
              <button onClick={() => setShowFilterModal(false)} className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Reset</button>
              <button onClick={() => setShowFilterModal(false)} className="flex-1 px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition" style={{ backgroundColor: '#153d5d' }}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-5 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="font-bold text-gray-900">Visiting Day Preferences</h3>
              <button onClick={() => setShowSettingsModal(false)}><XCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:border-[#153d5d] transition-colors cursor-pointer">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Auto-Approve Guests</h4>
                  <p className="text-xs text-gray-500">Skip manual approval for registered guests</p>
                </div>
                <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:border-[#153d5d] transition-colors cursor-pointer">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Email Notifications</h4>
                  <p className="text-xs text-gray-500">Get notified of capacity warnings</p>
                </div>
                <div className="w-10 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Default Capacity</label>
                <input type="number" defaultValue="50" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-[#153d5d] focus:border-[#153d5d]" />
              </div>
            </div>
            <div className="px-5 py-4 flex gap-3 border-t bg-gray-50 rounded-b-xl justify-end">
              <button onClick={() => setShowSettingsModal(false)} className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowSettingsModal(false)} className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition" style={{ backgroundColor: '#153d5d' }}>Save Settings</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
    </div>
  );
}
