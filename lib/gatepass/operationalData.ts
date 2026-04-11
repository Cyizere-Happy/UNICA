import { Room, FoodItem, FoodOrder, ContactMessage } from './types';

// Storage keys
const STORAGE_KEYS = {
    ORDERS: 'unica-orders',
    ROOMS: 'unica-rooms',
    MENU: 'unica-menu',
    MESSAGES: 'unica-messages'
};

// Initial Defaults (Fallback)
const DEFAULT_ROOMS: Room[] = [
  {
    id: 'room-1',
    name: 'Deluxe Suite',
    type: 'room',
    description: 'A premium one-night stay bedroom with elegant furnish and a relaxing atmosphere.',
    price: 35,
    capacity: 2,
    size: '25m²',
    features: ['King Size Bed', 'En-suite Bathroom', 'High-speed WiFi', '4K TV'],
    mainImage: '/Images/UNICA_Bedroom_view.jpg',
    gallery: [
        '/Images/UNICA_Bedroom_view2.jpg',
        '/Images/UNICA_Bedroom_view3.jpg',
        '/Images/UNICA_Bedroom_Bed_view.jpg',
        '/Images/UNICA_Bedroom_Bathroom.jpg'
    ],
    status: 'AVAILABLE'
  },
  {
    id: 'room-2',
    name: 'Executive Room',
    type: 'room',
    description: 'Modern and spacious room designed for comfort and convenience.',
    price: 35,
    capacity: 2,
    size: '30m²',
    features: ['Queen Size Bed', 'Work Desk', 'En-suite Bathroom', 'WiFi'],
    mainImage: '/Images/UNICA_Bedroom2_view.jpg',
    gallery: ['/Images/UNICA_Bedroom2_Bathroom_view.jpg'],
    status: 'OCCUPIED'
  },
  {
    id: 'room-3',
    name: 'Superior Bedroom',
    type: 'room',
    description: 'Bright and airy bedroom with premium amenities and stunning views.',
    price: 35,
    capacity: 2,
    size: '35m²',
    features: ['King Size Bed', 'Balcony Access', 'Luxury Bathroom', 'WiFi', 'Mini Bar'],
    mainImage: '/Images/UNICA_Bedroom3_view.jpg',
    gallery: ['/Images/UNICA_Bedroom3_Bathroom_view.jpg'],
    status: 'AVAILABLE'
  },
  {
    id: 'room-4',
    name: 'Standard Cozy',
    type: 'room',
    description: 'A cozy and well-appointed room perfect for a restful night.',
    price: 35,
    capacity: 2,
    size: '22m²',
    features: ['Queen Size Bed', 'Smart TV', 'WiFi'],
    mainImage: '/Images/UNICA_Bedroom4_view.jpg',
    gallery: [],
    status: 'AVAILABLE'
  },
  {
    id: 'room-5',
    name: 'Premium Terrace View',
    type: 'room',
    description: 'Elegant room with direct access to a shared terrace and beautiful garden views.',
    price: 35,
    capacity: 2,
    size: '38m²',
    features: ['King Size Bed', 'Terrace', 'Premium Sound System', 'WiFi', 'Luxury Bath'],
    mainImage: '/Images/UNICA_House_Bedroom5_view.jpg',
    gallery: [],
    status: 'AVAILABLE'
  },
  {
    id: 'apt-1',
    name: 'Luxury 2-Bedroom Apartment',
    type: 'apartment',
    description: 'Fully furnished apartment with a modern kitchen, spacious saloon, and two private bedrooms.',
    price: 100,
    capacity: 4,
    size: '85m²',
    features: ['Full Kitchen', 'Large Saloon', '2 Bedrooms', 'Dining Area', 'Full Laundry'],
    mainImage: '/Images/UNICA_House_Apartment_kitchen.jpg',
    gallery: [
        '/Images/Apartment_Kitchen_Counter_view.jpg',
        '/Images/Apartment_Kitchen_Cupboard_view.jpg'
    ],
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

const DEFAULT_MESSAGES: ContactMessage[] = [
  {
    id: `MSG-${Date.now()}`,
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'Dietary Restrictions Question',
    message: 'Hello, I am planning to visit and want to know if you offer vegan options on your menu?',
    status: 'UNREAD',
    createdAt: new Date().toISOString()
  }
];

// Memory variables that reflect current storage state
let MEMORY_ROOMS: Room[] = DEFAULT_ROOMS;
let MEMORY_MENU: FoodItem[] = DEFAULT_MENU;
let MEMORY_ORDERS: FoodOrder[] = DEFAULT_ORDERS;
let MEMORY_MESSAGES: ContactMessage[] = DEFAULT_MESSAGES;

// Browser-safe storage helpers
const isBrowser = typeof window !== 'undefined';

const loadFromStorage = () => {
  if (!isBrowser) return;
  
  try {
    const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const savedRooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
    const savedMenu = localStorage.getItem(STORAGE_KEYS.MENU);

    // Initial Seeding: If storage is empty, write defaults immediately
    if (!savedOrders) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
        MEMORY_ORDERS = DEFAULT_ORDERS;
    } else {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) MEMORY_ORDERS = parsed;
    }

    if (!savedRooms) {
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(DEFAULT_ROOMS));
        MEMORY_ROOMS = DEFAULT_ROOMS;
    } else {
        const parsed = JSON.parse(savedRooms);
        if (Array.isArray(parsed)) {
            // Merge in any missing default rooms to restore missing ones like 'Superior Bedroom'
            const existingIds = new Set(parsed.map(r => r.id));
            const missingRooms = DEFAULT_ROOMS.filter(r => !existingIds.has(r.id));
            
            if (missingRooms.length > 0) {
                MEMORY_ROOMS = [...parsed, ...missingRooms];
                localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(MEMORY_ROOMS));
            } else {
                MEMORY_ROOMS = parsed;
            }
        }
    }

    if (!savedMenu) {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(DEFAULT_MENU));
        MEMORY_MENU = DEFAULT_MENU;
    } else {
        const parsed = JSON.parse(savedMenu);
        if (Array.isArray(parsed)) MEMORY_MENU = parsed;
    }

    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!savedMessages) {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(DEFAULT_MESSAGES));
        MEMORY_MESSAGES = DEFAULT_MESSAGES;
    } else {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) MEMORY_MESSAGES = parsed;
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
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(MEMORY_MESSAGES));
    
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
  removeRoom: (roomId: string) => {
    MEMORY_ROOMS = MEMORY_ROOMS.filter(r => r.id !== roomId);
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

  getMessages: () => { loadFromStorage(); return [...MEMORY_MESSAGES]; },
  saveMessage: (msg: ContactMessage) => {
    MEMORY_MESSAGES = [msg, ...MEMORY_MESSAGES];
    saveToStorage();
  },
  markMessageRead: (msgId: string) => {
    MEMORY_MESSAGES = MEMORY_MESSAGES.map(m => m.id === msgId ? { ...m, status: 'READ' } : m);
    saveToStorage();
  },

  getAnalytics: () => ({
    revenueData: [
      { day: '1', revenue: 3200 }, { day: '5', revenue: 4100 }, { day: '10', revenue: 3800 },
      { day: '15', revenue: 5200 }, { day: '20', revenue: 4800 }, { day: '25', revenue: 6100 },
      { day: '30', revenue: 7500 },
    ],
    operationsSplit: [
      { name: 'Room Bookings', value: 65, color: '#4d668f' },
      { name: 'Food & Beverage', value: 25, color: '#292f36' },
      { name: 'Spa & Wellness', value: 7, color: '#d1d5db' },
      { name: 'Transport / Tours', value: 3, color: '#f3f4f6' },
    ],
    highlights: [
      { title: 'RevPAR', value: '$124.50', change: '+4.2%', icon: 'TrendingUp' },
      { title: 'ADR', value: '$155.00', change: '+8.1%', icon: 'Zap' },
      { title: 'Occupancy Rate', value: '78%', change: '+12%', icon: 'Bed' },
      { title: 'F&B Revenue', value: '$8,250', change: '+18%', icon: 'Star' },
    ]
  })
};
