export interface Room {
    id: string;
    name: string;
    type: 'room' | 'apartment';
    description: string;
    price: number;
    capacity: number;
    size: string;
    features: string[];
    mainImage: string;
    gallery: string[];
}

export const rooms: Room[] = [
    {
        id: 'room-1',
        name: 'Deluxe Suite',
        type: 'room',
        description: 'A premium one-night stay bedroom with elegant furnish and a relaxing atmosphere.',
        price: 80,
        capacity: 2,
        size: '25m²',
        features: ['King Size Bed', 'En-suite Bathroom', 'High-speed WiFi', 'AC', '4K TV'],
        mainImage: '/images/UNICA_Bedroom_view.jpg',
        gallery: [
            '/images/UNICA_Bedroom_view2.jpg',
            '/images/UNICA_Bedroom_view3.jpg',
            '/images/UNICA_Bedroom_Bed_view.jpg',
            '/images/UNICA_Bedroom_Bathroom.jpg'
        ]
    },
    {
        id: 'room-2',
        name: 'Executive Room',
        type: 'room',
        description: 'Modern and spacious room designed for comfort and convenience.',
        price: 95,
        capacity: 2,
        size: '30m²',
        features: ['Queen Size Bed', 'Work Desk', 'En-suite Bathroom', 'WiFi', 'AC'],
        mainImage: '/images/UNICA_Bedroom2_view.jpg',
        gallery: ['/images/UNICA_Bedroom2_Bathroom_view.jpg']
    },
    {
        id: 'room-3',
        name: 'Superior Bedroom',
        type: 'room',
        description: 'Bright and airy bedroom with premium amenities and stunning views.',
        price: 110,
        capacity: 2,
        size: '35m²',
        features: ['King Size Bed', 'Balcony Access', 'Luxury Bathroom', 'WiFi', 'Mini Bar'],
        mainImage: '/images/UNICA_Bedroom3_view.jpg',
        gallery: ['/images/UNICA_Bedroom3_Bathroom_view.jpg']
    },
    {
        id: 'room-4',
        name: 'Standard Cozy',
        type: 'room',
        description: 'A cozy and well-appointed room perfect for a restful night.',
        price: 70,
        capacity: 2,
        size: '22m²',
        features: ['Queen Size Bed', 'Smart TV', 'WiFi', 'AC'],
        mainImage: '/images/UNICA_Bedroom4_view.jpg',
        gallery: []
    },
    {
        id: 'room-5',
        name: 'Premium Terrace View',
        type: 'room',
        description: 'Elegant room with direct access to a shared terrace and beautiful garden views.',
        price: 120,
        capacity: 2,
        size: '38m²',
        features: ['King Size Bed', 'Terrace', 'Premium Sound System', 'WiFi', 'Luxury Bath'],
        mainImage: '/images/UNICA_House_Bedroom5_view.jpg',
        gallery: []
    },
    {
        id: 'apt-1',
        name: 'Luxury 2-Bedroom Apartment',
        type: 'apartment',
        description: 'Fully furnished apartment with a modern kitchen, spacious saloon, and two private bedrooms.',
        price: 250,
        capacity: 4,
        size: '85m²',
        features: ['Full Kitchen', 'Large Saloon', '2 Bedrooms', 'Dining Area', 'Full Laundry'],
        mainImage: '/images/UNICA_House_Apartment_kitchen.jpg',
        gallery: [
            '/images/Apartment_Kitchen_Counter_view.jpg',
            '/images/Apartment_Kitchen_Cupboard_view.jpg'
        ]
    }
];

export const amenities = [
    { name: 'Rooftop Bar', icon: 'Wine' },
    { name: 'High-speed WiFi', icon: 'Wifi' },
    { name: 'Free Parking', icon: 'Car' },
    { name: '24/7 Security', icon: 'ShieldCheck' },
    { name: 'Kitchen Facilities', icon: 'Utensils' },
    { name: 'AC & Heating', icon: 'Thermometer' }
];

export const testimonials = [
    {
        id: 't-1',
        name: 'Sarah Johnson',
        role: 'Business Traveler',
        content: 'Unica House exceeded all my expectations. The modern design and welcoming atmosphere made my stay truly memorable.',
        avatar: '/images/UNICA_Bedroom_view.jpg' // Placeholder
    },
    {
        id: 't-2',
        name: 'Michael Chen',
        role: 'Digital Nomad',
        content: 'The 2-bedroom apartment was perfect for my long-term stay. Having a full kitchen and a dedicated work area was a game changer.',
        avatar: '/images/Apartment_Kitchen_Counter_view.jpg' // Placeholder
    }
];
