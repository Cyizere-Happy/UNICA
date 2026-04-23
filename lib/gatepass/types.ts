export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';

export interface DashboardStats {
  totalVisitsToday: number;
  pendingApprovals: number;
  activeVisitors: number;
  visitsThisMonth: number;
  totalGuests: number;
  completedVisitsToday: number;
  cancelledVisitsToday: number;
  guestsStayedToday: number;
  vacantRooms: number;
  pendingSecurityCount: number;
  pendingOrders?: number;
  availableRooms?: number;
  totalBookings?: number;
  approvedBookings?: number;
  revenueToday?: number;
  totalRevenue?: number;
  stockExpenses?: number;
  netProfit?: number;
  totalSpentFood?: number;
  totalSpentAssets?: number;
  lowStockFoodCount?: number;
  lowStockAssetsCount?: number;
  adr?: number;
  revPar?: number;
  topDish?: string;
  summaryItems?: { title: string; count: string; color: string }[];
}

export interface Visit {
  id: string;
  guestName: string;
  guestPhone?: string;
  roomName: string;
  roomId?: string;
  guestId?: string;
  institution?: string;
  relationship?: string;
  purpose: string;
  status: string;
  visitorType?: 'parent' | 'outside_visitor';
  paymentStatus?: 'PAID' | 'PENDING';
  paymentAmount?: number;
  transactionId?: string;
  visitNotes?: string;
  visitorMembers?: VisitorMember[];
  visitorCount?: number;
  nationalId?: string;
  createdAt: string;
  visitDate: string;
  visitTime: string;
  checkedInAt?: string;
}


export interface VisitorMember {
  id: string;
  name: string;
  role: string;
  contact: string;
  identification?: string;
  notes?: string;
}




export interface FoodItem {
  id: string;
  name: string;
  meal: MealType;
  price: number;
  image: string;
  description: string;
  available?: boolean;
  calories?: number;
  protein?: string;
  fat?: string;
  carbs?: string;
  ingredients?: string[];
}

export interface FoodOrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface FoodOrder {
  id: string;
  guestId: string;
  guestName: string;
  roomNumber: string;
  items: FoodOrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  orderTime: string;
  notes?: string;
  isConfirmedByGuest?: boolean;
  rating?: number;
  testimonial?: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'room' | 'apartment' | 'suite' | 'deluxe';
  description: string;
  price: number;
  priceUsd?: number;
  exchangeRate?: number;
  capacity: number;
  size: string;
  features: string[];
  mainImage: string;
  gallery: string[];
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';
}

export interface BookingRequest {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAvatar?: string;
  roomName: string;
  roomType: string;
  roomId: string; // Required for backend creation
  roomPrice: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHECKED_IN' | 'CHECKED_OUT';
  rating?: number;
  specialRequests?: string;
  stayCode?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
}

export interface VisitingDay {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  audience: 'PARENTS' | 'OUTSIDE_VISITORS';
  pricePerPerson?: number;
  maxVisitors: number;
  currentVisitors: number;
  status: 'OPEN' | 'CLOSED' | 'active' | 'completed';
  visitCode: string;
  isManual?: boolean;
}

export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: 'VIP' | 'REGULAR' | 'BLACKLISTED';
  nationality?: string;
  idType?: 'NATIONAL_ID' | 'PASSPORT' | 'RESIDENCE_PERMIT';
  idNumber?: string;
  residenceAddress?: string;
  totalSpent: number;
  registeredAt: string;
  totalBookings?: number;
  lastVisit?: string;
  currentStayId?: string;
  stayCode?: string;
}

export interface StayCompanion {
  id: string;
  stayId: string;
  name: string;
  nationality: string;
  idType: 'NATIONAL_ID' | 'PASSPORT' | 'RESIDENCE_PERMIT';
  idNumber: string;
  phone?: string;
}

export interface CleaningRequest {
  id: string;
  stayId: string;
  type: 'MOPPING' | 'BEDSHEET_CHANGE';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  stay?: StayRecord;
}

export interface StayRecord {
  id: string;
  guestId: string;
  guestName: string;
  roomId?: string;
  roomName: string;
  roomType: string;
  stayCode: string;
  checkIn: string;
  checkOut?: string;
  expectedCheckOutAt?: string;
  type: 'ROOM' | 'APARTMENT';
  purposeOfVisit?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'CHECKED_IN' | 'CHECKED_OUT' | 'ACTIVE' | 'COMPLETED';
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING';
  totalPaid: number;
  totalAmount: number;
  notes?: string;
  companions?: StayCompanion[];
}

