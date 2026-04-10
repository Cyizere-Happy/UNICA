'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Download, Eye, XCircle, Calendar, Plus, CreditCard, FileText, Hash } from 'lucide-react';
import { apiService } from '@/lib/gatepass/api';
import type { Visit, Student } from '@/lib/gatepass/types';
import NoData from '@/components/gatepass/NoData';
import { toast } from 'sonner';

export default function Visits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visitCodeFilter, setVisitCodeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [visitType, setVisitType] = useState<'parent' | 'outside_visitor'>('parent');
  const [newVisitRequest, setNewVisitRequest] = useState({
    parentName: '',
    parentPhone: '',
    studentId: '',
    studentName: '',
    visitDate: '',
    visitTime: '',
    purpose: '',
    notes: '',
    visitorOrganization: '',
    visitDepartment: ''
  });

  useEffect(() => {
    loadVisits();
    const interval = setInterval(loadVisits, 10000);
    return () => clearInterval(interval);
  }, [statusFilter, dateFilter, searchTerm, visitCodeFilter]);

  const parentVisits = useMemo(
    () => visits.filter((v) => (v.visitorType as any) !== 'OUTSIDE_VISITORS'),
    [visits]
  );

  const loadVisits = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (statusFilter !== 'all') params.status = statusFilter.toUpperCase();
      if (dateFilter) params.date = dateFilter;
      if (searchTerm) params.search = searchTerm;
      if (visitCodeFilter) params.visitCode = visitCodeFilter;

      const [visitsData, studentsData] = await Promise.all([
        apiService.getVisits(params),
        apiService.getStudents({ limit: 100 })
      ]);
      setVisits(visitsData.visits);
      setStudents(studentsData.students);
    } catch (error) {
      console.error('Failed to load visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualPayment = async (visitorId: string) => {
    if (!confirm('Are you sure you want to manually record payment for this visitor?')) return;
    try {
      await apiService.manualPaymentOverride(visitorId);
      await loadVisits();
    } catch (error) {
      toast.error('Failed to record manual payment');
    }
  };

  const handleResendQR = async (visitorId: string) => {
    try {
      await apiService.resendQR(visitorId);
      toast.success('QR Code resent successfully');
    } catch (error) {
      toast.error('Failed to resend QR Code');
    }
  };

  const handleOpenRequestModal = () => {
    setVisitType('parent');
    setNewVisitRequest({
      parentName: '',
      parentPhone: '',
      studentId: '',
      studentName: '',
      visitDate: '',
      visitTime: '',
      purpose: '',
      notes: '',
      visitorOrganization: '',
      visitDepartment: ''
    });
    setShowRequestModal(true);
  };

  const handleCreateVisit = async () => {
    if (!newVisitRequest.visitDate || !newVisitRequest.visitTime || !newVisitRequest.purpose) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      if (visitType === 'parent') {
        const student = students.find((s) => s.id === newVisitRequest.studentId);
        await apiService.createVisit({
          visitorType: 'parent',
          parentName: newVisitRequest.parentName,
          parentPhone: newVisitRequest.parentPhone,
          visitDate: newVisitRequest.visitDate,
          visitTime: newVisitRequest.visitTime,
          purpose: newVisitRequest.purpose,
          studentId: newVisitRequest.studentId,
          studentName: student?.name
        });
      } else {
        await apiService.createVisit({
          visitorType: 'outside_visitor',
          parentName: newVisitRequest.parentName,
          parentPhone: newVisitRequest.parentPhone,
          visitDate: newVisitRequest.visitDate,
          visitTime: newVisitRequest.visitTime,
          purpose: newVisitRequest.purpose,
          visitorOrganization: newVisitRequest.visitorOrganization,
          visitDepartment: newVisitRequest.visitDepartment
        });
      }

      setShowRequestModal(false);
      await loadVisits();
    } catch (error) {
      console.error('Failed to create visit:', error);
      toast.error('Failed to create visit. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      CHECKED_IN: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Guest Management</h1>
          <p className="text-gray-600 mt-1">View and manage all guest arrival requests</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenRequestModal}
            className="flex items-center gap-2 px-4 py-2 border border-primary-900 text-primary-900 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Visit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guest name, host, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadVisits()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="w-full md:w-48 relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Visit Code"
              value={visitCodeFilter}
              onChange={(e) => setVisitCodeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="checked-in">Checked In</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Visit ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Guest</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Host / Room</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Purpose</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parentVisits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-0">
                      <NoData
                        title="No Visits Found"
                        description="No guest arrivals have been recorded yet. Stays will appear here once guests start booking through the portal."
                        actionText="View Calendar"
                        onAction={() => console.log('View calendar clicked')}
                        variant="compact"
                      />
                    </td>
                  </tr>
                ) : (
                  parentVisits.map((visit) => (
                    <tr key={visit.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-mono text-gray-600">
                        #{visit.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{visit.parentName}</p>
                          <p className="text-xs text-gray-500">{visit.parentPhone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{visit.studentName}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900">{visit.visitDate}</p>
                          <p className="text-xs text-gray-500">{visit.visitTime}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 max-w-xs truncate">
                        {visit.purpose}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                          {visit.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${visit.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {visit.paymentAmount} RWF
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedVisit(visit)}
                            className="p-1.5 text-gray-600 hover:text-primary-900 hover:bg-primary-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {visit.status === 'PENDING' && (
                            <button
                              onClick={() => handleManualPayment(visit.id)}
                              className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                              title="Manual Payment"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          )}
                          {visit.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleResendQR(visit.id)}
                              className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Resend QR"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Visit Modal with Parent / Outside Visitor toggle */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Register Visit</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Choose the type of visit and fill in the relevant details only.
                </p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-6 pt-4">
              <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 text-xs">
                <button
                  onClick={() => setVisitType('parent')}
                  className={`px-4 py-1.5 rounded-full font-medium ${visitType === 'parent'
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-gray-500'
                    }`}
                >
                  Guest Stay
                </button>
                <button
                  onClick={() => setVisitType('outside_visitor')}
                  className={`px-4 py-1.5 rounded-full font-medium ${visitType === 'outside_visitor'
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-gray-500'
                    }`}
                >
                  Outside Visitor
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {visitType === 'parent' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lead Guest Name
                      </label>
                      <input
                        type="text"
                        value={newVisitRequest.parentName}
                        onChange={(e) =>
                          setNewVisitRequest({ ...newVisitRequest, parentName: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={newVisitRequest.parentPhone}
                        onChange={(e) =>
                          setNewVisitRequest({ ...newVisitRequest, parentPhone: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Host / Room
                      </label>
                      <select
                        value={newVisitRequest.studentId}
                        onChange={(e) =>
                          setNewVisitRequest({ ...newVisitRequest, studentId: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      >
                        <option value="">Select host/room</option>
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} - {s.class}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purpose
                      </label>
                      <input
                        type="text"
                        value={newVisitRequest.purpose}
                        onChange={(e) =>
                          setNewVisitRequest({ ...newVisitRequest, purpose: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visitor Name
                      </label>
                      <input
                        type="text"
                        value={newVisitRequest.parentName}
                        onChange={(e) =>
                          setNewVisitRequest({ ...newVisitRequest, parentName: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={newVisitRequest.visitorOrganization}
                        onChange={(e) =>
                          setNewVisitRequest({
                            ...newVisitRequest,
                            visitorOrganization: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department / Person Visited
                      </label>
                      <input
                        type="text"
                        value={newVisitRequest.visitDepartment}
                        onChange={(e) =>
                          setNewVisitRequest({
                            ...newVisitRequest,
                            visitDepartment: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={newVisitRequest.parentPhone}
                        onChange={(e) =>
                          setNewVisitRequest({ ...newVisitRequest, parentPhone: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose
                    </label>
                    <input
                      type="text"
                      value={newVisitRequest.purpose}
                      onChange={(e) =>
                        setNewVisitRequest({ ...newVisitRequest, purpose: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visit Date
                  </label>
                  <input
                    type="date"
                    value={newVisitRequest.visitDate}
                    onChange={(e) =>
                      setNewVisitRequest({ ...newVisitRequest, visitDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visit Time
                  </label>
                  <input
                    type="time"
                    value={newVisitRequest.visitTime}
                    onChange={(e) =>
                      setNewVisitRequest({ ...newVisitRequest, visitTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVisit}
                className="flex-1 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 text-sm font-medium"
              >
                Save Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Visit Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Visit ID</label>
                  <p className="text-gray-900 font-mono">#{selectedVisit.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedVisit.status)}`}>
                      {selectedVisit.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Lead Guest Name</label>
                  <p className="text-gray-900">{selectedVisit.parentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedVisit.parentPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Host / Room</label>
                  <p className="text-gray-900">{selectedVisit.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Student ID</label>
                  <p className="text-gray-900">{selectedVisit.studentId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Visit Date</label>
                  <p className="text-gray-900">{selectedVisit.visitDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Visit Time</label>
                  <p className="text-gray-900">{selectedVisit.visitTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Status</label>
                  <p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedVisit.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {selectedVisit.paymentStatus}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="text-gray-900">{selectedVisit.paymentAmount} RWF</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Purpose of Visit</label>
                  <p className="text-gray-900">{selectedVisit.purpose}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedVisit.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created At</label>
                  <p className="text-gray-900">{selectedVisit.createdAt}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedVisit(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
