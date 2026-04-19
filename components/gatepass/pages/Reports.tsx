'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Bed, MessageSquare, Utensils, XCircle, Search, Calendar, ChevronRight, Users } from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import { API_URL } from '@/lib/gatepass/api';
import type { FoodOrder, Room, GuestProfile } from '@/lib/gatepass/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type ReportType = 'food_orders' | 'rooms' | 'guests';

export default function PropertyManagementReports() {
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportType>('food_orders');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<GuestProfile[]>([]);
  const [roomStatus, setRoomStatus] = useState<any>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [fetchedOrders, fetchedRooms, fetchedGuests, status] = await Promise.all([
          apiService.getOrders(),
          apiService.getRooms(),
          apiService.getGuests(),
          apiService.getRoomStatus(),
        ]);
        setOrders(fetchedOrders);
        setRooms(fetchedRooms);
        setGuests(fetchedGuests);
        setRoomStatus(status);
      } catch (err) {
        console.error('Failed to load report data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleExport = async (format: 'csv' | 'sheet') => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/reports/export?type=${selectedReport}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unica_${selectedReport}_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Report downloaded successfully as CSV`);
    } catch (err) {
      toast.error('Export failed. Please try again.');
      console.error(err);
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  const getReportSummary = () => {
    if (selectedReport === 'food_orders') {
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
      return { title: 'Total F&B Revenue', value: `$${totalRevenue.toFixed(2)}` };
    }
    if (selectedReport === 'guests') {
      return { title: 'Total Registered Guests', value: `${guests.length}` };
    }
    if (selectedReport === 'rooms') {
      const avail = roomStatus?.availableCount ?? rooms.filter(r => r.status === 'AVAILABLE').length;
      const total = roomStatus?.total ?? rooms.length;
      const occ = roomStatus?.occupancyRate ?? 0;
      return { title: `Available / Total · ${occ}% Occupied`, value: `${avail} / ${total}` };
    }
    return { title: 'Report Ready', value: 'Generate below' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#292f36]"></div>
      </div>
    );
  }

  const summary = getReportSummary();

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-jost pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#292f36] tracking-tight flex items-center gap-2">
            <FileText className="text-accent" size={26} />
            Data &amp; Reports
          </h1>
          <p className="text-xs text-[#4d5053] font-medium mt-1">
            Generate specific performance logs, culinary audits, and guest records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report Selection Sidebar */}
        <div className="col-span-1 space-y-3">
          <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 mb-4 px-2">Available Reports</h3>

          {/* F&B Orders */}
          <button
            onClick={() => setSelectedReport('food_orders')}
            className={cn(
              "w-full text-left flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
              selectedReport === 'food_orders' ? "bg-white border-[#292f36] shadow-md" : "bg-gray-50 border-transparent hover:bg-white text-gray-500"
            )}
          >
            <div className="flex gap-4 items-center">
              <div className={cn("p-2.5 rounded-xl", selectedReport === 'food_orders' ? "bg-accent/10 text-accent" : "bg-gray-100")}>
                <Utensils size={18} />
              </div>
              <div>
                <h4 className={cn("font-black text-sm", selectedReport === 'food_orders' ? "text-[#292f36]" : "")}>F&amp;B Orders</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-60">Kitchen Revenue Log</p>
              </div>
            </div>
            {selectedReport === 'food_orders' && <ChevronRight size={16} className="text-[#292f36]" />}
          </button>

          {/* Room Matrix */}
          <button
            onClick={() => setSelectedReport('rooms')}
            className={cn(
              "w-full text-left flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
              selectedReport === 'rooms' ? "bg-white border-[#292f36] shadow-md" : "bg-gray-50 border-transparent hover:bg-white text-gray-500"
            )}
          >
            <div className="flex gap-4 items-center">
              <div className={cn("p-2.5 rounded-xl", selectedReport === 'rooms' ? "bg-accent/10 text-accent" : "bg-gray-100")}>
                <Bed size={18} />
              </div>
              <div>
                <h4 className={cn("font-black text-sm", selectedReport === 'rooms' ? "text-[#292f36]" : "")}>Room Matrix</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-60">Inventory &amp; Status</p>
              </div>
            </div>
            {selectedReport === 'rooms' && <ChevronRight size={16} className="text-[#292f36]" />}
          </button>

          {/* Registered Guests */}
          <button
            onClick={() => setSelectedReport('guests')}
            className={cn(
              "w-full text-left flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
              selectedReport === 'guests' ? "bg-white border-[#292f36] shadow-md" : "bg-gray-50 border-transparent hover:bg-white text-gray-500"
            )}
          >
            <div className="flex gap-4 items-center">
              <div className={cn("p-2.5 rounded-xl", selectedReport === 'guests' ? "bg-accent/10 text-accent" : "bg-gray-100")}>
                <Users size={18} />
              </div>
              <div>
                <h4 className={cn("font-black text-sm", selectedReport === 'guests' ? "text-[#292f36]" : "")}>Registered Guests</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-60">Full Registration Profiles</p>
              </div>
            </div>
            {selectedReport === 'guests' && <ChevronRight size={16} className="text-[#292f36]" />}
          </button>
        </div>

        {/* Report Meta & Trigger */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4">

          {/* Summary Header */}
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest">{summary.title}</h3>
              <p className="text-3xl font-black text-[#292f36] mt-1">{summary.value}</p>
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-6 py-4 rounded-xl text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-[#292f36]/20 transition-all hover:bg-black active:scale-95 bg-[#292f36]"
            >
              Generate Report <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Preview Panel */}
          {selectedReport === 'rooms' && roomStatus ? (
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex-1 p-6 min-h-[300px]">
              <h3 className="font-black text-[#292f36] text-sm mb-1">Room Status Matrix</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-5">Live inventory breakdown</p>

              {/* Stat Pills */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Available',    count: roomStatus.availableCount,    color: 'bg-emerald-500' },
                  { label: 'Occupied',     count: roomStatus.occupiedCount,     color: 'bg-amber-500' },
                  { label: 'Maintenance',  count: roomStatus.maintenanceCount,  color: 'bg-rose-500' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${s.color} mb-2`} />
                    <p className="text-2xl font-black text-[#292f36]">{s.count}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Room List */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {roomStatus.all.map((room: any) => (
                  <div key={room.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-[#292f36] truncate max-w-[60%]">{room.name}</span>
                    <span className={cn(
                      'text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md',
                      room.status === 'AVAILABLE'   ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      room.status === 'OCCUPIED'    ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                      'bg-rose-50 text-rose-600 border border-rose-100'
                    )}>
                      {room.status}
                    </span>
                  </div>
                ))}
                {roomStatus.all.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">No rooms have been added yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col items-center justify-center p-10 text-center min-h-[300px]">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <Search size={32} />
              </div>
              <h3 className="font-black text-[#292f36]">Select Export Format</h3>
              <p className="text-xs font-medium text-gray-400 max-w-sm mt-2 leading-relaxed">
                Click 'Generate Report' above to open the export terminal. Your data will be compiled instantly into a structured CSV.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col p-8 relative">
              <button
                onClick={() => !isExporting && setShowExportModal(false)}
                className="absolute top-6 right-6 text-gray-300 hover:text-gray-600 transition-colors"
                disabled={isExporting}
              >
                <XCircle className="w-6 h-6" />
              </button>

              <h3 className="font-black text-[#292f36] text-xl mb-1">Export Settings</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">
                {selectedReport === 'food_orders' ? 'Kitchen Orders Configuration' :
                 selectedReport === 'rooms'       ? 'Room Status Configuration' :
                                                    'Guest Profile Database'}
              </p>

              <div className="space-y-4 mb-4">
                <button
                  onClick={() => handleExport('sheet')}
                  disabled={isExporting}
                  className="w-full text-left p-5 rounded-[20px] border border-gray-100 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 flex items-center gap-5 transition-all disabled:opacity-50 disabled:pointer-events-none group bg-gray-50 hover:bg-white"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg" alt="Google Sheets" className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-black text-[#292f36] text-sm group-hover:text-emerald-600 transition-colors">Google Sheets Extractor</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">{isExporting ? 'Compiling data...' : 'Connect to cloud worksheet'}</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="w-full text-left p-5 rounded-[20px] border border-gray-100 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 flex items-center gap-5 transition-all disabled:opacity-50 disabled:pointer-events-none group bg-gray-50 hover:bg-white"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg" alt="Excel" className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-black text-[#292f36] text-sm group-hover:text-blue-600 transition-colors">Excel Document (.csv)</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">{isExporting ? 'Compiling data...' : 'Download flat file'}</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
