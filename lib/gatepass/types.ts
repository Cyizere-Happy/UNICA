export interface Visit {
  id: string;
  parentName: string;
  parentPhone: string;
  studentName: string;
  studentId: string;
  nationalId?: string;
  relationship?: string;
  visitorCount?: number;
  visitDate: string;
  visitTime: string;
  purpose: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentAmount: number;
  transactionId: string;
  createdAt: string;
  updatedAt?: string;
  visitorType?: 'PARENTS' | 'OUTSIDE_VISITORS';
  institution?: string;
  email?: string;
  visitorMembers?: VisitorMember[];
  visitNotes?: string;
  documents?: VisitDocument[];
  // Optional extra categorisation for outside visitors (e.g. which department/person they visited)
  visitDepartment?: string;
  checkedInAt?: string;
  visitCode?: string;
}

export interface VisitorMember {
  id: string;
  name: string;
  role: string;
  contact: string;
  identification?: string;
  notes?: string;
}

export interface VisitDocument {
  id: string;
  title: string;
  url: string;
  type: 'id' | 'ticket' | 'other';
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address?: string;
  enrollmentDate: string;
  status?: 'active' | 'inactive';
}

export interface Transaction {
  id: string;
  visitId: string;
  parentName: string;
  amount: number;
  paymentMethod: 'momo' | 'stripe' | 'flutterwave';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionDate: string;
  reference: string;
}

export interface DashboardStats {
  totalVisitsToday: number;
  pendingApprovals: number;
  activeVisitors: number;
  totalStudents: number;
  visitsThisMonth: number;
  completedVisitsToday: number;
  cancelledVisitsToday: number;
  studentsVisitedToday: number;
  studentsNotVisitedToday: number;
  pendingSecurityCount: number;
  summaryItems?: { title: string; count: string; color: string }[];
}

export interface SchoolVisit {
  id: string;
  visitTitle: string;
  visitType: 'field_trip' | 'guest_speaker' | 'school_event' | 'inspection' | 'other';
  scheduledDate: string;
  scheduledTime: string;
  duration: string; // e.g., "2 hours", "Full day"
  location: string;
  description: string;
  organizer: string;
  contactPerson: string;
  contactPhone: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  participants: number; // Number of students/staff participating
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface VisitingDay {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxVisitors: number;
  currentVisitors: number;
  status: 'OPEN' | 'CLOSED' | 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  audience?: 'PARENTS' | 'OUTSIDE_VISITORS';
  visitCode: string;
  title: string;
  pricePerPerson: number;
  location: string;
  isManual?: boolean;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';

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

export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  status: 'VIP' | 'REGULAR' | 'BLACKLISTED';
  registeredAt: string;
  currentStayId?: string; // Links to an active StayRecord if checked in
  stayCode?: string; // Active stay code if applicable
}

export interface StayRecord {
  id: string;
  guestId: string;
  guestName: string;
  roomName: string;
  roomType: string;
  checkIn: string;
  checkOut?: string;
  status: 'CHECKED_IN' | 'CHECKED_OUT';
  totalAmount: number;
  stayCode?: string;
  notes?: string;
}
