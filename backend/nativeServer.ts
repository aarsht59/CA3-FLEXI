/**
 * Native Node.js HTTP Backend Server for RentalWheels
 * Strictly uses native Node.js 'http' and 'url' modules - NO Express.js.
 */

import { IncomingMessage, ServerResponse } from 'node:http';
import { parse as parseUrl } from 'node:url';
import {
  initDatabase,
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getUserByEmail,
  createUser,
  getBookings,
  createBooking,
  updateBookingStatus,
  getStats,
  resetDatabase,
  getDatabaseStatus,
  isDatabaseConnected
} from './db.ts';

// Trigger database connection on startup
initDatabase().catch(err => {
  console.log('[RentalWheels MongoDB Status]:', err?.message);
});

/**
 * Helper to parse JSON body from incoming stream using native Node.js events
 */
function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (e) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', (err) => reject(err));
  });
}

/**
 * Helper to send JSON response using native Node.js ServerResponse
 */
function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

/**
 * Native Node.js HTTP Request Handler
 * Returns true if request was handled, false otherwise.
 */
export async function handleNativeApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const method = req.method?.toUpperCase() || 'GET';
  const parsed = parseUrl(req.url || '', true);
  const pathname = parsed.pathname || '';
  const query = parsed.query;

  // Only handle /api endpoints
  if (!pathname.startsWith('/api')) {
    return false;
  }

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return true;
  }

  try {
    // 1. CARS API
    // GET /api/cars
    if (method === 'GET' && pathname === '/api/cars') {
      const category = typeof query.category === 'string' ? query.category : undefined;
      const search = typeof query.search === 'string' ? query.search : undefined;
      const cars = await getCars({ category, search });
      sendJson(res, 200, { success: true, count: cars.length, data: cars });
      return true;
    }

    // GET /api/cars/:id
    const carIdMatch = pathname.match(/^\/api\/cars\/([^/]+)$/);
    if (method === 'GET' && carIdMatch) {
      const carId = decodeURIComponent(carIdMatch[1]);
      const car = await getCarById(carId);
      if (!car) {
        sendJson(res, 404, { success: false, error: 'Vehicle not found' });
        return true;
      }
      sendJson(res, 200, { success: true, data: car });
      return true;
    }

    // POST /api/cars (Admin add car to MongoDB)
    if (method === 'POST' && pathname === '/api/cars') {
      const body = await parseJsonBody(req);
      if (!body.name || !body.brand || !body.pricePerDay) {
        sendJson(res, 400, { success: false, error: 'Name, brand, and daily price are required' });
        return true;
      }
      const newCar = await createCar(body);
      sendJson(res, 201, { success: true, message: 'Vehicle added successfully', data: newCar });
      return true;
    }

    // PUT /api/cars/:id (Admin edit / toggle car in MongoDB)
    if (method === 'PUT' && carIdMatch) {
      const carId = decodeURIComponent(carIdMatch[1]);
      const body = await parseJsonBody(req);
      const updatedCar = await updateCar(carId, body);
      if (!updatedCar) {
        sendJson(res, 404, { success: false, error: 'Vehicle not found to update' });
        return true;
      }
      sendJson(res, 200, { success: true, message: 'Vehicle updated', data: updatedCar });
      return true;
    }

    // DELETE /api/cars/:id (Admin delete car from MongoDB)
    if (method === 'DELETE' && carIdMatch) {
      const carId = decodeURIComponent(carIdMatch[1]);
      const deleted = await deleteCar(carId);
      if (!deleted) {
        sendJson(res, 404, { success: false, error: 'Vehicle not found' });
        return true;
      }
      sendJson(res, 200, { success: true, message: 'Vehicle deleted from fleet' });
      return true;
    }

    // 2. BOOKINGS API
    // GET /api/bookings
    if (method === 'GET' && pathname === '/api/bookings') {
      const userId = typeof query.userId === 'string' ? query.userId : undefined;
      const bookings = await getBookings(userId);
      sendJson(res, 200, { success: true, count: bookings.length, data: bookings });
      return true;
    }

    // POST /api/bookings (Create booking in MongoDB with overlap check)
    if (method === 'POST' && pathname === '/api/bookings') {
      const body = await parseJsonBody(req);
      if (!body.carId || !body.pickupDate || !body.dropoffDate || !body.userEmail) {
        sendJson(res, 400, { success: false, error: 'Missing required booking fields (vehicle, dates, or email)' });
        return true;
      }

      // Validate date order
      if (new Date(body.dropoffDate) <= new Date(body.pickupDate)) {
        sendJson(res, 400, { success: false, error: 'Drop-off date must be after pick-up date' });
        return true;
      }

      try {
        const booking = await createBooking(body);
        sendJson(res, 201, { success: true, message: 'Booking confirmed successfully', data: booking });
      } catch (err: any) {
        sendJson(res, 400, { success: false, error: err.message });
      }
      return true;
    }

    // PUT /api/bookings/:id/status
    const bookingStatusMatch = pathname.match(/^\/api\/bookings\/([^/]+)\/status$/);
    if (method === 'PUT' && bookingStatusMatch) {
      const bookingId = decodeURIComponent(bookingStatusMatch[1]);
      const body = await parseJsonBody(req);
      if (!body.status) {
        sendJson(res, 400, { success: false, error: 'Status is required' });
        return true;
      }
      const updatedBooking = await updateBookingStatus(bookingId, body.status);
      if (!updatedBooking) {
        sendJson(res, 404, { success: false, error: 'Booking not found' });
        return true;
      }
      sendJson(res, 200, { success: true, message: 'Booking status updated', data: updatedBooking });
      return true;
    }

    // PATCH/POST /api/bookings/:id/cancel
    const bookingCancelMatch = pathname.match(/^\/api\/bookings\/([^/]+)\/cancel$/);
    if ((method === 'PATCH' || method === 'POST') && bookingCancelMatch) {
      const bookingId = decodeURIComponent(bookingCancelMatch[1]);
      const updatedBooking = await updateBookingStatus(bookingId, 'Cancelled');
      if (!updatedBooking) {
        sendJson(res, 404, { success: false, error: 'Booking not found' });
        return true;
      }
      sendJson(res, 200, { success: true, message: 'Booking cancelled successfully', data: updatedBooking });
      return true;
    }

    // 3. AUTH API
    // POST /api/auth/login
    if (method === 'POST' && pathname === '/api/auth/login') {
      const body = await parseJsonBody(req);
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';

      if (!email || !password) {
        sendJson(res, 400, { success: false, error: 'Email and password are required' });
        return true;
      }

      const user = await getUserByEmail(email);

      // Verify user existence and password
      if (!user) {
        sendJson(res, 401, { success: false, error: 'Invalid email or password' });
        return true;
      }

      if (user.password && user.password !== password) {
        sendJson(res, 401, { success: false, error: 'Invalid email or password' });
        return true;
      }

      // Return user without password
      const { password: _, ...safeUser } = user;
      sendJson(res, 200, {
        success: true,
        message: 'Signed in successfully',
        data: { user: safeUser, token: `rw-token-${user.id}` }
      });
      return true;
    }

    // POST /api/auth/register
    if (method === 'POST' && pathname === '/api/auth/register') {
      const body = await parseJsonBody(req);
      const name = (body.name || '').trim();
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';
      const phone = (body.phone || '').trim();
      const licenseNumber = (body.licenseNumber || '').trim();

      // Input validation
      if (!name) {
        sendJson(res, 400, { success: false, error: 'Full name is required' });
        return true;
      }
      if (!email || !email.includes('@') || !email.includes('.')) {
        sendJson(res, 400, { success: false, error: 'Please enter a valid email address' });
        return true;
      }
      if (!password || password.length < 6) {
        sendJson(res, 400, { success: false, error: 'Password must be at least 6 characters long' });
        return true;
      }
      if (!phone) {
        sendJson(res, 400, { success: false, error: 'Contact phone number is required' });
        return true;
      }
      if (!licenseNumber) {
        sendJson(res, 400, { success: false, error: "Driver's license number is required" });
        return true;
      }

      const existing = await getUserByEmail(email);
      if (existing) {
        sendJson(res, 409, { success: false, error: 'An account with this email already exists. Please log in.' });
        return true;
      }

      // Role is ALWAYS customer for new user registration
      const newUser = await createUser({
        name,
        email,
        password,
        phone,
        licenseNumber,
        role: 'customer'
      });

      const { password: _, ...safeUser } = newUser;
      sendJson(res, 201, {
        success: true,
        message: 'Account created successfully',
        data: { user: safeUser, token: `rw-token-${newUser.id}` }
      });
      return true;
    }

    // GET /api/auth/me
    if (method === 'GET' && pathname === '/api/auth/me') {
      const email = typeof query.email === 'string' ? query.email.toLowerCase() : '';
      if (!email) {
        sendJson(res, 400, { success: false, error: 'Email parameter required' });
        return true;
      }
      const user = await getUserByEmail(email);
      if (!user) {
        sendJson(res, 404, { success: false, error: 'User not found' });
        return true;
      }
      const { password: _, ...safeUser } = user;
      sendJson(res, 200, { success: true, data: safeUser });
      return true;
    }

    // 4. STATS & ANALYTICS API (For Admin Dashboard)
    // GET /api/stats
    if (method === 'GET' && pathname === '/api/stats') {
      const stats = await getStats();
      sendJson(res, 200, { success: true, data: stats });
      return true;
    }

    // 5. DATABASE & MONGODB COMPASS STATUS
    // GET /api/db/status
    if (method === 'GET' && pathname === '/api/db/status') {
      const dbInfo = getDatabaseStatus();
      sendJson(res, 200, { success: true, data: dbInfo });
      return true;
    }

    // POST /api/db/reconnect
    if (method === 'POST' && pathname === '/api/db/reconnect') {
      const result = await initDatabase();
      sendJson(res, 200, { success: result.isMongo, message: result.message, data: getDatabaseStatus() });
      return true;
    }

    // POST /api/db/reset
    if (method === 'POST' && pathname === '/api/db/reset') {
      await resetDatabase();
      sendJson(res, 200, { success: true, message: 'MongoDB collections reset to default' });
      return true;
    }

    // Route not found under /api
    sendJson(res, 404, { success: false, error: `Route ${method} ${pathname} not found` });
    return true;
  } catch (err: any) {
    sendJson(res, 500, { success: false, error: err?.message || 'Internal Server Error' });
    return true;
  }
}
