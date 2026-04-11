import { Room, FoodItem, FoodOrder } from './types';

// Storage keys
const STORAGE_KEYS = {
    ORDERS: 'unica-orders',
    ROOMS: 'unica-rooms',
    MENU: 'unica-menu'
};

// Initial Defaults (Fallback)
const DEFAULT_ROOMS: Room[] = [
  {
    id: 'room-1',
    name: 'Deluxe Suite',
    type: 'suite',
    description: 'A premium stay with elegant furnishings and a relaxing atmosphere.',
    price: 35,
    capacity: 2,
    size: '25m²',
    features: ['King Size Bed', 'En-suite Bathroom', 'High-speed WiFi', '4K TV'],
    mainImage: '/Images/UNICA_Bedroom_view.jpg',
    gallery: ['/Images/UNICA_Bedroom_view2.jpg'],
    status: 'AVAILABLE'
  },
  {
    id: 'room-2',
    name: 'Executive Room',
    type: 'room',
    description: 'Modern and spacious room designed for supreme comfort.',
    price: 45,
    capacity: 2,
    size: '30m²',
    features: ['Queen Size Bed', 'Work Desk', 'En-suite Bathroom'],
    mainImage: '/Images/UNICA_Bedroom2_view.jpg',
    gallery: [],
    status: 'OCCUPIED'
  },
  {
    id: 'apt-1',
    name: 'Luxury 2-Bedroom',
    type: 'apartment',
    description: 'Fully furnished with a modern kitchen and two private bedrooms.',
    price: 100,
    capacity: 4,
    size: '85m²',
    features: ['Full Kitchen', 'Large Saloon', '2 Bedrooms', 'Dining Area'],
    mainImage: '/Images/UNICA_House_Apartment_kitchen.jpg',
    gallery: [],
    status: 'AVAILABLE'
  }
];

const DEFAULT_MENU: FoodItem[] = [
  { 
    id: 'b1', 
    name: 'Sunrise Omelette', 
    meal: 'Breakfast', 
    price: 8, 
    image: '/food/sunrise_omelette.png', 
    description: 'Farm eggs, herbs, toast, and seasonal fruit.', 
    available: true,
    calories: 340,
    protein: '18g',
    fat: '22g',
    carbs: '12g',
    ingredients: ['Farm Fresh Eggs', 'Himalayan Salt', 'Fresh Chives', 'Whole Wheat Toast', 'Mixed Berries']
  },
  { 
    id: 'b2', 
    name: 'Granola Bowl', 
    meal: 'Breakfast', 
    price: 7, 
    image: '/food/granola_bowl.png', 
    description: 'Yogurt, house granola, banana, and honey.', 
    available: true,
    calories: 420,
    protein: '12g',
    fat: '15g',
    carbs: '58g',
    ingredients: ['Greek Yogurt', 'Whole Grain Oats', 'Wildflower Honey', 'Sliced Banana', 'Almonds']
  },
  { 
    id: 'l1', 
    name: 'Grilled Chicken Wrap', 
    meal: 'Lunch', 
    price: 12, 
    image: '/food/chicken_wrap.png', 
    description: 'Crisp greens, grilled chicken, and garlic aioli.', 
    available: true,
    calories: 480,
    protein: '32g',
    fat: '14g',
    carbs: '42g',
    ingredients: ['Chargrilled Chicken Breast', 'Artisanal Tortilla', 'Romaine Lettuce', 'Garlic Reduction', 'Cherry Tomatoes']
  },
  { 
    id: 'l2', 
    name: 'Beef Burger', 
    meal: 'Lunch', 
    price: 14, 
    image: '/food/beef_burger.png', 
    description: 'Double patties, sharp cheddar, and caramelized onions.', 
    available: true,
    calories: 780,
    protein: '45g',
    fat: '38g',
    carbs: '65g',
    ingredients: ['Wagyu Beef Patty', 'Brioche Bun', 'Aged Cheddar', 'Caramelized Onions', 'Secret Sauce']
  },
  { 
    id: 'd1', 
    name: 'Steak Plate', 
    meal: 'Dinner', 
    price: 21, 
    image: '/food/steak_plate.png', 
    description: 'Pan-seared steak, mashed potatoes, and vegetables.', 
    available: true,
    calories: 840,
    protein: '58g',
    fat: '42g',
    carbs: '35g',
    ingredients: ['Prime Sirloin', 'Yukon Gold Potatoes', 'Garlic Butter', 'Seasonal Asparagus', 'Vinegar Reduction']
  },
  { 
    id: 'd2', 
    name: 'Japanese Ramen', 
    meal: 'Dinner', 
    price: 18, 
    image: '/food/pasta_alfredo.png', 
    description: 'Rich pork broth with slow-cooked pork belly and marinated egg.', 
    available: true,
    calories: 520,
    protein: '42g',
    fat: '28g',
    carbs: '8g',
    ingredients: ['Wild-Caught Salmon', 'Fresh Dill', 'Lemon Zest', 'Extra Virgin Olive Oil', 'Steamed Spinach']
  }
];

