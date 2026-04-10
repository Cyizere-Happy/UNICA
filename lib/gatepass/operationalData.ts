import { Room, FoodItem, FoodOrder } from './types';

// Mock data that the Admin Panel can now "Live Update"
export let MOCK_ROOMS: Room[] = [
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

export let MOCK_MENU: FoodItem[] = [
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

export let MOCK_ORDERS: FoodOrder[] = [
  {
    id: 'ORD-1001',
    guestId: 'G-101',
    guestName: 'John Doe',
    roomNumber: 'Suite 204',
    items: [{ itemId: 'l2', name: 'Beef Burger', quantity: 1, price: 14 }],
    totalAmount: 14,
    status: 'DELIVERED',
    orderTime: 'June 1, 2026, 08:22 AM',
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
    orderTime: 'June 1, 2026, 09:15 AM'
  },
  {
    id: 'ORD-1003',
    guestId: 'G-110',
    guestName: 'Michael Brown',
    roomNumber: 'Apt 4B',
    items: [{ itemId: 'b1', name: 'Sunrise Omelette', quantity: 2, price: 8 }],
    totalAmount: 16,
    status: 'DELIVERED',
    orderTime: 'June 1, 2026, 07:45 AM'
  },
  {
    id: 'ORD-1004',
    guestId: 'G-202',
    guestName: 'Elena Rodriguez',
    roomNumber: 'Room 202',
    items: [{ itemId: 'l1', name: 'Grilled Chicken Wrap', quantity: 1, price: 12 }],
    totalAmount: 12,
    status: 'CANCELLED',
    orderTime: 'May 31, 2026, 08:22 PM'
  }
];

// Helper methods to simulate CMS updates
export const operationalData = {
  getRooms: () => MOCK_ROOMS,
  addRoom: (room: Room) => { MOCK_ROOMS = [...MOCK_ROOMS, room] },
  updateRoom: (room: Room) => { MOCK_ROOMS = MOCK_ROOMS.map(r => r.id === room.id ? room : r) },
  
  getMenu: () => MOCK_MENU,
  addMenuItem: (item: FoodItem) => { MOCK_MENU = [...MOCK_MENU, item] },
  updateMenuItem: (item: FoodItem) => { MOCK_MENU = MOCK_MENU.map(m => m.id === item.id ? item : m) },

  getOrders: () => MOCK_ORDERS,
  updateOrderStatus: (orderId: string, status: FoodOrder['status']) => {
    MOCK_ORDERS = MOCK_ORDERS.map(o => o.id === orderId ? { ...o, status } : o);
  },

  getAnalytics: () => ({
    revenueData: [
      { day: '1', revenue: 25 },
      { day: '5', revenue: 20 },
      { day: '10', revenue: 35 },
      { day: '15', revenue: 55 },
      { day: '20', revenue: 40 },
      { day: '25', revenue: 65 },
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
