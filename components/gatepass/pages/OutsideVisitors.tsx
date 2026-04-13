'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Users,
  Building2,
  Clock,
  ChevronRight,
  X,
  History,
  Loader2,
  RefreshCw,
  XCircle,
  Hash
} from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import type { Visit } from '@/lib/gatepass/types';
import NoData from '@/components/gatepass/NoData';
import { toast } from 'sonner';

const MAIN = "#153d5d";

export default function OutsideVisitors() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [history, setHistory] = useState<Visit[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Visit Code State
  const [visitCodeSearch, setVisitCodeSearch] = useState('');
  const [activeCode, setActiveCode] = useState('');

  const loadVisits = async (code: string) => {
    if (!code) return;
    try {
      setLoading(true);
      const { visits } = await apiService.getVisits({
        limit: 200,
        stayCode: code.trim()
      });
      setVisits(visits);
      setActiveCode(code.trim());
    } catch (error) {
      console.error('Failed to load outside visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCode = () => {
    if (!visitCodeSearch.trim()) return;
    loadVisits(visitCodeSearch);
  };

  const filteredVisits = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return visits.filter((visit) => {
      if (statusFilter !== 'all' && visit.status !== statusFilter) return false;
      if (!query) return true;

      const fields = [
        visit.guestName,
        visit.guestPhone,
        visit.purpose,
        visit.institution,
        ...(visit.visitorMembers?.map(m => m.name + ' ' + m.role) || []),
      ]
        .filter(Boolean)
        .map(f => f!.toLowerCase());

      return fields.some(field => field.includes(query));
    });
  }, [visits, searchTerm, statusFilter]);

  // Modern opacity-based badge system
  const statusConfig: Record<string, { label: string; styles: string }> = {
    pending: {
      label: "Pending",
      styles: "bg-[#153d5d22] text-[#153d5d] border border-[#153d5d33]",
    },
    approved: {
      label: "Approved",
      styles: "bg-[#153d5d33] text-[#153d5d] border border-[#153d5d55]",
    },
    "checked-in": {
      label: "Checked In",
      styles: "bg-[#153d5d44] text-[#153d5d] border border-[#153d5d66]",
    },
    completed: {
      label: "Completed",
      styles: "bg-[#153d5d11] text-[#153d5d] border border-[#153d5d22]",
    },
    cancelled: {
      label: "Cancelled",
      styles: "bg-[#153d5d66] text-white border border-[#153d5d66]",
    },
  };

  const getStatusStyle = (status: string) => statusConfig[status] || statusConfig.completed;

  const handleSelectVisit = async (visit: Visit) => {
    setSelectedVisit(visit);
    if (!visit.institution) {
      setHistory([]);
      return;
    }

    setHistoryLoading(true);
    try {
      const pastVisits = await apiService.getVisitorHistory(visit.institution);
      setHistory(pastVisits.filter((v: Visit) => v.id !== visit.id));
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedVisit(null);
    setHistory([]);
  };

  return (
    <>
      <div className="min-h-screen bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#153d5d]">Temporary Visitors</h1>
              <p className="mt-1 text-gray-600">
                Track and manage all external organizations and teams visiting campus
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => activeCode && loadVisits(activeCode)}
                disabled={!activeCode}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-medium transition shadow-sm"
                style={{ backgroundColor: MAIN }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0f2c43"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = MAIN}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Visit Code Input Banner */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Hash className="w-6 h-6 text-[#153d5d]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Access Code Required</h3>
                <p className="text-sm text-gray-500">Provide the specific code for outside visitors</p>
              </div>
            </div>

            <div className="flex-1 w-full flex gap-3 mt-4 md:mt-0 md:justify-end">
              <input
                type="text"
                placeholder="Enter Code..."
                value={visitCodeSearch}
                onChange={(e) => setVisitCodeSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCode()}
                className="w-full md:w-64 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153d5d] transition font-mono"
              />
              <button
                onClick={handleApplyCode}
                className="px-6 py-3 text-white rounded-xl text-sm font-medium transition shadow-sm"
                style={{ backgroundColor: MAIN }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0f2c43"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = MAIN}
              >
                Load
              </button>
            </div>
          </div>

          {!activeCode ? (
            <div className="bg-white/50 backdrop-blur rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#153d5d]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Provide the Outside Visitor Code</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Please enter the specific code for outside visitors to load their records.
              </p>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by organization, visitor, purpose..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153d5d] transition"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="relative">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153d5d] appearance-none cursor-pointer transition"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="checked-in">Checked In</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards */}
              {loading ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="w-10 h-10 text-[#153d5d] animate-spin" />
                </div>
              ) : filteredVisits.length === 0 ? (
                <NoData
                  title="No visitors found"
                  description="Try adjusting your search or filters."
                  variant="compact"
                />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredVisits.map((visit) => {
                    const status = getStatusStyle(visit.status);
                    return (
                      <button
                        key={visit.id}
                        onClick={() => handleSelectVisit(visit)}
                        className="group bg-white rounded-2xl border border-gray-200 p-6 text-left hover:border-[#153d5d] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              {visit.institution || 'Independent Visitor'}
                            </p>
                            <h3 className="mt-1 text-lg font-bold text-gray-900 line-clamp-2">
                              {visit.purpose}
                            </h3>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${status.styles}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{visit.guestName}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{visit.visitDate} at {visit.visitTime}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{visit.visitorMembers?.length || 1} visitor{visit.visitorMembers?.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <div
                          className="mt-5 flex items-center gap-2 font-medium text-sm group-hover:gap-3 transition-all"
                          style={{ color: MAIN }}
                        >
                          <span>View details</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Organization
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {selectedVisit.institution || selectedVisit.guestName}
                </h2>
                <p className="text-gray-600 mt-1">{selectedVisit.purpose}</p>
              </div>
              <button
                onClick={closeDetails}
                className="p-3 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-8">

              {/* Visit Details */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Clock, label: 'Date & Time', value: `${selectedVisit.visitDate} · ${selectedVisit.visitTime}` },
                    { icon: Building2, label: 'Host', value: selectedVisit.guestName, sub: selectedVisit.guestPhone },
                    {
                      icon: null, label: 'Status', value: (
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusStyle(selectedVisit.status).styles}`}
                        >
                          {getStatusStyle(selectedVisit.status).label}
                        </span>
                      )
                    },
                    { icon: null, label: 'Notes', value: selectedVisit.visitNotes || <span className="text-gray-400 italic">No notes added</span> },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl p-5">
                      {item.icon && <item.icon className="w-5 h-5 text-gray-400 mb-2" />}
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.label}</p>
                      <p className="mt-1 text-gray-900 font-medium">{item.value}</p>
                      {item.sub && <p className="text-sm text-gray-600 mt-1">{item.sub}</p>}
                    </div>
                  ))}
                </div>
              </section>

              {/* Visitor Members */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5" style={{ color: MAIN }} />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Visitors ({selectedVisit.visitorMembers?.length || 0})
                  </h3>
                </div>

                {selectedVisit.visitorMembers?.length ? (
                  <div className="bg-gray-50 rounded-2xl overflow-hidden">
                    {selectedVisit.visitorMembers.map((member, idx) => (
                      <div
                        key={member.id}
                        className={`p-5 ${idx !== 0 ? 'border-t border-gray-200' : ''}`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-gray-700">{member.contact}</p>
                            {member.notes && <p className="text-gray-500 text-xs mt-1">{member.notes}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No individual visitor details recorded.</p>
                )}
              </section>

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
                              <th className="pb-3 text-gray-700 font-semibold">Description</th>
                              <th className="pb-3 text-gray-700 font-semibold">Date & Time</th>
                              <th className="pb-3 text-gray-700 font-semibold">Location</th>
                              <th className="pb-3 text-gray-700 font-semibold">Visitors / Capacity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visits.map(v => (
                              <tr
                                key={v.id}
                                className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors"
                              >
                                <td className="py-3 font-medium text-[#153d5d]">
                                  {v.purpose}
                                </td>

                                <td className="py-3 text-gray-600">
                                  {new Date(v.visitDate).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                  {` · ${v.visitTime}`}
                                </td>

                                <td className="py-3 text-gray-600">
                                  {v.institution || "Independent Visitor"}
                                </td>

                                <td className="py-3 text-gray-600">
                                  {v.visitorMembers?.length || 1} visitor
                                  {v.visitorMembers?.length !== 1 ? "s" : ""}
                                </td>
                              </tr>
                            ))}

                            {visits.length === 0 && (
                              <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500">
                                  No report data available for preview.
                                </td>
                              </tr>
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
                          onClick={() => { toast.success('Exporting as Google Sheet...'); setShowExportModal(false); }}
                          className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-green-500 hover:shadow-sm flex items-center gap-4 transition-all"
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg" alt="Google Sheets" className="w-8 h-8" />
                          <div>
                            <div className="font-bold text-gray-800 text-sm">Google Sheets</div>
                            <div className="text-xs text-gray-500">Open in browser</div>
                          </div>
                        </button>
                        <button
                          onClick={() => { toast.success('Downloading as Excel (.xlsx)...'); setShowExportModal(false); }}
                          className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-green-600 hover:shadow-sm flex items-center gap-4 transition-all"
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg" alt="Excel" className="w-8 h-8" />
                          <div>
                            <div className="font-bold text-gray-800 text-sm">Excel (.xlsx)</div>
                            <div className="text-xs text-gray-500">Download file</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* History */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <History className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Previous Visits</h3>
                  {historyLoading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
                </div>

                {history.length === 0 ? (
                  <p className="text-gray-500 italic">
                    {historyLoading ? 'Loading history...' : 'No previous visits from this organization.'}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {history.map((v) => (
                      <div
                        key={v.id}
                        className="bg-gray-50 rounded-2xl p-5 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{v.purpose}</p>
                          <p className="text-sm text-gray-600">{v.visitDate} · {v.visitTime}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(v.status).styles}`}>
                          {getStatusStyle(v.status).label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          </div>
        </div>
      )}

    </>
  );
}
