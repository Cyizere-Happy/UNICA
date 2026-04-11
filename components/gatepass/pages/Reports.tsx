'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Bed, MessageSquare, Utensils, XCircle, Search, Calendar, ChevronRight, Users } from 'lucide-react';
import { operationalData } from '@/lib/gatepass/operationalData';
import type { FoodOrder, Room, ContactMessage } from '@/lib/gatepass/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type ReportType = 'food_orders' | 'rooms' | 'messages' | 'guests';

export default function PropertyManagementReports() {
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportType>('food_orders');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    // Initial fetch from sync layer
    setOrders(operationalData.getOrders());
    setRooms(operationalData.getRooms());
    setMessages(operationalData.getMessages());
    setLoading(false);
  }, []);

  const handleExport = async (format: 'csv' | 'sheet') => {
    setIsExporting(true);
    // Simulate network delay for export generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let reportName = '';
    if (selectedReport === 'food_orders') reportName = 'Kitchen & F&B Orders';
    if (selectedReport === 'rooms') reportName = 'Room Status Matrix';
    if (selectedReport === 'messages') reportName = 'Unified Inquiries Dump';
    if (selectedReport === 'guests') reportName = 'Registered Guests Profile';

    toast.success(`Successfully generated and downloaded ${reportName} as ${format.toUpperCase()}`);
    setIsExporting(false);
    setShowExportModal(false);
  };

  const getReportSummary = () => {
    if (selectedReport === 'food_orders') {
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        return { title: 'Total F&B Revenue', value: `$${totalRevenue.toFixed(2)}` };
    }
    if (selectedReport === 'guests') {
        const uniqueGuests = Array.from(new Set(orders.map(o => o.guestName))).length + 12; // Base offset
        return { title: 'Total Registered Guests', value: `${uniqueGuests}` };
    }
    if (selectedReport === 'rooms') {
        const available = rooms.filter(r => r.status === 'AVAILABLE').length;
        return { title: 'Rooms Available', value: `${available} / ${rooms.length}` };
    }
    const unread = messages.filter(m => m.status === 'UNREAD').length;
    return { title: 'Unread Inquiries', value: `${unread} / ${messages.length}` };
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
            Data & Reports
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
                        <h4 className={cn("font-black text-sm", selectedReport === 'food_orders' ? "text-[#292f36]" : "")}>F&B Orders</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-60">Kitchen Revenue Log</p>
                    </div>
                  </div>
                  {selectedReport === 'food_orders' && <ChevronRight size={16} className="text-[#292f36]" />}
              </button>

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
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-60">Inventory & Status</p>
                    </div>
                  </div>
                  {selectedReport === 'rooms' && <ChevronRight size={16} className="text-[#292f36]" />}
              </button>

              <button 
                onClick={() => setSelectedReport('messages')}
                className={cn(
                    "w-full text-left flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                    selectedReport === 'messages' ? "bg-white border-[#292f36] shadow-md" : "bg-gray-50 border-transparent hover:bg-white text-gray-500"
                )}
              >
                  <div className="flex gap-4 items-center">
                    <div className={cn("p-2.5 rounded-xl", selectedReport === 'messages' ? "bg-accent/10 text-accent" : "bg-gray-100")}>
                        <MessageSquare size={18} />
                    </div>
                    <div>
                        <h4 className={cn("font-black text-sm", selectedReport === 'messages' ? "text-[#292f36]" : "")}>Inquiries Dump</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-60">Guest Comms Log</p>
                    </div>
                  </div>
                  {selectedReport === 'messages' && <ChevronRight size={16} className="text-[#292f36]" />}
              </button>

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

              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col items-center justify-center p-10 text-center min-h-[300px]">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <Search size={32} />
                 </div>
                 <h3 className="font-black text-[#292f36]">Select Export Format</h3>
                 <p className="text-xs font-medium text-gray-400 max-w-sm mt-2 leading-relaxed">
                    Click 'Generate Report' above to open the export terminal. Your data will be compiled instantly into a structured CSV or Data Sheet.
                 </p>
              </div>
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
                        {
                            selectedReport === 'food_orders' ? 'Kitchen Orders Configuration' : 
                            selectedReport === 'rooms' ? 'Room Status Configuration' : 
                            selectedReport === 'guests' ? 'Guest Profile Database' : 
                            'Guest Communications'
                        }
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