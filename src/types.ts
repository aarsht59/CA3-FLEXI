export type CarCategory = 'Luxury' | 'Sports' | 'SUV' | 'Electric' | 'Sedan' | 'Convertible';

export interface CarSpecs {
  seats: number;
  doors: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Electric' | 'Petrol' | 'Hybrid' | 'Diesel';
  engineOrRange: string;
  acceleration: string;
  topSpeed: string;
  luggage: number;
  mpgOrEfficiency: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  pricePerDay: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  featured: boolean;
  imageUrl: string;
  galleryImages: string[];
  specs: CarSpecs;
  features: string[];
  location: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  licenseNumber?: string;
  avatarUrl?: string;
}

export interface Booking {
  id: string;
  bookingRef: string;
  carId: string;
  carName: string;
  carCategory: string;
  carImageUrl: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  licenseNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  rentalDays: number;
  dailyRate: number;
  protectionPlan: 'basic' | 'standard' | 'premium';
  protectionCost: number;
  addOns: {
    childSeat?: boolean;
    additionalDriver?: boolean;
    gpsNavigation?: boolean;
    roadsidePlus?: boolean;
  };
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
  createdAt: string;
  notes?: string;
}

export interface PlatformStats {
  totalCars: number;
  availableCars: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  activeCustomers: number;
}

export interface DatabaseStatusInfo {
  isMongoConnected: boolean;
  uri: string;
  database: string;
  mode: string;
  collections: string[];
  compassConnectString: string;
  instructions: string;
  connectionError: string | null;
}
