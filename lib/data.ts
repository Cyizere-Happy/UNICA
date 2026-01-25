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
        ]
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
        gallery: ['/Images/UNICA_Bedroom2_Bathroom_view.jpg']
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
        gallery: ['/Images/UNICA_Bedroom3_Bathroom_view.jpg']
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
        gallery: []
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
        gallery: []
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
        ]
    }
];

export const amenities = [
    { name: 'Rooftop Bar', icon: 'Wine' },
    { name: 'High-speed WiFi', icon: 'Wifi' },
    { name: 'Free Parking', icon: 'Car' },
    { name: '24/7 Security', icon: 'ShieldCheck' },
    { name: 'Kitchen Facilities', icon: 'Utensils' },
    { name: 'Heating System', icon: 'Thermometer' }
];

export const testimonials = [
    {
        id: 't-1',
        name: 'Sarah Johnson',
        role: 'Business Traveler',
        content: 'Unica House exceeded all my expectations. The modern design and welcoming atmosphere made my stay truly memorable.',
        avatar: '/Images/UNICA_Bedroom_view.jpg'
    },
    {
        id: 't-2',
        name: 'Michael Chen',
        role: 'Digital Nomad',
        content: 'The 2-bedroom apartment was perfect for my long-term stay. Having a full kitchen and a dedicated work area was a game changer.',
        avatar: '/Images/Apartment_Kitchen_Counter_view.jpg'
    },
    {
        id: 't-3',
        name: 'Elena Rodriguez',
        role: 'Retreat Guest',
        content: 'A truly peaceful sanctuary. The attention to detail in the interior design creates such a calming environment.',
        avatar: '/Images/UNICA_Bedroom3_view.jpg'
    },
    {
        id: 't-4',
        name: 'David Wilson',
        role: 'Family Vacation',
        content: 'Fantastic service and a beautiful property. Our kids loved the space, and the location was perfect for exploring.',
        avatar: '/Images/UNICA_Morning_Front_view.jpg'
    }
];
