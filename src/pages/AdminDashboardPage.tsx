import React, { useState } from 'react';
import { Car, Booking, PlatformStats, DatabaseStatusInfo, CarCategory } from '../types.ts';
import { createCar, updateCar, deleteCar, updateBookingStatus, reconnectDb } from '../api.ts';
import { useAuth } from '../AuthContext.tsx';
import { 
  Car as CarIcon, 
  CalendarCheck, 
  DollarSign, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Database, 
  Search,
  X,
  ShieldAlert,
  RefreshCw,
  LogIn
} from 'lucide-react';

interface AdminDashboardPageProps {
  cars: Car[];
  bookings: Booking[];
  stats: PlatformStats | null;
  dbInfo: DatabaseStatusInfo | null;
  onRefreshAll: () => void;
  onNotify: (msg: string) => void;
  openCompassModal: () => void;
  onOpenAuth: (tab?: 'login' | 'register') => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  cars,
  bookings,
  stats,
  dbInfo,
  onRefreshAll,
  onNotify,
  openCompassModal,
  onOpenAuth
}) => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'fleet' | 'bookings'>('fleet');
  const [searchCar, setSearchCar] = useState('');
  const [bookingFilter, setBookingFilter] = useState<string>('All');
  const [reconnecting, setReconnecting] = useState(false);

  // Modal State
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formYear, setFormYear] = useState(2024);
  const [formCategory, setFormCategory] = useState<CarCategory>('Sports');
  const [formPrice, setFormPrice] = useState(250);
  const [formImage, setFormImage] = useState('');
  const [formSeats, setFormSeats] = useState(4);
  const [formTransmission, setFormTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [formFuelType, setFormFuelType] = useState<'Electric' | 'Petrol' | 'Hybrid' | 'Diesel'>('Petrol');
  const [formEngine, setFormEngine] = useState('3.0L Turbo 400 hp');
  const [formAcceleration, setFormAcceleration] = useState('3.5s 0-60mph');
  const [formLocation, setFormLocation] = useState('Downtown Executive Hub');
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [savingCar, setSavingCar] = useState(false);

  // ROUTE PROTECTION: Admin access strictly based on database role
  if (!user || !isAdmin) {
    return (
      <div className="section" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '520px' }}>
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}
          >
            <ShieldAlert size={32} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-black)', marginBottom: '8px' }}>
            Administrator Access Required
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
            This operations dashboard is restricted to authorized fleet administrators. Please log in with admin credentials.
          </p>
          <button 
            type="button" 
            className="btn btn-primary btn-lg"
            onClick={() => onOpenAuth('login')}
          >
            <LogIn size={16} />
            <span>Sign In with Admin Account</span>
          </button>
        </div>
      </div>
    );
  }

  const handleOpenAddCar = () => {
    setEditingCar(null);
    setFormName('');
    setFormBrand('');
    setFormModel('');
    setFormYear(2024);
    setFormCategory('Sports');
    setFormPrice(280);
    setFormImage('https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80');
    setFormSeats(4);
    setFormTransmission('Automatic');
    setFormFuelType('Petrol');
    setFormEngine('3.0L Twin-Turbo 382 hp');
    setFormAcceleration('3.8s 0-60mph');
    setFormLocation('Downtown Executive Hub');
    setFormIsAvailable(true);
    setFormFeatured(false);
    setIsCarModalOpen(true);
  };

  const handleOpenEditCar = (car: Car) => {
    setEditingCar(car);
    setFormName(car.name);
    setFormBrand(car.brand);
    setFormModel(car.model);
    setFormYear(car.year);
    setFormCategory(car.category);
    setFormPrice(car.pricePerDay);
    setFormImage(car.imageUrl);
    setFormSeats(car.specs.seats);
    setFormTransmission(car.specs.transmission);
    setFormFuelType(car.specs.fuelType);
    setFormEngine(car.specs.engineOrRange);
    setFormAcceleration(car.specs.acceleration);
    setFormLocation(car.location);
    setFormIsAvailable(car.isAvailable);
    setFormFeatured(car.featured);
    setIsCarModalOpen(true);
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCar(true);
    try {
      if (editingCar) {
        await updateCar(editingCar.id, {
          name: formName,
          brand: formBrand,
          model: formModel,
          year: formYear,
          category: formCategory,
          pricePerDay: formPrice,
          imageUrl: formImage,
          location: formLocation,
          isAvailable: formIsAvailable,
          featured: formFeatured,
          specs: {
            ...editingCar.specs,
            seats: formSeats,
            transmission: formTransmission,
            fuelType: formFuelType,
            engineOrRange: formEngine,
            acceleration: formAcceleration
          }
        });
        onNotify(`Vehicle "${formName}" updated in MongoDB.`);
      } else {
        await createCar({
          name: formName,
          brand: formBrand,
          model: formModel,
          year: formYear,
          category: formCategory,
          pricePerDay: formPrice,
          rating: 5.0,
          reviewCount: 1,
          isAvailable: formIsAvailable,
          featured: formFeatured,
          imageUrl: formImage,
          galleryImages: [formImage],
          specs: {
            seats: formSeats,
            doors: 4,
            transmission: formTransmission,
            fuelType: formFuelType,
            engineOrRange: formEngine,
            acceleration: formAcceleration,
            topSpeed: '160 mph',
            luggage: 3,
            mpgOrEfficiency: '24 MPG'
          },
          features: ['Navigation System', 'Apple CarPlay', 'Leather Interior'],
          location: formLocation
        });
        onNotify(`Vehicle "${formName}" saved to MongoDB.`);
      }
      setIsCarModalOpen(false);
      onRefreshAll();
    } catch (err: any) {
      onNotify(`Error: ${err.message || 'Failed to save vehicle'}`);
    } finally {
      setSavingCar(false);
    }
  };

  const handleDeleteCar = async (car: Car) => {
    if (!window.confirm(`Delete ${car.name} from MongoDB fleet collection?`)) return;
    try {
      await deleteCar(car.id);
      onNotify(`Vehicle "${car.name}" removed from MongoDB.`);
      onRefreshAll();
    } catch (err: any) {
      onNotify(err.message || 'Failed to delete vehicle.');
    }
  };

  const handleToggleAvailability = async (car: Car) => {
    try {
      await updateCar(car.id, { isAvailable: !car.isAvailable });
      onNotify(`Vehicle "${car.name}" set to ${!car.isAvailable ? 'Available' : 'Rented'}.`);
      onRefreshAll();
    } catch (err: any) {
      onNotify(err.message || 'Failed to update availability.');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      await updateBookingStatus(bookingId, status);
      onNotify(`Booking status changed to ${status} in MongoDB.`);
      onRefreshAll();
    } catch (err: any) {
      onNotify(err.message || 'Failed to update booking status.');
    }
  };

  const handleReconnectDb = async () => {
    setReconnecting(true);
    try {
      await reconnectDb();
      onRefreshAll();
      onNotify('MongoDB reconnection initiated.');
    } catch {
      onNotify('MongoDB reconnection failed. Ensure MongoDB is running on port 27017.');
    } finally {
      setReconnecting(false);
    }
  };

  const displayedCars = cars.filter(c => {
    if (!searchCar.trim()) return true;
    const q = searchCar.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
  });

  const displayedBookings = bookings.filter(b => {
    if (bookingFilter === 'All') return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="section" style={{ paddingTop: '36px' }}>
      <div className="container">
        {/* Title Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="section-subtitle">RentalWheels Control Room</div>
            <h1 className="section-title">Fleet & Operations Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleReconnectDb}
              disabled={reconnecting}
              title="Test and reconnect MongoDB connection"
            >
              <RefreshCw size={14} className={reconnecting ? 'animate-spin' : ''} />
              <span>{dbInfo?.isMongoConnected ? 'MongoDB Live' : 'Reconnect MongoDB'}</span>
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={openCompassModal}
            >
              <Database size={15} />
              <span>Compass Guide</span>
            </button>
            <button
              type="button"
              className="btn btn-blue"
              onClick={handleOpenAddCar}
            >
              <Plus size={16} />
              <span>Add Vehicle to Fleet</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="stats-grid-4">
          <div className="stat-card">
            <div className="stat-card-icon dark">
              <CarIcon size={22} />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-number">{stats?.totalCars || cars.length}</span>
              <span className="stat-card-label">Total Fleet Vehicles</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon">
              <CalendarCheck size={22} />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-number">{stats?.activeBookings || 0}</span>
              <span className="stat-card-label">Active Reservations</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon dark">
              <DollarSign size={22} />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-number">${stats?.totalRevenue || 0}</span>
              <span className="stat-card-label">Gross Rental Revenue</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon">
              <Users size={22} />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-number">{stats?.availableCars || 0}</span>
              <span className="stat-card-label">Vehicles Available</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('fleet')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'fleet' ? '2px solid var(--accent-blue)' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '15px',
              color: activeTab === 'fleet' ? 'var(--accent-black)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            Fleet Management ({cars.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'bookings' ? '2px solid var(--accent-blue)' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '15px',
              color: activeTab === 'bookings' ? 'var(--accent-black)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            Reservations & Bookings ({bookings.length})
          </button>
        </div>

        {/* TAB 1: FLEET MANAGEMENT */}
        {activeTab === 'fleet' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div className="search-box-pill" style={{ maxWidth: '340px' }}>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Filter vehicles by name or class..."
                  value={searchCar}
                  onChange={(e) => setSearchCar(e.target.value)}
                />
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Managing <strong>{displayedCars.length}</strong> vehicles in MongoDB collection
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Class</th>
                    <th>Powertrain</th>
                    <th>Daily Rate</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCars.map((car) => (
                    <tr key={car.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={car.imageUrl}
                            alt={car.name}
                            style={{ width: '56px', height: '38px', borderRadius: '4px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700 }}>{car.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {car.brand} • {car.year}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{car.category}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{car.specs.fuelType}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{car.specs.acceleration}</div>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--accent-blue)', fontSize: '15px' }}>
                        ${car.pricePerDay}<span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>/day</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(car)}
                          className={car.isAvailable ? 'badge badge-success' : 'badge badge-warning'}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="Click to toggle availability"
                        >
                          {car.isAvailable ? 'Available' : 'Rented Out'}
                        </button>
                      </td>
                      <td>
                        {car.featured ? (
                          <span className="badge badge-blue">Featured</span>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Standard</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => handleOpenEditCar(car)}
                            title="Edit Vehicle Specs"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteCar(car)}
                            title="Remove Vehicle"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'Confirmed', 'Active', 'Completed', 'Cancelled'].map(status => (
                  <button
                    key={status}
                    type="button"
                    className={`cat-pill ${bookingFilter === status ? 'active' : ''}`}
                    onClick={() => setBookingFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Showing <strong>{displayedBookings.length}</strong> bookings in MongoDB
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Rental Dates</th>
                    <th>Total</th>
                    <th>Current Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedBookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{b.bookingRef}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{b.userName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.userPhone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{b.carName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {b.rentalDays} Days • {b.protectionPlan.toUpperCase()} Protection
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px' }}>{b.pickupDate} → {b.dropoffDate}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.pickupLocation}</div>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--accent-blue)', fontSize: '15px' }}>
                        ${b.totalAmount}
                      </td>
                      <td>
                        <span className={
                          b.status === 'Confirmed' ? 'badge badge-blue' :
                          b.status === 'Active' ? 'badge badge-success' :
                          b.status === 'Completed' ? 'badge badge-neutral' : 'badge badge-warning'
                        }>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ width: 'auto', padding: '6px 10px', fontSize: '12px' }}
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as any)}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Active">In Progress (Picked Up)</option>
                          <option value="Completed">Completed (Returned)</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT CAR */}
        {isCarModalOpen && (
          <div className="modal-overlay" onClick={() => setIsCarModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingCar ? `Edit ${editingCar.name}` : 'Add New Vehicle to Fleet'}
                </h2>
                <button type="button" className="modal-close-btn" onClick={() => setIsCarModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCar}>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Vehicle Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Porsche 911 GT3"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Brand / Make</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formBrand}
                        onChange={(e) => setFormBrand(e.target.value)}
                        placeholder="e.g. Porsche"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Vehicle Category Class</label>
                      <select
                        className="form-select"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                      >
                        <option value="Sports">Sports</option>
                        <option value="Electric">Electric</option>
                        <option value="Luxury">Luxury</option>
                        <option value="SUV">SUV</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Sedan">Sedan</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Daily Rental Rate ($ USD)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formPrice}
                        min={50}
                        max={2000}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">High-Resolution Image URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      required
                    />
                    {formImage && (
                      <div style={{ marginTop: '8px', height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#0f172a' }}>
                        <img src={formImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Engine / Range Output</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formEngine}
                        onChange={(e) => setFormEngine(e.target.value)}
                        placeholder="e.g. 4.0L V8 500 hp or 320 mi range"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Acceleration (0-60mph)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formAcceleration}
                        onChange={(e) => setFormAcceleration(e.target.value)}
                        placeholder="e.g. 3.2s 0-60mph"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Transmission</label>
                      <select
                        className="form-select"
                        value={formTransmission}
                        onChange={(e) => setFormTransmission(e.target.value as any)}
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fuel / Powertrain</label>
                      <select
                        className="form-select"
                        value={formFuelType}
                        onChange={(e) => setFormFuelType(e.target.value as any)}
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Diesel">Diesel</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Seating Capacity</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formSeats}
                        min={2}
                        max={9}
                        onChange={(e) => setFormSeats(Number(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Hub Location</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={formIsAvailable}
                        onChange={(e) => setFormIsAvailable(e.target.checked)}
                      />
                      <span>Available for immediate reservation</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                      />
                      <span>Feature on Homepage</span>
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setIsCarModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-blue" disabled={savingCar}>
                    {savingCar ? 'Saving to MongoDB...' : editingCar ? 'Save Changes' : 'Add Vehicle to MongoDB'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
