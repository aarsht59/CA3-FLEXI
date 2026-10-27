/**
 * RentalWheels - Professional Modern Car Rental Platform
 * Pure React frontend connected to native Node.js HTTP backend and MongoDB.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './AuthContext.tsx';
import { Car, Booking, PlatformStats, DatabaseStatusInfo } from './types.ts';
import { fetchCars, fetchBookings, fetchStats, fetchDbStatus, reconnectDb } from './api.ts';

import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CarDetailModal } from './components/CarDetailModal.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { MongoCompassModal } from './components/MongoCompassModal.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { ExploreCarsPage } from './pages/ExploreCarsPage.tsx';
import { UserDashboardPage } from './pages/UserDashboardPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';

import { CheckCircle2, AlertTriangle, RefreshCw, Database } from 'lucide-react';

function RentalWheelsApp() {
  const { user, isAdmin } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'user-dashboard' | 'admin-dashboard'>('home');
  const [exploreCategory, setExploreCategory] = useState<string | undefined>(undefined);
  const [exploreLocation, setExploreLocation] = useState<string | undefined>(undefined);

  // Data States
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [dbInfo, setDbInfo] = useState<DatabaseStatusInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);

  // Modals
  const [detailCar, setDetailCar] = useState<Car | null>(null);
  const [bookingCar, setBookingCar] = useState<Car | null>(null);
  const [pendingBookingCar, setPendingBookingCar] = useState<Car | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);
  const [authModalState, setAuthModalState] = useState<{ open: boolean; tab: 'login' | 'register' }>({
    open: false,
    tab: 'login'
  });
  const [isCompassModalOpen, setIsCompassModalOpen] = useState(false);

  // Toast Notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // Fetch all initial data from native Node.js backend
  const loadData = useCallback(async () => {
    try {
      const [carsData, bookingsData, statsData, dbStatusData] = await Promise.all([
        fetchCars().catch(err => {
          console.error('Cars fetch error:', err);
          return [];
        }),
        fetchBookings().catch(err => {
          console.error('Bookings fetch error:', err);
          return [];
        }),
        fetchStats().catch(() => null),
        fetchDbStatus().catch(() => null)
      ]);
      setCars(carsData);
      setBookings(bookingsData);
      if (statsData) setStats(statsData);
      if (dbStatusData) setDbInfo(dbStatusData);
    } catch (err: any) {
      console.error('Failed to load fleet data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // When user logs in, if they had clicked "Book" while logged out, auto-open the booking modal!
  useEffect(() => {
    if (user && pendingBookingCar) {
      setBookingCar(pendingBookingCar);
      setPendingBookingCar(null);
    }
  }, [user, pendingBookingCar]);

  // Navigate to Explore with pre-selected filters
  const handleExploreFleet = (filters?: { category?: string; location?: string; search?: string }) => {
    if (filters?.category) setExploreCategory(filters.category);
    if (filters?.location) setExploreLocation(filters.location);
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open booking modal (enforcing login first)
  const handleBookNow = (car: Car) => {
    if (!user) {
      setPendingBookingCar(car);
      setAuthModalState({ open: true, tab: 'login' });
      showToast('Please sign in or register to reserve this vehicle.');
      return;
    }
    setBookingCar(car);
  };

  // On successful booking
  const handleBookingSuccess = (newBooking: Booking) => {
    setBookingCar(null);
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Reservation confirmed! Ref: ${newBooking.bookingRef}`);
    setReceiptBooking(newBooking);
    loadData();
  };

  // Handle reconnecting to MongoDB
  const handleReconnectDb = async () => {
    setReconnecting(true);
    try {
      const status = await reconnectDb();
      setDbInfo(status);
      await loadData();
      if (status.isMongoConnected) {
        showToast('Successfully connected to MongoDB database!');
      } else {
        showToast('MongoDB is offline on mongodb://127.0.0.1:27017. Ensure mongod is running.');
      }
    } catch {
      showToast('Connection attempt failed.');
    } finally {
      setReconnecting(false);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle2 size={18} color="#60a5fa" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Prominent Database Connection Warning Banner if MongoDB is disconnected */}
      {dbInfo && !dbInfo.isMongoConnected && (
        <div className="db-alert-banner">
          <div className="db-alert-content">
            <AlertTriangle size={18} color="#dc2626" />
            <span>
              <strong>MongoDB Disconnected:</strong> Cannot reach <code>{dbInfo.uri || 'mongodb://127.0.0.1:27017/rentalwheels'}</code>. Launch MongoDB Compass to manage collections.
            </span>
          </div>
          <div className="db-alert-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleReconnectDb}
              disabled={reconnecting}
              style={{ backgroundColor: '#ffffff', borderColor: '#fca5a5', color: '#991b1b', padding: '4px 10px', fontSize: '12px' }}
            >
              <RefreshCw size={13} className={reconnecting ? 'animate-spin' : ''} />
              <span>{reconnecting ? 'Connecting...' : 'Test Connection'}</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsCompassModalOpen(true)}
              style={{ padding: '4px 10px', fontSize: '12px' }}
            >
              <Database size={13} />
              <span>Compass Guide</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openAuthModal={(tab = 'login') => setAuthModalState({ open: true, tab })}
        openCompassModal={() => setIsCompassModalOpen(true)}
        isMongoOnline={dbInfo?.isMongoConnected || false}
      />

      {/* Content Router */}
      <main className="main-content">
        {activeTab === 'home' && (
          <HomePage
            cars={cars}
            onViewDetails={(car) => setDetailCar(car)}
            onBookNow={handleBookNow}
            onExploreFleet={handleExploreFleet}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreCarsPage
            cars={cars}
            initialCategory={exploreCategory}
            initialLocation={exploreLocation}
            onViewDetails={(car) => setDetailCar(car)}
            onBookNow={handleBookNow}
          />
        )}

        {activeTab === 'user-dashboard' && (
          <UserDashboardPage
            bookings={bookings}
            onRefreshBookings={loadData}
            onViewReceipt={(b) => setReceiptBooking(b)}
            onExploreFleet={() => handleExploreFleet()}
            onOpenAuth={(tab) => setAuthModalState({ open: true, tab: tab || 'login' })}
            onNotify={showToast}
          />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboardPage
            cars={cars}
            bookings={bookings}
            stats={stats}
            dbInfo={dbInfo}
            onRefreshAll={loadData}
            onNotify={showToast}
            openCompassModal={() => setIsCompassModalOpen(true)}
            onOpenAuth={(tab) => setAuthModalState({ open: true, tab: tab || 'login' })}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openCompassModal={() => setIsCompassModalOpen(true)}
      />

      {/* MODALS */}
      {detailCar && (
        <CarDetailModal
          car={detailCar}
          onClose={() => setDetailCar(null)}
          onBookNow={handleBookNow}
        />
      )}

      {bookingCar && (
        <BookingModal
          car={bookingCar}
          existingBookings={bookings}
          onClose={() => setBookingCar(null)}
          onOpenAuth={(tab) => setAuthModalState({ open: true, tab: tab || 'login' })}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {receiptBooking && (
        <ReceiptModal
          booking={receiptBooking}
          onClose={() => setReceiptBooking(null)}
        />
      )}

      <AuthModal
        isOpen={authModalState.open}
        initialTab={authModalState.tab}
        onClose={() => setAuthModalState({ open: false, tab: 'login' })}
        onSuccessNotice={showToast}
      />

      <MongoCompassModal
        isOpen={isCompassModalOpen}
        onClose={() => setIsCompassModalOpen(false)}
        dbInfo={dbInfo}
        onRefreshInfo={loadData}
        onNotify={showToast}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RentalWheelsApp />
    </AuthProvider>
  );
}
