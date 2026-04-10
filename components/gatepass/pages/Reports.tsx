'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, UserCheck, UserX, Clock, XCircle, Hash, Search } from 'lucide-react';
import { apiService } from '@/lib/gatepass/api';
import type { Visit } from '@/lib/gatepass/types';
import { toast } from 'sonner';

interface VisitAnalytics {
  totalVisits: number;
  completedVisits: number;
  cancelledVisits: number;
  pendingVisits: number;
}

export default function GuestVisitReports() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<VisitAnalytics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [allVisits, setAllVisits] = useState<Visit[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [visitCodeSearch, setVisitCodeSearch] = useState('');
  const [isVisitSpecific, setIsVisitSpecific] = useState(false);
  const [visitDayInfo, setVisitDayInfo] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const { visits: visitsData } = await apiService.getVisits({ limit: 1000 });
      setAllVisits(visitsData || []);

      const analytics: VisitAnalytics = {
        totalVisits: visitsData.length,
        completedVisits: visitsData.filter(v => v.status === 'CHECKED_IN').length,
        cancelledVisits: visitsData.filter(v => v.status === 'CANCELLED').length,
        pendingVisits: visitsData.filter(v => v.status === 'PENDING').length,
      };

      setAnalytics(analytics);
      setIsVisitSpecific(false);
      setVisitDayInfo(null);
    } catch (err) {
      console.error('Load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitCodeSearch = async () => {
    if (!visitCodeSearch.trim()) {
      loadAnalytics();
      return;
    }

    try {
      setLoading(true);
      const report = await apiService.getReportByCode(visitCodeSearch.trim());

      // Map report visitors to frontend Visit type
      const mappedVisits = report.visitors.map((v: any) => ({
        id: v.id,
        parentName: v.parentName,
        parentPhone: v.phone,
        studentName: v.studentName,
        studentId: v.studentMisId,
        visitDate: report.visitDay.date,
        purpose: report.visitDay.title,
        status: v.status,
        paymentStatus: v.payment?.status || 'PENDING',
        paymentAmount: v.payment?.amount || 0,
        visitorMembers: v.guests,
        createdAt: v.payment?.createdAt || new Date().toISOString()
      }));

      setAllVisits(mappedVisits);
      setIsVisitSpecific(true);
      setVisitDayInfo(report.visitDay);

      // Create simplified analytics for this specific visit
      const visitAnalytics: VisitAnalytics = {
        totalVisits: report.summary.total,
        completedVisits: report.summary.checkedIn,
        cancelledVisits: 0,
        pendingVisits: report.summary.pending,
      };
      setAnalytics(visitAnalytics);
    } catch (err) {
      toast.error('Visit day not found for this code');
      loadAnalytics();
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      if (isVisitSpecific && visitDayInfo) {
        await apiService.exportReport(visitDayInfo.id);
        toast.success(`Exported report for ${visitDayInfo.title}`);
      } else {
        const { visitingDays } = await apiService.getVisitingDays({ limit: 1000 });
        await apiService.exportAllReports(visitingDays);
        toast.success('Completed exporting all reports');
      }
      setShowExportModal(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#153d5d' }}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 text-sm">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#153d5d' }}>Student Visit Reports</h1>
          <p className="text-gray-600 text-xs">Track visit patterns & flag students needing attention</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Visit Code..."
              value={visitCodeSearch}
              onChange={e => setVisitCodeSearch(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleVisitCodeSearch()}
              className="pl-9 pr-8 py-1.5 border rounded text-xs focus:ring-1 focus:ring-[#153d5d] w-40"
            />
            <button
              onClick={handleVisitCodeSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#153d5d]"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-1.5 border rounded text-xs focus:ring-1 focus:ring-[#153d5d]"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {isVisitSpecific && visitDayInfo && (
        <div className="bg-[#153d5d] text-white p-4 rounded-lg flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base">{visitDayInfo.title}</h2>
              <p className="text-white/70 text-xs">
                Visit Code: <span className="font-mono">{visitDayInfo.visitCode}</span> •
                Date: {new Date(visitDayInfo.date).toLocaleDateString()} •
                Price: {visitDayInfo.pricePerPerson} RWF
              </p>
            </div>
          </div>
          <button
            onClick={() => { setVisitCodeSearch(''); loadAnalytics(); }}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Key Metrics - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Total Visits', value: analytics?.totalVisits, color: '#153d5d' },
          { icon: UserCheck, label: 'Completed', value: analytics?.completedVisits, color: 'text-green-600' },
          { icon: Clock, label: 'Pending', value: analytics?.pendingVisits, color: 'text-orange-600' },
          { icon: UserX, label: 'Cancelled', value: analytics?.cancelledVisits, color: 'text-red-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-1">
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              <span className="text-xs font-medium" style={{ color: stat.color }}>{stat.value}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-lg border p-5 mt-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" style={{ color: '#153d5d' }} />
          <h2 className="font-semibold">Export Report</h2>
        </div>

        <p className="text-gray-600 text-sm mb-5">
          Generate and export the standard visit report. The report contains a detailed log of the names of parents that came, accompanying people, and visit purposes.
        </p>

        <div className="flex justify-start">
          <button
            onClick={() => setShowExportModal(true)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 rounded text-white text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: '#153d5d' }}
          >
            <Download className="w-4 h-4" />
            {loading ? 'Loading Data...' : 'Export Report'}
          </button>
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl flex overflow-hidden">
            {/* Left side: Report display */}
            <div className="flex-1 p-6 border-r flex flex-col h-[70vh]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold" style={{ color: '#153d5d' }}>REPORT FORMAT PREVIEW</h3>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium border border-green-200">Standardized Layout</span>
              </div>
              <div className="flex-1 overflow-auto border rounded bg-gray-50 p-4">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-gray-700 font-semibold">Guest / Visitor Name</th>
                      <th className="pb-3 text-gray-700 font-semibold">Accompanying People</th>
                      <th className="pb-3 text-gray-700 font-semibold">Date & Time</th>
                      <th className="pb-3 text-gray-700 font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allVisits.filter(v => ['CHECKED_IN', 'CONFIRMED'].includes(v.status)).map(v => (
                      <tr key={v.id} className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                        <td className="py-3 font-medium text-[#153d5d]">{v.parentName}</td>
                        <td className="py-3 text-gray-600">
                          {v.visitorMembers && v.visitorMembers.length > 0
                            ? v.visitorMembers.map((m: any) => m.name).join(', ')
                            : 'None'}
                        </td>
                        <td className="py-3 text-gray-600">
                          {new Date(v.visitDate || v.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {v.visitTime ? ` · ${v.visitTime}` : ''}
                        </td>
                        <td className="py-3 text-gray-600">{v.purpose}</td>
                      </tr>
                    ))}
                    {allVisits.length === 0 && (
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
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-green-500 hover:shadow-sm flex items-center gap-4 transition-all disabled:opacity-50"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg" alt="Google Sheets" className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Download Sheet</div>
                    <div className="text-xs text-gray-500">{isExporting ? 'Generating...' : isVisitSpecific ? 'Specific day CSV' : 'Global historical CSV'}</div>
                  </div>
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-green-600 hover:shadow-sm flex items-center gap-4 transition-all disabled:opacity-50"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg" alt="Excel" className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Excel (.csv)</div>
                    <div className="text-xs text-gray-500">{isExporting ? 'Generating...' : isVisitSpecific ? 'Specific day CSV' : 'Global historical CSV'}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}