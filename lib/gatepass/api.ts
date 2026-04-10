import axios from 'axios';
import type {
  Visit,
  Student,
  DashboardStats,
  VisitingDay,
} from '@/lib/gatepass/types';
import { toast } from 'sonner';

import { 
  MOCK_STATS, 
  MOCK_VISITS, 
  MOCK_VISITING_DAYS, 
  MOCK_STUDENTS 
} from './mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const MOCK_MODE = true; // Set to true for UI-only testing

const api = axios.create({
  baseURL: API_URL,
});

// ... (interceptors remain for potential live use)

export const apiService = {
  get: (url: string, config?: object) => api.get(url, config),
  post: (url: string, data?: unknown, config?: object) => api.post(url, data, config),
  put: (url: string, data?: unknown, config?: object) => api.put(url, data, config),
  patch: (url: string, data?: unknown, config?: object) => api.patch(url, data, config),
  delete: (url: string, config?: object) => api.delete(url, config),

  async login(credentials: { email: string; password: string }) {
    if (MOCK_MODE) {
      const mockUser = {
        name: 'UNICA Admin',
        email: credentials.email,
        role: 'ADMIN'
      };
      localStorage.setItem('token', 'mock-token-123');
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { accessToken: 'mock-token-123', user: mockUser };
    }
    const { data } = await api.post('/auth/login', credentials);
    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(userData: Record<string, unknown>) {
    if (MOCK_MODE) return { message: "Account created successfully" };
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getDashboardStats(): Promise<DashboardStats> {
    if (MOCK_MODE) return MOCK_STATS;
    try {
      const { data } = await api.get('/reports/dashboard-stats');
      return data;
    } catch (e) {
      console.error('Failed to fetch dashboard stats:', e);
      return MOCK_STATS;
    }
  },

  async getVisits(params?: Record<string, unknown>): Promise<{ visits: Visit[]; total: number }> {
    if (MOCK_MODE) return { visits: MOCK_VISITS, total: MOCK_VISITS.length };
    try {
      const { data } = await api.get('/visitors', { params });
      const visits = data.visitors.map((v: Record<string, unknown>) => ({
        id: v.id,
        parentName: v.parentName,
        parentPhone: v.phone,
        studentName: v.studentName,
        studentId: v.studentMisId,
        visitDate: new Date(v.createdAt as string).toLocaleDateString(),
        visitTime: new Date(v.createdAt as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        purpose: (v.visitDay as { title?: string })?.title || 'Visitation',
        status: v.status,
        paymentStatus: (v.payment as { status?: string })?.status || 'PENDING',
        paymentAmount: (v.payment as { amount?: number })?.amount || 0,
        transactionId: (v.payment as { transactionId?: string })?.transactionId || '',
        createdAt: v.createdAt,
        visitorMembers: v.guests,
        visitDayId: v.visitDayId,
        institution: v.institution,
        email: v.email,
        visitorType: (v.visitDay as { audience?: string })?.audience,
        visitCode: (v.visitDay as { visitCode?: string })?.visitCode
      }));
      return { visits, total: data.total };
    } catch (e) {
      console.error('Failed to fetch visits:', e);
      return { visits: MOCK_VISITS, total: MOCK_VISITS.length };
    }
  },

  async getStudents(params?: Record<string, unknown>): Promise<{ students: Student[]; total: number }> {
    if (MOCK_MODE) return { students: MOCK_STUDENTS, total: MOCK_STUDENTS.length };
    try {
      const { data } = await api.get('/students', { params });
      return { students: data.students, total: data.total };
    } catch {
      return { students: MOCK_STUDENTS, total: MOCK_STUDENTS.length };
    }
  },

  async createVisit(data: Record<string, unknown>): Promise<Visit> {
    if (MOCK_MODE) return MOCK_VISITS[0];
    const { data: response } = await api.post('/visitors/register', data);
    return response;
  },

  async getVisitingDays(params?: Record<string, unknown>): Promise<{ visitingDays: VisitingDay[]; total: number }> {
    if (MOCK_MODE) return { visitingDays: MOCK_VISITING_DAYS, total: MOCK_VISITING_DAYS.length };
    const { data } = await api.get('/visit-days', { params });
    const visitingDays = data.map((d: Record<string, unknown>) => ({
      id: d.id,
      date: d.date,
      startTime: d.startTime || '08:00',
      endTime: d.endTime || '17:00',
      location: d.location || 'Main Campus',
      maxVisitors: 100,
      currentVisitors: (d._count as { visitors?: number })?.visitors || 0,
      status: d.status,
      createdAt: d.createdAt,
      audience: d.audience,
      visitCode: d.visitCode,
      title: d.title,
      pricePerPerson: d.pricePerPerson
    }));
    return { visitingDays, total: visitingDays.length };
  },

  async createVisitingDay(data: Record<string, unknown>): Promise<VisitingDay> {
    if (MOCK_MODE) return MOCK_VISITING_DAYS[0];
    const payload = {
      title: data.title,
      date: data.date,
      pricePerPerson: data.pricePerPerson,
      audience: data.audience,
      status: 'OPEN',
      location: data.location || 'Main Campus',
      startTime: data.startTime,
      endTime: data.endTime
    };
    const { data: response } = await api.post('/visit-days', payload);
    return response;
  },

  async duplicateVisitingDay(id: string): Promise<VisitingDay> {
    if (MOCK_MODE) return MOCK_VISITING_DAYS[0];
    const { data } = await api.post(`/visit-days/${id}/duplicate`);
    return data;
  },

  async updateVisitingDay(id: string, data: Record<string, unknown>): Promise<VisitingDay> {
    if (MOCK_MODE) return MOCK_VISITING_DAYS[0];
    const { data: response } = await api.put(`/visit-days/${id}`, data);
    return response;
  },

  async deleteVisitingDay(id: string): Promise<unknown> {
    if (MOCK_MODE) return { message: "Deleted" };
    const { data } = await api.delete(`/visit-days/${id}`);
    return data;
  },

  async updateVisitorStatus(id: string, status: string): Promise<unknown> {
    if (MOCK_MODE) return { message: "Status updated" };
    const { data } = await api.patch(`/visitors/${id}/status`, { status });
    return data;
  },

  async processPayment(visitorId: string, amount: number): Promise<unknown> {
    if (MOCK_MODE) return { message: "Paid" };
    const { data } = await api.post(`/payments/${visitorId}/pay`, { amount });
    return data;
  },

  async manualPaymentOverride(visitorId: string): Promise<unknown> {
    const { data } = await api.post(`/payments/${visitorId}/override`);
    return data;
  },

  async resendQR(visitorId: string): Promise<unknown> {
    const { data } = await api.post(`/payments/${visitorId}/resend`);
    return data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- normalized visitor payload from API
  async checkIn(verificationCode: string): Promise<any> {
    if (MOCK_MODE) return { success: true, visitor: MOCK_VISITS[0] };
    const { data } = await api.post('/security/checkin', { verificationCode });
    if (data.visitor) {
      const v = data.visitor as Record<string, unknown>;
      data.visitor = {
        ...v,
        visitDate: new Date().toLocaleDateString(),
        visitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        purpose: v.visitDay || 'Visitation',
        visitorMembers: v.guests,
        checkedInAt: data.checkedInAt
      };
    }
    return data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors GatePass backend shape
  async getReportByCode(visitCode: string): Promise<any> {
    if (MOCK_MODE) return { visits: MOCK_VISITS };
    const { data } = await api.get(`/reports/visit-day/code/${visitCode}`);
    return data;
  },

  async exportReport(visitDayId: string): Promise<void> {
    const { data } = await api.get(`/reports/visit-day/${visitDayId}/csv`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `visit-report-${visitDayId}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async exportAllReports(visitingDays: VisitingDay[]): Promise<void> {
    toast.info(`Preparing to export ${visitingDays.length} reports...`);
    for (const day of visitingDays) {
      await this.exportReport(day.id);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  },

  async registerVisitor(data: Record<string, unknown>) {
    if (MOCK_MODE) return { success: true };
    const payload = {
      parentName: data.parentName,
      phone: data.phoneNumber,
      nationalId: data.nationalId,
      relationship: data.relationship === 'Other' || data.relationship === 'Autre' || data.relationship === 'Undi'
        ? data.relationshipOther
        : data.relationship,
      visitorCount: data.visitorCount,
      studentName: data.studentNames ? (data.studentNames as string[]).filter((n: string) => !!n).join(', ') : undefined,
      visitCode: data.visitCode || '123456',
      institution: data.institution,
      email: data.email,
    };
    const { data: response } = await api.post('/visitors/register', payload);
    return response;
  },

  async getVisitorPass(id: string) {
    const { data } = await api.get(`/visitors/${id}/qr`);
    return data;
  },

  async getVisitorDetail(id: string) {
    if (MOCK_MODE) return MOCK_VISITS[0];
    const { data } = await api.get(`/visitors/${id}`);
    return data;
  },

  async validateVisitCode(code: string) {
    if (MOCK_MODE) return { valid: true };
    const { data } = await api.get(`/visit-days/validate/${code}`);
    return data;
  },

  async getVisitorHistory(_organizationName: string): Promise<Visit[]> {
    return MOCK_VISITS;
  }
};

