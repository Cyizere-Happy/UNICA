'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Users,
    Clock,
    ChevronRight,
    X,
    History,
    Loader2,
    RefreshCw,
    XCircle,
    Hash,
    User,
    Phone,
    CreditCard
} from 'lucide-react';
import { apiService } from '@/lib/gatepass/api';
import type { Visit } from '@/lib/gatepass/types';
import NoData from '@/components/gatepass/NoData';
import { toast } from 'sonner';

const MAIN = "#4d668f";

export default function RegisteredParents() {
    const [showExportModal, setShowExportModal] = useState(false);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

    // Visit Code State
    const [visitCodeSearch, setVisitCodeSearch] = useState('');
    const [activeCode, setActiveCode] = useState('');
    const [visitDayInfo, setVisitDayInfo] = useState<any>(null);

    const loadVisits = async (code: string) => {
        if (!code) return;
        try {
            setLoading(true);
            // First try to validate/get visit day info by code
            try {
                const report = await apiService.getReportByCode(code.trim());
                setVisitDayInfo(report.visitDay);
            } catch (e) {
                setVisitDayInfo(null);
                // It might fail if the visit day code is invalid, but let's continue anyway
            }

            const { visits } = await apiService.getVisits({
                limit: 500,
                visitCode: code.trim(),
            });
            setVisits(visits);
            setActiveCode(code.trim());

            if (visits.length === 0) {
                toast.info('No registered parents found for this visit code.');
            } else {
                toast.success(`Loaded ${visits.length} registered parents.`);
            }
        } catch (error) {
            console.error('Failed to load registered parents:', error);
            toast.error('Failed to load visitors. Please check the code.');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyCode = () => {
        if (!visitCodeSearch.trim()) {
            toast.error("Please provide a valid Visit Code");
            return;
        }
        loadVisits(visitCodeSearch);
    };

    const filteredVisits = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();
        return visits.filter((visit) => {
            if (statusFilter !== 'all' && visit.status !== statusFilter) return false;
            if (!query) return true;

            // Searching specifically by Student Name as requested, plus parent name/phone
            const fields = [
                visit.studentName,
                visit.parentName,
                visit.parentPhone,
            ]
                .filter(Boolean)
                .map(f => f!.toLowerCase());

            return fields.some(field => field.includes(query));
        });
    }, [visits, searchTerm, statusFilter]);

    // Modern opacity-based badge system
    const statusConfig: Record<string, { label: string; styles: string }> = {
        PENDING: {
            label: "Pending",
            styles: "bg-[#153d5d22] text-[#153d5d] border border-[#153d5d33]",
        },
        CONFIRMED: {
            label: "Confirmed",
            styles: "bg-[#153d5d33] text-[#153d5d] border border-[#153d5d55]",
        },
        CHECKED_IN: {
            label: "Checked In",
            styles: "bg-[#153d5d44] text-[#153d5d] border border-[#153d5d66]",
        },
        CANCELLED: {
            label: "Cancelled",
            styles: "bg-[#153d5d66] text-white border border-[#153d5d66]",
        },
    };

    const getStatusStyle = (status: string) => statusConfig[status] || statusConfig.CONFIRMED;

    const handleSelectVisit = async (visit: Visit) => {
        setSelectedVisit(visit);
    };

    const closeDetails = () => {
        setSelectedVisit(null);
    };

    return (
        <>
            <div className="min-h-screen bg-transparent">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-3xl font-black text-[#292f36] tracking-tight">In-House Guests</h1>
                            <p className="mt-1 text-gray-600">
                                Track and manage parents registered for specific visiting days
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
                        </div>
                    </div>

                    {/* Visit Code Input Banner */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Hash className="w-6 h-6 text-[#153d5d]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Visit Code Required</h3>
                                <p className="text-sm text-gray-500">Please provide a visit code to view registered parents</p>
                            </div>
                        </div>

                        <div className="flex-1 w-full flex gap-3 mt-4 md:mt-0 md:justify-end">
                            <input
                                type="text"
                                placeholder="Enter Access Code (e.g., 123456)"
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
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Provide a Visit Code</h2>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Please enter a valid visit code in the banner above to load the parents who have registered for that particular visiting day.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Information Banner for active code */}
                            {visitDayInfo && (
                                <div className="bg-[#153d5d] text-white p-4 rounded-xl flex items-center justify-between mb-8 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-base">{visitDayInfo.title}</h2>
                                            <p className="text-white/70 text-sm">
                                                Date: {new Date(visitDayInfo.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-mono bg-white/10 px-3 py-1 rounded text-sm tracking-wider">{activeCode}</span>
                                </div>
                            )}

                            {/* Filters */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by guest name, host, or phone..."
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
                                                <option value="PENDING">Pending</option>
                                                <option value="CONFIRMED">Confirmed</option>
                                                <option value="CHECKED_IN">Checked In</option>
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
                                    title="No parents found"
                                    description="Try adjusting your search or check if the code is correct."
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
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                            <User className="w-3.5 h-3.5" />
                                                            {visit.parentName}
                                                        </p>
                                                        <h3 className="mt-2 text-lg font-bold text-gray-900 line-clamp-2">
                                                            Student: {visit.studentName}
                                                        </h3>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.styles}`}
                                                    >
                                                        {status.label}
                                                    </span>
                                                </div>

                                                <div className="space-y-3 text-sm text-gray-600 mt-4 pt-4 border-t border-gray-50">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-gray-400" />
                                                            <span>{visit.parentPhone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-gray-400" />
                                                            <span>{visit.visitorMembers?.length || 1} guest{(visit.visitorMembers?.length || 1) !== 1 ? 's' : ''}</span>
                                                        </div>
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
                                    Parent Visitor
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                                    {selectedVisit.parentName}
                                </h2>
                                <p className="text-gray-600 mt-1">Visiting: <span className="font-semibold">{selectedVisit.studentName}</span></p>
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
                                        { icon: Phone, label: 'Contact', value: selectedVisit.parentPhone },
                                        { icon: User, label: 'Student ID', value: selectedVisit.studentId || 'N/A' },
                                        { icon: CreditCard, label: 'Payment', value: selectedVisit.paymentStatus },
                                        {
                                            icon: null, label: 'Status', value: (
                                                <span
                                                    className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusStyle(selectedVisit.status).styles}`}
                                                >
                                                    {getStatusStyle(selectedVisit.status).label}
                                                </span>
                                            )
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-gray-50 rounded-2xl p-5">
                                            {item.icon && <item.icon className="w-5 h-5 text-gray-400 mb-2" />}
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.label}</p>
                                            <p className="mt-1 text-gray-900 font-medium">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Visitor Members */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <Users className="w-5 h-5" style={{ color: MAIN }} />
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Expected Guests ({selectedVisit.visitorMembers?.length || (selectedVisit as any).visitorCount || 1})
                                    </h3>
                                </div>

                                {selectedVisit.visitorMembers?.length ? (
                                    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-100 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-5 py-3 font-semibold text-gray-700">Name</th>
                                                    <th className="px-5 py-3 font-semibold text-gray-700">Relationship</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedVisit.visitorMembers.map((member, idx) => (
                                                    <tr key={member.id} className="border-b border-gray-100 last:border-none bg-white">
                                                        <td className="px-5 py-4 font-medium text-gray-900">{member.name}</td>
                                                        <td className="px-5 py-4 text-gray-600">{member.role || (member as any).relationship || 'Guest'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                                        <p className="text-gray-500 font-medium">No individual guest details recorded.</p>
                                        <p className="text-sm text-gray-400 mt-1">The parent registered for {(selectedVisit as any).visitorCount || 1} person(s) total.</p>
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
