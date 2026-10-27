import { Car, Booking, User, PlatformStats, DatabaseStatusInfo } from '../types.ts';

export const INITIAL_CARS: Car[] = [
  {
    id: 'car-1',
    name: 'Porsche 911 Carrera S',
    brand: 'Porsche',
    model: '911 Carrera S',
    year: 2024,
    category: 'Sports',
    pricePerDay: 320,
    originalPrice: 380,
    rating: 4.95,
    reviewCount: 48,
    isAvailable: true,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      seats: 4,
      doors: 2,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      engineOrRange: '3.0L Twin-Turbo Boxer 6 (443 hp)',
      acceleration: '3.3s 0-60mph',
      topSpeed: '191 mph',
      luggage: 2,
      mpgOrEfficiency: '20 / 27 MPG'
    },
    features: ['Sport Chrono Package', 'Bose Surround Sound', 'Apple CarPlay', 'Adaptive Cruise', 'Active Suspension'],
    location: 'Downtown Executive Hub',
    createdAt: new Date().toISOString()
  },
  {
    id: 'car-2',
    name: 'Tesla Model S Plaid',
    brand: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: 'Electric',
    pricePerDay: 260,
    originalPrice: 295,
    rating: 4.98,
    reviewCount: 64,
    isAvailable: true,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      seats: 5,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Electric',
      engineOrRange: '396 miles Tri-Motor AWD (1,020 hp)',
      acceleration: '1.99s 0-60mph',
      topSpeed: '200 mph',
      luggage: 4,
      mpgOrEfficiency: '120 MPGe'
    },
    features: ['Full Self-Driving Capability', 'Yoke Steering', 'Gaming Computer 10 Teraflops', 'Panoramic Glass Roof', 'Supercharger Access'],
    location: 'Airport Terminal 2 Valet',
    createdAt: new Date().toISOString()
  },
  {
    id: 'car-3',
    name: 'Mercedes-Benz G 63 AMG',
    brand: 'Mercedes-Benz',
    model: 'G 63 AMG',
    year: 2024,
    category: 'SUV',
    pricePerDay: 450,
    originalPrice: 520,
    rating: 4.92,
    reviewCount: 37,
    isAvailable: true,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      seats: 5,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      engineOrRange: '4.0L V8 Biturbo (577 hp)',
      acceleration: '4.5s 0-60mph',
      topSpeed: '149 mph',
      luggage: 5,
      mpgOrEfficiency: '13 / 15 MPG'
    },
    features: ['Burmester High-End 3D Audio', 'Nappa Leather Interior', 'Triple Locking Differentials', 'Ambient 64-color lighting'],
    location: 'Beverly Hills Luxury Plaza',
    createdAt: new Date().toISOString()
  },
  {
    id: 'car-4',
    name: 'BMW M4 Competition Coupe',
    brand: 'BMW',
    model: 'M4 Competition',
    year: 2024,
    category: 'Sports',
    pricePerDay: 280,
    originalPrice: 310,
    rating: 4.89,
    reviewCount: 42,
    isAvailable: true,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      seats: 4,
      doors: 2,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      engineOrRange: '3.0L M TwinPower Turbo Inline 6 (503 hp)',
      acceleration: '3.4s 0-60mph',
      topSpeed: '180 mph',
      luggage: 3,
      mpgOrEfficiency: '16 / 23 MPG'
    },
    features: ['M Carbon Bucket Seats', 'Harmon Kardon Audio', 'M Drive Professional', 'Laserlight Headlamps'],
    location: 'Metro Station West',
    createdAt: new Date().toISOString()
  },
  {
    id: 'car-5',
    name: 'Range Rover SV Autobiography',
    brand: 'Land Rover',
    model: 'Range Rover SV',
    year: 2024,
    category: 'Luxury',
    pricePerDay: 390,
    originalPrice: 440,
    rating: 4.96,
    reviewCount: 29,
    isAvailable: true,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      seats: 5,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      engineOrRange: '4.4L Twin-Turbo V8 (523 hp)',
      acceleration: '4.4s 0-60mph',
      topSpeed: '162 mph',
      luggage: 5,
      mpgOrEfficiency: '16 / 21 MPG'
    },
    features: ['Executive Class Comfort Plus Rear Seats', 'Meridian Signature Sound', 'All-Wheel Steering', 'Refrigerated Compartment'],
    location: 'Downtown Executive Hub',
    createdAt: new Date().toISOString()
  },
  {
    id: 'car-6',
    name: 'Audi RS e-tron GT',
    brand: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    category: 'Electric',
    pricePerDay: 295,
    originalPrice: 330,
    rating: 4.94,
    reviewCount: 31,
    isAvailable: true,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      seats: 4,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Electric',
      engineOrRange: '232 miles range (637 hp Boost)',
      acceleration: '3.1s 0-60mph',
      topSpeed: '155 mph',
      luggage: 3,
      mpgOrEfficiency: '85 MPGe'
    },
    features: ['Matrix LED with Audi Laser Light', 'Bang & Olufsen 3D Sound', 'All-Wheel Steering', 'Adaptive Air Suspension'],
    location: 'Financial District Station',
    createdAt: new Date().toISOString()
  },
  {
    id: 'car-7',
    name: 'Ford Mustang Dark Horse Convertible',
    brand: 'Ford',
    model: 'Mustang Dark Horse',
    year: 2024,
    category: 'Convertible',
    pricePerDay: 195,
    originalPrice: 230,
    rating: 4.87,
    reviewCount: 53,
    isAvailable: true,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      seats: 4,
      doors: 2,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      engineOrRange: '5.0L Coyote V8 (500 hp)',
      acceleration: '4.1s 0-60mph',
      topSpeed: '168 mph',
      luggage: 2,
      mpgOrEfficiency: '14 / 22 MPG'
    },
    features: ['Active Valve Performance Exhaust', 'Brembo Brake System', 'Digital Cockpit Displays', 'Open Air Power Soft Top'],
    location: 'Coastal Boulevard Marina',
    createdAt: new Date().toISOString()
  },
  {
    id: 'car-8',
    name: 'Mercedes-Benz S 580 4MATIC',
    brand: 'Mercedes-Benz',
    model: 'S 580 Sedan',
    year: 2024,
    category: 'Luxury',
    pricePerDay: 360,
    originalPrice: 410,
    rating: 4.97,
    reviewCount: 45,
    isAvailable: true,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      seats: 5,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      engineOrRange: '4.0L V8 Biturbo Mild Hybrid (496 hp)',
      acceleration: '4.4s 0-60mph',
      topSpeed: '130 mph',
      luggage: 4,
      mpgOrEfficiency: '19 / 28 MPG'
    },
    features: ['MBUX Augmented Reality Head-up Display', 'Massaging Executive Seats', 'Air Balance Fragrance System', 'Rear Axle Steering'],
    location: 'Downtown Executive Hub',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    bookingRef: 'RW-94281',
    carId: 'car-1',
    carName: 'Porsche 911 Carrera S',
    carCategory: 'Sports',
    carImageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    userId: 'user-customer',
    userName: 'Elena Rostova',
    userEmail: 'customer@rentalwheels.com',
    userPhone: '+1 (555) 728-4912',
    licenseNumber: 'DL-44821-NY',
    pickupLocation: 'Downtown Executive Hub',
    dropoffLocation: 'Downtown Executive Hub',
    pickupDate: '2026-11-02',
    dropoffDate: '2026-11-05',
    rentalDays: 3,
    dailyRate: 320,
    protectionPlan: 'premium',
    protectionCost: 90,
    addOns: { additionalDriver: true, roadsidePlus: true },
    subtotal: 960,
    tax: 96,
    totalAmount: 1146,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    notes: 'Please ensure full tank and sanitized interior upon pickup.'
  },
  {
    id: 'booking-2',
    bookingRef: 'RW-81729',
    carId: 'car-2',
    carName: 'Tesla Model S Plaid',
    carCategory: 'Electric',
    carImageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80',
    userId: 'user-customer',
    userName: 'Elena Rostova',
    userEmail: 'customer@rentalwheels.com',
    userPhone: '+1 (555) 728-4912',
    licenseNumber: 'DL-44821-NY',
    pickupLocation: 'Airport Terminal 2 Valet',
    dropoffLocation: 'Airport Terminal 2 Valet',
    pickupDate: '2026-10-10',
    dropoffDate: '2026-10-13',
    rentalDays: 3,
    dailyRate: 260,
    protectionPlan: 'standard',
    protectionCost: 60,
    addOns: { gpsNavigation: true },
    subtotal: 780,
    tax: 78,
    totalAmount: 918,
    status: 'Completed',
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString()
  }
];

export const INITIAL_STATS: PlatformStats = {
  totalCars: 8,
  availableCars: 8,
  totalBookings: 2,
  activeBookings: 1,
  totalRevenue: 2064,
  activeCustomers: 2
};

export const INITIAL_DB_STATUS: DatabaseStatusInfo = {
  isMongoConnected: false,
  uri: 'mongodb://127.0.0.1:27017/rentalwheels',
  database: 'rentalwheels',
  mode: 'In-Memory Store (Compass Ready)',
  collections: ['cars', 'users', 'bookings'],
  compassConnectString: 'mongodb://127.0.0.1:27017/rentalwheels',
  instructions: 'Open MongoDB Compass, paste connection string mongodb://127.0.0.1:27017, and access the "rentalwheels" database.',
  connectionError: null
};
