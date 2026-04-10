import { DashboardStats, Visit, Student, VisitingDay } from './types';

export const MOCK_STATS: DashboardStats = {
  totalVisitsToday: 24,
  pendingApprovals: 8,
  activeVisitors: 12,
  totalStudents: 150,
  visitsThisMonth: 450,
  completedVisitsToday: 18,
  cancelledVisitsToday: 2,
  studentsVisitedToday: 18,
  studentsNotVisitedToday: 6,
  pendingSecurityCount: 4,
  summaryItems: [
    { title: "Guests Checked-in", count: "18", color: "bg-green-500" },
    { title: "Expected Arrivals", count: "6", color: "bg-blue-400" },
    { title: "Pending Logs", count: "4", color: "bg-amber-400" },
    { title: "Staff Entries", count: "12", color: "bg-indigo-400" }
  ]
};

const MOCK_MEMBERS = [
  { id: 'M1', name: 'James Doe', role: 'Husband', contact: '0788111222' },
  { id: 'M2', name: 'Mary Doe', role: 'Wife', contact: '0788333444' }
];

export const MOCK_VISITS: Visit[] = [
  {
    id: 'V-001',
    parentName: 'John Doe',
    parentPhone: '+250 788 123 456',
    studentName: 'Suite 204 (Alice)',
    studentId: 'UH-204',
    visitDate: new Date().toLocaleDateString(),
    visitTime: '10:30 AM',
    purpose: 'Standard Check-in',
    status: 'CHECKED_IN',
    paymentStatus: 'PAID',
    paymentAmount: 25000,
    transactionId: 'TX-998877',
    createdAt: new Date().toISOString(),
    visitorCount: 2,
    visitorMembers: MOCK_MEMBERS,
    institution: 'UNICA House',
    email: 'john@example.com'
  },
  {
    id: 'V-002',
    parentName: 'Sarah Smith',
    parentPhone: '+250 788 234 567',
    studentName: 'Room 105 (Bob)',
    studentId: 'UH-105',
    visitDate: new Date().toLocaleDateString(),
    visitTime: '11:15 AM',
    purpose: 'Facility Access',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    paymentAmount: 15000,
    transactionId: 'TX-665544',
    createdAt: new Date().toISOString(),
    visitorCount: 1,
    visitorMembers: [MOCK_MEMBERS[0]],
    institution: 'UNICA House',
    email: 'sarah@example.com'
  },
  {
    id: 'V-003',
    parentName: 'Robert Mugabo',
    parentPhone: '+250 789 555 666',
    studentName: 'Penthouse B (Mark)',
    studentId: 'UH-PHB',
    visitDate: new Date().toLocaleDateString(),
    visitTime: '02:00 PM',
    purpose: 'Short Stay',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentAmount: 85000,
    transactionId: 'TX-123456',
    createdAt: new Date().toISOString(),
    visitorCount: 4,
    visitorMembers: MOCK_MEMBERS,
    institution: 'UNICA House',
    email: 'robert@mugabo.rw'
  },
  {
    id: 'V-004',
    parentName: 'Kellen Uwase',
    parentPhone: '+250 787 111 222',
    studentName: 'Room 302 (Lina)',
    studentId: 'UH-302',
    visitDate: new Date().toLocaleDateString(),
    visitTime: '09:00 AM',
    purpose: 'Maintenance',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentAmount: 5000,
    transactionId: 'TX-000111',
    createdAt: new Date().toISOString(),
    visitorCount: 1,
    visitorMembers: [MOCK_MEMBERS[0]],
    institution: 'UNICA House',
    email: 'kellen@example.com'
  }
];

export const MOCK_VISITING_DAYS: VisitingDay[] = [
  {
    id: 'D-001',
    title: 'Weekend Open House',
    date: new Date().toISOString(),
    startTime: '09:00',
    endTime: '17:00',
    location: 'Main Lobby',
    maxVisitors: 50,
    currentVisitors: 12,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    audience: 'PARENTS',
    visitCode: 'UH-GUEST-01',
    pricePerPerson: 0
  },
  {
    id: 'D-002',
    title: 'Spa & Wellness Day',
    date: new Date(Date.now() + 86400000).toISOString(),
    startTime: '10:00',
    endTime: '20:00',
    location: 'Wellness Center',
    maxVisitors: 20,
    currentVisitors: 8,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    audience: 'OUTSIDE_VISITORS',
    visitCode: 'UH-SPA-VIP',
    pricePerPerson: 45000
  }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'UH-204',
    name: 'Suite 204',
    grade: 'Floor 2',
    class: 'Suite A',
    guardianName: 'Alice',
    guardianPhone: '0788000111',
    guardianEmail: 'alice@example.com',
    enrollmentDate: new Date().toISOString()
  },
  {
    id: 'UH-105',
    name: 'Room 105',
    grade: 'Floor 1',
    class: 'Standard',
    guardianName: 'Bob',
    guardianPhone: '0788000222',
    guardianEmail: 'bob@example.com',
    enrollmentDate: new Date().toISOString()
  },
  {
    id: 'UH-PHB',
    name: 'Penthouse B',
    grade: 'Floor 10',
    class: 'Penthouse',
    guardianName: 'Mark',
    guardianPhone: '0788000333',
    guardianEmail: 'mark@example.com',
    enrollmentDate: new Date().toISOString()
  },
  {
    id: 'UH-302',
    name: 'Room 302',
    grade: 'Floor 3',
    class: 'Deluxe',
    guardianName: 'Lina',
    guardianPhone: '0788000444',
    guardianEmail: 'lina@example.com',
    enrollmentDate: new Date().toISOString()
  }
];