const DEFAULT_ORDERS: FoodOrder[] = [
  {
    id: 'ORD-1001',
    guestId: 'G-101',
    guestName: 'John Doe',
    roomNumber: 'Suite 204',
    items: [{ itemId: 'l2', name: 'Beef Burger', quantity: 1, price: 14 }],
    totalAmount: 14,
    status: 'DELIVERED',
    orderTime: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ', 08:22 AM',
    notes: 'No onions please'
  },
  {
    id: 'ORD-1002',
    guestId: 'G-105',
    guestName: 'Sarah Smith',
    roomNumber: 'Room 105',
    items: [{ itemId: 'd2', name: 'Japanese Ramen', quantity: 1, price: 18 }],
    totalAmount: 18,
    status: 'PREPARING',
    orderTime: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ', 09:15 AM'
  }
];

// Memory variables that reflect current storage state
let MEMORY_ROOMS: Room[] = DEFAULT_ROOMS;
let MEMORY_MENU: FoodItem[] = DEFAULT_MENU;
let MEMORY_ORDERS: FoodOrder[] = DEFAULT_ORDERS;

// Browser-safe storage helpers
const isBrowser = typeof window !== 'undefined';

const loadFromStorage = () => {
  if (!isBrowser) return;
  
  try {
    const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const savedRooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
    const savedMenu = localStorage.getItem(STORAGE_KEYS.MENU);

    if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) MEMORY_ORDERS = parsed;
    }
    if (savedRooms) {
        const parsed = JSON.parse(savedRooms);
        if (Array.isArray(parsed)) MEMORY_ROOMS = parsed;
    }
    if (savedMenu) {
        const parsed = JSON.parse(savedMenu);
        if (Array.isArray(parsed)) MEMORY_MENU = parsed;
    }
  } catch (e) {
    console.warn('⚠️ Storage load fail:', e);
  }
};

const saveToStorage = () => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(MEMORY_ORDERS));
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(MEMORY_ROOMS));
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(MEMORY_MENU));
    
    console.log('💾 Data persisted to LocalStorage');
    
    // Dispatch events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('fica-data-update'));
  } catch (e) {
    console.error('❌ Storage save fail:', e);
  }
};

// Initial load
loadFromStorage();

// Helper methods
export const operationalData = {
  getRooms: () => { loadFromStorage(); return [...MEMORY_ROOMS]; },
  addRoom: (room: Room) => { 
    MEMORY_ROOMS = [...MEMORY_ROOMS, room];
    saveToStorage();
  },
  updateRoom: (room: Room) => { 
    MEMORY_ROOMS = MEMORY_ROOMS.map(r => r.id === room.id ? room : r);
    saveToStorage();
  },
  
  getMenu: () => { loadFromStorage(); return [...MEMORY_MENU]; },
  addMenuItem: (item: FoodItem) => { 
    MEMORY_MENU = [...MEMORY_MENU, item];
    saveToStorage();
  },
  updateMenuItem: (item: FoodItem) => { 
    MEMORY_MENU = MEMORY_MENU.map(m => m.id === item.id ? item : m);
    saveToStorage();
  },

  getOrders: () => { loadFromStorage(); return [...MEMORY_ORDERS]; },
  addOrder: (order: FoodOrder) => {
    MEMORY_ORDERS = [order, ...MEMORY_ORDERS];
    saveToStorage();
  },
  updateOrderStatus: (orderId: string, status: FoodOrder['status']) => {
    MEMORY_ORDERS = MEMORY_ORDERS.map(o => o.id === orderId ? { ...o, status } : o);
    saveToStorage();
  },
  confirmOrderReceipt: (orderId: string) => {
    MEMORY_ORDERS = MEMORY_ORDERS.map(o => o.id === orderId ? { ...o, isConfirmedByGuest: true } : o);
    saveToStorage();
  },
  submitOrderFeedback: (orderId: string, rating: number, testimonial?: string) => {
    MEMORY_ORDERS = MEMORY_ORDERS.map(o => o.id === orderId ? { ...o, rating, testimonial } : o);
    saveToStorage();
  },

  getAnalytics: () => ({
    revenueData: [
      { day: '1', revenue: 25 }, { day: '5', revenue: 20 }, { day: '10', revenue: 35 },
      { day: '15', revenue: 55 }, { day: '20', revenue: 40 }, { day: '25', revenue: 65 },
      { day: '30', revenue: 95 },
    ],
    operationsSplit: [
      { name: 'Rooms Viewed', value: 45, color: '#4d668f' },
      { name: 'Bookings Done', value: 25, color: '#292f36' },
      { name: 'Menu Viewed', value: 20, color: '#d1d5db' },
      { name: 'Other Sessions', value: 10, color: '#f3f4f6' },
    ],
    highlights: [
      { title: 'Total Revenue', value: '$12,450', change: '+12%', icon: 'TrendingUp' },
      { title: 'Active Stays', value: '42', change: '+5%', icon: 'Bed' },
      { title: 'Customer Rating', value: '88%', change: '+2%', icon: 'Star' },
      { title: 'Booking Streak', value: '07 Days', change: '+8%', icon: 'Zap' },
    ]
  })
};
