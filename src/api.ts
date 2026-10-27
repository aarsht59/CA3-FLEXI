import { Car, Booking, User, PlatformStats, DatabaseStatusInfo } from './types.ts';

const API_BASE = '/api';

export async function fetchCars(filter?: { category?: string; search?: string }): Promise<Car[]> {
  const params = new URLSearchParams();
  if (filter?.category && filter.category !== 'All') {
    params.append('category', filter.category);
  }
  if (filter?.search) {
    params.append('search', filter.search);
  }
  const url = `${API_BASE}/cars${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to fetch vehicles from database');
  }
  return json.data || [];
}

export async function fetchCarById(id: string): Promise<Car> {
  const res = await fetch(`${API_BASE}/cars/${encodeURIComponent(id)}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to fetch vehicle details');
  }
  return json.data;
}

export async function createCar(carData: Omit<Car, 'id' | 'createdAt'>): Promise<Car> {
  const res = await fetch(`${API_BASE}/cars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to add vehicle to fleet');
  }
  return json.data;
}

export async function updateCar(id: string, updates: Partial<Car>): Promise<Car> {
  const res = await fetch(`${API_BASE}/cars/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to update vehicle');
  }
  return json.data;
}

export async function deleteCar(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/cars/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to delete vehicle');
  }
  return true;
}

export async function fetchBookings(userId?: string): Promise<Booking[]> {
  const url = userId ? `${API_BASE}/bookings?userId=${encodeURIComponent(userId)}` : `${API_BASE}/bookings`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to fetch bookings from database');
  }
  return json.data || [];
}

export async function createBooking(bookingData: Omit<Booking, 'id' | 'bookingRef' | 'createdAt'>): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to create reservation');
  }
  return json.data;
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(id)}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to update reservation status');
  }
  return json.data;
}

export async function loginUser(email: string, password?: string): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to sign in. Please check your credentials.');
  }
  return json.data;
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  licenseNumber?: string;
}): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Registration failed.');
  }
  return json.data;
}

export async function fetchStats(): Promise<PlatformStats> {
  const res = await fetch(`${API_BASE}/stats`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to fetch platform metrics');
  }
  return json.data;
}

export async function fetchDbStatus(): Promise<DatabaseStatusInfo> {
  const res = await fetch(`${API_BASE}/db/status`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to fetch database status');
  }
  return json.data;
}

export async function reconnectDb(): Promise<DatabaseStatusInfo> {
  const res = await fetch(`${API_BASE}/db/reconnect`, { method: 'POST' });
  const json = await res.json();
  return json.data;
}

export async function resetFleetData(): Promise<void> {
  const res = await fetch(`${API_BASE}/db/reset`, { method: 'POST' });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to reset database');
  }
}
