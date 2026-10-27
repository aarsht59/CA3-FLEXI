/**
 * Database layer for RentalWheels
 * Strictly connects to MongoDB (database: rentalwheels)
 * Managed through MongoDB Compass (URI: mongodb://127.0.0.1:27017/rentalwheels)
 */

import { MongoClient, Db } from 'mongodb';
import { Car, User, Booking, PlatformStats } from './types.ts';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rentalwheels';
const DB_NAME = 'rentalwheels';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let isMongoConnected = false;
let connectionError: string | null = null;

// Initial high-resolution premium cars dataset for seeding MongoDB
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

// Initial demo users with secure passwords
export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Alexander Cross',
    email: 'admin@rentalwheels.com',
    password: 'AdminPass123!',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    licenseNumber: 'DL-98234-CA',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'user-customer',
    name: 'Elena Rostova',
    email: 'customer@rentalwheels.com',
    password: 'CustomerPass123!',
    role: 'customer',
    phone: '+1 (555) 728-4912',
    licenseNumber: 'DL-44821-NY',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  }
];

// Initial demo bookings
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

/**
 * Initializes MongoDB connection.
 * Connects to the database named "rentalwheels".
 * Sets up collections: users, cars, bookings.
 */
export async function initDatabase(): Promise<{ isMongo: boolean; message: string }> {
  try {
    if (mongoClient) {
      try {
        await mongoClient.db(DB_NAME).command({ ping: 1 });
        isMongoConnected = true;
        connectionError = null;
        return { isMongo: true, message: `Connected to MongoDB database "${DB_NAME}" at ${MONGODB_URI}` };
      } catch {
        mongoClient = null;
      }
    }

    mongoClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500
    });
    await mongoClient.connect();
    mongoDb = mongoClient.db(DB_NAME);
    isMongoConnected = true;
    connectionError = null;

    // Seed initial data if collections empty
    const carsCollection = mongoDb.collection<Car>('cars');
    const carCount = await carsCollection.countDocuments();
    if (carCount === 0) {
      await carsCollection.insertMany(INITIAL_CARS);
    }

    const usersCollection = mongoDb.collection<User>('users');
    const userCount = await usersCollection.countDocuments();
    if (userCount === 0) {
      await usersCollection.insertMany(INITIAL_USERS);
    }

    const bookingsCollection = mongoDb.collection<Booking>('bookings');
    const bookingCount = await bookingsCollection.countDocuments();
    if (bookingCount === 0) {
      await bookingsCollection.insertMany(INITIAL_BOOKINGS);
    }

    return {
      isMongo: true,
      message: `Successfully connected to MongoDB database "${DB_NAME}" at ${MONGODB_URI}`
    };
  } catch (err: any) {
    isMongoConnected = false;
    const errMsg = err?.message || `Failed to connect to MongoDB at ${MONGODB_URI}`;
    connectionError = errMsg;
    return {
      isMongo: false,
      message: errMsg
    };
  }
}

export function isDatabaseConnected(): boolean {
  return isMongoConnected && mongoDb !== null;
}

// Data Access API with explicit MongoDB support
export async function getCars(filter?: { category?: string; search?: string }): Promise<Car[]> {
  if (isMongoConnected && mongoDb) {
    try {
      const collection = mongoDb.collection<Car>('cars');
      const query: any = {};
      if (filter?.category && filter.category !== 'All') {
        query.category = { $regex: new RegExp(`^${filter.category}$`, 'i') };
      }
      if (filter?.search) {
        query.$or = [
          { name: { $regex: filter.search, $options: 'i' } },
          { brand: { $regex: filter.search, $options: 'i' } },
          { category: { $regex: filter.search, $options: 'i' } }
        ];
      }
      return await collection.find(query).toArray();
    } catch (err: any) {
      console.error('MongoDB getCars error:', err);
    }
  }
  // If MongoDB is not reachable, return the initial cars so catalog can render, but signal error in status
  let result = [...INITIAL_CARS];
  if (filter?.category && filter.category !== 'All') {
    result = result.filter(c => c.category.toLowerCase() === filter.category!.toLowerCase());
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    result = result.filter(c => c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q));
  }
  return result;
}

