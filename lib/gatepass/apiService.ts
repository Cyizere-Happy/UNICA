import api from './api';
import { Room, FoodItem, FoodOrder, BookingRequest, StayRecord, GuestProfile, DashboardStats, Visit, VisitingDay } from './types';

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

export const apiService = {
  // Rooms
  getRooms: async (): Promise<Room[]> => {
    const { data } = await api.get('/rooms');
    return data.map((room: any) => ({
      ...room,
      price: Number(room.price)
    }));
  },
  getRoom: async (id: string): Promise<Room> => {
    const { data } = await api.get(`/rooms/${id}`);
    return {
      ...data,
      price: Number(data.price)
    };
  },
  createRoom: async (room: Partial<Room>): Promise<Room> => {
    const { data } = await api.post('/rooms', room);
    return data;
  },
  updateRoom: async (id: string, room: Partial<Room>): Promise<Room> => {
    const { id: _, ...payload } = room as any;
    const { data } = await api.patch(`/rooms/${id}`, payload);
    return data;
  },
  deleteRoom: async (id: string): Promise<void> => {
    await api.delete(`/rooms/${id}`);
  },
  getRoomStatus: async (): Promise<any> => {
    const { data } = await api.get('/rooms/status');
    return data;
  },

  // Messages
  getMessages: async (): Promise<any[]> => {
    const { data } = await api.get('/messages');
    return data;
  },
  sendMessage: async (message: any): Promise<any> => {
    const { data } = await api.post('/messages', message);
    return data;
  },
  markMessageRead: async (id: string): Promise<any> => {
    const { data } = await api.patch(`/messages/${id}/read`);
    return data;
  },
  replyToMessage: async (id: string, content: string): Promise<any> => {
    const { data } = await api.post(`/messages/${id}/reply`, { content });
    return data;
  },
  deleteMessage: async (id: string): Promise<void> => {
    await api.delete(`/messages/${id}`);
  },

  // Menu
  getMenu: async (): Promise<FoodItem[]> => {
    const { data } = await api.get('/menu');
    return data.map((item: any) => ({
      ...item,
      meal: item.category, // Map backend 'category' to frontend 'meal'
      price: Number(item.price)
    }));
  },
  createMenuItem: async (item: Partial<FoodItem>): Promise<FoodItem> => {
    const { data } = await api.post('/menu', item);
    return data;
  },
  updateMenuItem: async (id: string, item: Partial<FoodItem>): Promise<FoodItem> => {
    const { id: _, ...payload } = item as any;
    const { data } = await api.patch(`/menu/${id}`, payload);
    return data;
  },
  deleteMenuItem: async (id: string): Promise<void> => {
    await api.delete(`/menu/${id}`);
  },

  // Bookings
  getBookings: async (): Promise<BookingRequest[]> => {
    const { data } = await api.get('/bookings');
    return data;
  },
  createBooking: async (booking: Partial<BookingRequest>): Promise<BookingRequest> => {
    const { data } = await api.post('/bookings', booking);
    return data;
  },
  updateBookingStatus: async (id: string, status: string, stayCode?: string): Promise<BookingRequest> => {
    const { data } = await api.patch(`/bookings/${id}/status`, { status, stayCode });
    return data;
  },

  // Stays
  getStays: async (): Promise<StayRecord[]> => {
    const { data } = await api.get('/stays');
    return data.map((s: any) => ({
      ...s,
      guestName: s.guest?.name || 'Unknown Guest',
      roomName: s.room?.name || 'Unknown Room',
      roomType: s.room?.type || 'room',
      checkIn: s.checkInAt,
      checkOut: s.actualCheckOutAt,
      expectedCheckOutAt: s.expectedCheckOutAt,
      status: s.status === 'ACTIVE' ? 'CHECKED_IN' : 'CHECKED_OUT',
      totalAmount: Number(s.billingAmount || 0)
    }));
  },
  checkIn: async (details: any): Promise<any> => {
    const { data } = await api.post('/stays/checkin', details);
    return data;
  },
  checkOut: async (id: string): Promise<StayRecord> => {
    const { data } = await api.post(`/stays/${id}/check-out`);
    return data;
  },

  // Guests
  getGuests: async (): Promise<GuestProfile[]> => {
    const { data } = await api.get('/guests');
    return data;
  },
  addGuest: async (guest: Partial<GuestProfile>): Promise<GuestProfile> => {
    const { data } = await api.post('/guests', guest);
    return data;
  },
  updateGuest: async (id: string, guest: Partial<GuestProfile>): Promise<GuestProfile> => {
    const { data } = await api.patch(`/guests/${id}`, guest);
    return data;
  },

  // Orders
  getAllOrders: async (): Promise<FoodOrder[]> => {
    const { data } = await api.get('/orders');
    return data.map((order: any) => ({
      ...order,
      guestName: order.guest?.name || 'Unknown Guest',
      roomNumber: order.room?.name || 'No Room',
      totalAmount: Number(order.totalAmount || 0),
      orderTime: order.orderTime,
      items: order.items.map((i: any) => ({
        ...i,
        itemId: i.menuItemId,
        price: Number(i.priceAtOrder)
      }))
    }));
  },
  getOrders: async (): Promise<FoodOrder[]> => {
    const { data } = await api.get('/orders/active');
    return data.map((order: any) => ({
      ...order,
      guestName: order.guest?.name || 'Unknown Guest',
      roomNumber: order.room?.name || 'No Room',
      totalAmount: Number(order.totalAmount || 0),
      orderTime: order.orderTime, // Keep raw ISO string for reliable parsing
      items: order.items.map((i: any) => ({
        ...i,
        itemId: i.menuItemId, // Bridge backend 'menuItemId' to frontend 'itemId'
        price: Number(i.priceAtOrder) // Use captured price at time of order
      }))
    }));
  },
  getMyOrders: async (): Promise<FoodOrder[]> => {
    const { data } = await api.get('/orders/me');
    return data.map((order: any) => ({
      ...order,
      guestName: order.guest?.name || 'Me',
      roomNumber: order.room?.name || 'My Room',
      totalAmount: Number(order.totalAmount || 0),
      orderTime: order.orderTime,
      items: order.items.map((i: any) => ({
        ...i,
        itemId: i.menuItemId,
        price: Number(i.priceAtOrder)
      }))
    }));
  },
  createOrder: async (order: Partial<FoodOrder>): Promise<FoodOrder> => {
    const { data } = await api.post('/orders', order);
    return data;
  },
  updateOrderStatus: async (id: string, status: string): Promise<FoodOrder> => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },
  confirmOrderReceipt: async (id: string): Promise<FoodOrder> => {
    const { data } = await api.patch(`/orders/${id}/confirm`);
    return data;
  },
  submitOrderFeedback: async (id: string, rating: number, testimonial?: string): Promise<FoodOrder> => {
    const { data } = await api.patch(`/orders/${id}/feedback`, { rating, testimonial });
    return data;
  },

  // Cleaning Service Requests
  getCleaningRequests: async (): Promise<any[]> => {
    const { data } = await api.get('/service-requests');
    return data;
  },
  createCleaningRequest: async (request: any): Promise<any> => {
    const { data } = await api.post('/service-requests', request);
    return data;
  },
  updateCleaningStatus: async (id: string, status: string): Promise<any> => {
    const { data } = await api.patch(`/service-requests/${id}/status`, { status });
    return data;
  },

  // Auth
  verifyGuest: async (stayCode: string): Promise<any> => {
    const { data } = await api.post('/auth/guest-verify', { stayCode });
    return data;
  },
  registerGuestProfile: async (details: any): Promise<any> => {
    const { data } = await api.post('/auth/guest-register', details);
    return data;
  },
  login: async (credentials: any): Promise<any> => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.access_token) localStorage.setItem('token', data.access_token);
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },
  register: async (details: any, token?: string): Promise<any> => {
    const { data } = await api.post('/auth/register', { 
      token, 
      fullName: details.name,
      username: details.email, // Using email as username for simplicity
      passwordPlain: details.password 
    });
    return data;
  },
  validateInvitation: async (token: string): Promise<any> => {
    const { data } = await api.get(`/staff/invitation/${token}`);
    return data;
  },
  // Staff Management
  getStaffMembers: async (): Promise<any[]> => {
    const { data } = await api.get('/staff');
    return data;
  },
  getPendingInvitations: async (): Promise<any[]> => {
    const { data } = await api.get('/staff/invitations');
    return data;
  },
  inviteStaff: async (email: string, role: string): Promise<any> => {
    const { data } = await api.post('/staff/invite', { email, role });
    return data;
  },
  deactivateStaff: async (id: string): Promise<any> => {
    const { data } = await api.delete(`/staff/${id}/deactivate`);
    return data;
  },
  updateStaffRole: async (id: string, role: string): Promise<any> => {
    const { data } = await api.patch(`/staff/${id}/role`, { role });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/management/admin';
  },
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await api.get('/auth/profile');
    return data;
  },

  // File Upload
  uploadImage: async (file: File, category: 'rooms' | 'food'): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await api.post(`/upload/image/${category}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Analytics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/analytics/highlights');
    return {
      totalVisitsToday: data.totalStaysToday ?? 0,
      activeVisitors: data.activeStays ?? 0,
      totalGuests: data.totalGuests ?? 0,
      visitsThisMonth: data.staysThisMonth ?? 0,
      pendingApprovals: data.pendingBookings ?? 0,
      completedVisitsToday: data.checkOutsToday ?? 0,
      cancelledVisitsToday: 0,
      guestsStayedToday: data.totalStaysToday ?? 0,
      vacantRooms: data.availableRooms ?? 0,
      pendingSecurityCount: 0,
      pendingOrders: data.pendingOrders ?? 0,
      totalBookings: data.totalBookings ?? 0,
      approvedBookings: data.approvedBookings ?? 0,
      availableRooms: data.availableRooms ?? 0,
      revenueToday: data.revenueToday ?? 0,
      topDish: data.topDish ?? 'N/A',
      summaryItems: [
        { title: 'In-House Guests', count: `${data.activeStays ?? 0} Active`, color: 'bg-emerald-500' },
        { title: 'New Arrivals', count: `${data.totalStaysToday ?? 0} Today`, color: 'bg-blue-500' },
        { title: 'Pending Orders', count: `${data.pendingOrders ?? 0} Orders`, color: 'bg-amber-500' },
        { title: 'Revenue (24h)', count: `$${data.revenueToday ?? 0}`, color: 'bg-[#292f36]' }
      ]
    };
  },
  getVisits: async (params?: { limit?: number; stayCode?: string; search?: string }): Promise<{ visits: Visit[] }> => {
    // Map stays to visits for the dashboard view
    const { data } = await api.get('/stays', { params });
    const visits: Visit[] = data.map((stay: StayRecord) => ({
      id: stay.id,
      guestName: stay.guestName,
      roomName: stay.roomName,
      purpose: 'Guest Stay',
      status: stay.status === 'CHECKED_IN' ? 'CHECKED_IN' : 'CONFIRMED',
      createdAt: stay.checkIn,
      visitTime: new Date(stay.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    return { visits };
  },
  createVisit: async (visit: any): Promise<Visit> => {
    const { data } = await api.post('/stays/visit', visit);
    return data;
  },
  resendQR: async (id: string): Promise<any> => {
    const { data } = await api.post(`/stays/visit/${id}/resend-qr`);
    return data;
  },

  getVisitorHistory: async (institution: string): Promise<Visit[]> => {
    // Return empty history for now to fix build, as our 'Stay' model doesn't track institutions yet
    return [];
  },
  // Visiting Days
  getVisitingDays: async (params?: any): Promise<{ visitingDays: VisitingDay[] }> => {
    const { data } = await api.get('/visiting-days', { params });
    return { visitingDays: data };
  },
  createVisitingDay: async (day: Partial<VisitingDay>): Promise<VisitingDay> => {
    const { data } = await api.post('/visiting-days', day);
    return data;
  },
  updateVisitingDay: async (id: string, day: Partial<VisitingDay>): Promise<VisitingDay> => {
    const { data } = await api.patch(`/visiting-days/${id}`, day);
    return data;
  },
  deleteVisitingDay: async (id: string): Promise<void> => {
    await api.delete(`/visiting-days/${id}`);
  },
  registerVisitor: async (payload: any): Promise<any> => {
    const { data } = await api.post('/visiting-days/register', payload);
    return data;
  },
  // Security Staff (Compatibility layer - keep for now if used by other modules)


  getSecurityStaff: async (): Promise<any[]> => {
    const { data } = await api.get('/users/security');
    return data;
  },
  approveUser: async (id: string): Promise<any> => {
    const { data } = await api.patch(`/users/${id}/approve`, {});
    return data;
  },
  deleteSecurityStaff: async (id: string): Promise<any> => {
    const { data } = await api.delete(`/users/${id}/security`);
    return data;
  },

  exportReport: async (id: string): Promise<any> => {
    return { success: true };
  },
  exportAllReports: async (data: any): Promise<any> => {
    return { success: true };
  },
  manualPaymentOverride: async (id: string): Promise<any> => {
    return { success: true };
  },

  // Cleaning / Service Requests
  getMyCleaningRequests: async (): Promise<any[]> => {
    const { data } = await api.get('/service-requests/me');
    return data;
  },
  requestService: async (payload: { type: string; notes?: string }): Promise<any> => {
    const { data } = await api.post('/service-requests', payload);
    return data;
  },

  // Final Billing & Payments
  getStayBalance: async (id: string): Promise<any> => {
    const { data } = await api.get(`/stays/${id}/balance`);
    return data;
  },
  recordPayment: async (id: string, amount: number, method: string): Promise<any> => {
    const { data } = await api.patch(`/stays/${id}/payment`, { amount, method });
    return data;
  },
  confirmPayment: async (id: string): Promise<any> => {
    const { data } = await api.post(`/stays/${id}/confirm-payment`);
    return data;
  },

  // Stock Management
  getFoodStock: async (): Promise<any[]> => {
    const { data } = await api.get('/stock/food');
    return data;
  },
  createFoodStock: async (item: any): Promise<any> => {
    const { data } = await api.post('/stock/food', item);
    return data;
  },
  updateFoodStock: async (id: string, item: any): Promise<any> => {
    const { data } = await api.patch(`/stock/food/${id}`, item);
    return data;
  },
  recordFoodEntry: async (id: string, log: { quantity: number; unitPrice?: number; reason?: string }): Promise<any> => {
    const { data } = await api.post(`/stock/food/${id}/entry`, log);
    return data;
  },
  recordFoodRemoval: async (id: string, log: { quantity: number; reason?: string }): Promise<any> => {
    const { data } = await api.post(`/stock/food/${id}/removal`, log);
    return data;
  },
  toggleFoodActive: async (id: string, isActive: boolean): Promise<any> => {
    const { data } = await api.patch(`/stock/food/${id}/toggle-active`, { isActive });
    return data;
  },

  getGeneralAssets: async (): Promise<any[]> => {
    const { data } = await api.get('/stock/assets');
    return data;
  },
  createGeneralAsset: async (asset: any): Promise<any> => {
    const { data } = await api.post('/stock/assets', asset);
    return data;
  },
  updateGeneralAsset: async (id: string, asset: any): Promise<any> => {
    const { data } = await api.patch(`/stock/assets/${id}`, asset);
    return data;
  },
  recordAssetEntry: async (id: string, log: { quantity: number; unitPrice?: number; reason?: string }): Promise<any> => {
    const { data } = await api.post(`/stock/assets/${id}/entry`, log);
    return data;
  },
  toggleAssetActive: async (id: string, isActive: boolean): Promise<any> => {
    const { data } = await api.patch(`/stock/assets/${id}/toggle-active`, { isActive });
    return data;
  },
  getPendingStockTasks: async (): Promise<any> => {
    const { data } = await api.get('/stock/pending-tasks');
    return data;
  },
  recordStockUsage: async (usage: { type: 'ORDER' | 'SERVICE'; id: string; items: any[] }): Promise<any> => {
    const { data } = await api.post('/stock/record-usage', usage);
    return data;
  },

  getFixedAssets: async (): Promise<any[]> => {
    const { data } = await api.get('/stock/fixed-assets');
    return data;
  },
  createFixedAsset: async (asset: any): Promise<any> => {
    const { data } = await api.post('/stock/fixed-assets', asset);
    return data;
  },
  updateFixedAsset: async (id: string, asset: any): Promise<any> => {
    const { data } = await api.patch(`/stock/fixed-assets/${id}`, asset);
    return data;
  },

  getStockLogs: async (): Promise<any[]> => {
    const { data } = await api.get('/stock/logs');
    return data;
  },
  getStockStats: async (): Promise<any> => {
    const { data } = await api.get('/stock/stats');
    return data;
  },
  getAnalyticsHighlights: async (): Promise<any> => {
    const { data } = await api.get('/analytics/highlights');
    return data;
  },
  getAnalyticsTrends: async (): Promise<any[]> => {
    const { data } = await api.get('/analytics/trends');
    return data;
  },
  getFinancialStatement: async (startDate?: string, endDate?: string): Promise<any> => {
    const { data } = await api.get('/analytics/financial-statement', { params: { startDate, endDate } });
    return data;
  }
};