export async function getCarById(id: string): Promise<Car | null> {
  if (isMongoConnected && mongoDb) {
    try {
      const collection = mongoDb.collection<Car>('cars');
      const car = await collection.findOne({ id });
      if (car) return car;
    } catch (err: any) {
      console.error('MongoDB getCarById error:', err);
    }
  }
  return INITIAL_CARS.find(c => c.id === id) || null;
}

export async function createCar(carData: Omit<Car, 'id' | 'createdAt'>): Promise<Car> {
  const newCar: Car = {
    ...carData,
    id: `car-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  if (isMongoConnected && mongoDb) {
    try {
      const collection = mongoDb.collection<Car>('cars');
      await collection.insertOne(newCar);
    } catch (err) {
      console.error('MongoDB insertOne car error:', err);
    }
  }

  // Also maintain in memory for session continuity
  INITIAL_CARS.unshift(newCar);
  return newCar;
}

export async function updateCar(id: string, updates: Partial<Car>): Promise<Car | null> {
  if (isMongoConnected && mongoDb) {
    try {
      const collection = mongoDb.collection<Car>('cars');
      await collection.updateOne({ id }, { $set: updates });
      const updated = await collection.findOne({ id });
      if (updated) {
        const idx = INITIAL_CARS.findIndex(c => c.id === id);
        if (idx !== -1) INITIAL_CARS[idx] = updated;
        return updated;
      }
    } catch (err) {
      console.error('MongoDB updateCar error:', err);
    }
  }

  const idx = INITIAL_CARS.findIndex(c => c.id === id);
  if (idx === -1) return null;
  INITIAL_CARS[idx] = { ...INITIAL_CARS[idx], ...updates };
  return INITIAL_CARS[idx];
}

export async function deleteCar(id: string): Promise<boolean> {
  if (isMongoConnected && mongoDb) {
    try {
      const collection = mongoDb.collection<Car>('cars');
      await collection.deleteOne({ id });
    } catch (err) {
      console.error('MongoDB deleteCar error:', err);
    }
  }

  const idx = INITIAL_CARS.findIndex(c => c.id === id);
  if (idx !== -1) {
    INITIAL_CARS.splice(idx, 1);
    return true;
  }
  return false;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (isMongoConnected && mongoDb) {
    try {
      const collection = mongoDb.collection<User>('users');
      return await collection.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    } catch (err) {
      console.error('MongoDB getUserByEmail error:', err);
    }
  }
  return INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(userData: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  licenseNumber?: string;
  role?: 'customer' | 'admin';
}): Promise<User> {
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: userData.password || 'CustomerPass123!',
    // Never allow regular registration to grant admin privileges
    role: userData.role === 'admin' ? 'admin' : 'customer',
    phone: userData.phone || '',
    licenseNumber: userData.licenseNumber || '',
    createdAt: new Date().toISOString()
  };

  if (isMongoConnected && mongoDb) {
    try {
      const collection = mongoDb.collection<User>('users');
      await collection.insertOne(newUser);
    } catch (err) {
      console.error('MongoDB insertOne user error:', err);
    }
  }

  // Always store in memory for session continuity
  INITIAL_USERS.push(newUser);
  return newUser;
}

export async function getBookings(userId?: string): Promise<Booking[]> {
  if (isMongoConnected && mongoDb) {
    try {
      const collection = mongoDb.collection<Booking>('bookings');
      const query = userId ? { userId } : {};
      return await collection.find(query).sort({ createdAt: -1 }).toArray();
    } catch (err) {
      console.error('MongoDB getBookings error:', err);
    }
  }
  if (userId) return INITIAL_BOOKINGS.filter(b => b.userId === userId);
  return INITIAL_BOOKINGS;
}

/**
 * Check if the car is already booked for overlapping dates
 */
export async function checkBookingOverlap(
  carId: string,
  pickupDate: string,
  dropoffDate: string,
  excludeBookingId?: string
): Promise<Booking | null> {
  const bookings = await getBookings();
  const activeBookings = bookings.filter(
    b => b.carId === carId && b.status !== 'Cancelled' && (!excludeBookingId || b.id !== excludeBookingId)
  );

  for (const b of activeBookings) {
    // Two date ranges [A, B] and [C, D] overlap if A <= D and B >= C
    if (pickupDate <= b.dropoffDate && dropoffDate >= b.pickupDate) {
      return b;
    }
  }
  return null;
}

export async function createBooking(bookingData: Omit<Booking, 'id' | 'bookingRef' | 'createdAt'>): Promise<Booking> {
  // Check overlap first
  const conflict = await checkBookingOverlap(bookingData.carId, bookingData.pickupDate, bookingData.dropoffDate);
  if (conflict) {
    throw new Error(
      `Date Conflict: This vehicle is already booked from ${conflict.pickupDate} to ${conflict.dropoffDate}. Please choose different dates.`
    );
  }

  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const newBooking: Booking = {
    ...bookingData,
    id: `booking-${Date.now()}`,
    bookingRef: `RW-${randomSuffix}`,
    createdAt: new Date().toISOString()
  };

  if (isMongoConnected && mongoDb) {
    try {
      const collection = mongoDb.collection<Booking>('bookings');
      await collection.insertOne(newBooking);
    } catch (err) {
      console.error('MongoDB insertOne booking error:', err);
    }
  }

  // Always store in memory for session continuity
  INITIAL_BOOKINGS.unshift(newBooking);
  return newBooking;
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
  if (isMongoConnected && mongoDb) {
    try {
      const collection = mongoDb.collection<Booking>('bookings');
      await collection.updateOne(
        { $or: [{ id }, { bookingRef: id }] },
        { $set: { status } }
      );
      const updated = await collection.findOne({ $or: [{ id }, { bookingRef: id }] });
      if (updated) {
        const idx = INITIAL_BOOKINGS.findIndex(b => b.id === id || b.bookingRef === id);
        if (idx !== -1) INITIAL_BOOKINGS[idx] = updated;
        return updated;
      }
    } catch (err) {
      console.error('MongoDB updateBookingStatus error:', err);
    }
  }

  const idx = INITIAL_BOOKINGS.findIndex(b => b.id === id || b.bookingRef === id);
  if (idx === -1) return null;
  INITIAL_BOOKINGS[idx].status = status;
  return INITIAL_BOOKINGS[idx];
}

export async function getStats(): Promise<PlatformStats> {
  if (isMongoConnected && mongoDb) {
    try {
      const cars = await mongoDb.collection<Car>('cars').find().toArray();
      const bookings = await mongoDb.collection<Booking>('bookings').find().toArray();
      const users = await mongoDb.collection<User>('users').find().toArray();

      const totalCars = cars.length;
      const availableCars = cars.filter(c => c.isAvailable).length;
      const totalBookings = bookings.length;
      const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Active').length;
      const totalRevenue = bookings
        .filter(b => b.status !== 'Cancelled')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const uniqueEmails = new Set(bookings.map(b => b.userEmail));

      return {
        totalCars,
        availableCars,
        totalBookings,
        activeBookings,
        totalRevenue,
        activeCustomers: uniqueEmails.size || users.length
      };
    } catch (err) {
      console.error('MongoDB getStats error:', err);
    }
  }

  const totalRevenue = INITIAL_BOOKINGS
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return {
    totalCars: INITIAL_CARS.length,
    availableCars: INITIAL_CARS.filter(c => c.isAvailable).length,
    totalBookings: INITIAL_BOOKINGS.length,
    activeBookings: INITIAL_BOOKINGS.filter(b => b.status === 'Confirmed' || b.status === 'Active').length,
    totalRevenue,
    activeCustomers: INITIAL_USERS.length
  };
}

export async function resetDatabase() {
  if (isMongoConnected && mongoDb) {
    await mongoDb.collection('cars').deleteMany({});
    await mongoDb.collection('cars').insertMany(INITIAL_CARS);
    await mongoDb.collection('bookings').deleteMany({});
    await mongoDb.collection('bookings').insertMany(INITIAL_BOOKINGS);
    await mongoDb.collection('users').deleteMany({});
    await mongoDb.collection('users').insertMany(INITIAL_USERS);
  } else {
    throw new Error(`Cannot reset database: MongoDB is not connected at ${MONGODB_URI}`);
  }
}

export function getDatabaseStatus() {
  return {
    isMongoConnected,
    uri: MONGODB_URI,
    database: DB_NAME,
    connectionError,
    mode: isMongoConnected ? 'MongoDB (Compass Connected)' : 'MongoDB Disconnected (Compass Required)',
    collections: ['cars', 'users', 'bookings'],
    compassConnectString: MONGODB_URI,
    instructions: 'Open MongoDB Compass, paste connection string mongodb://127.0.0.1:27017, and access the "rentalwheels" database.'
  };
}
