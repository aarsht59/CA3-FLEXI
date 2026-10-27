import React, { useState, useMemo, useEffect } from 'react';
import { Car, Booking } from '../types.ts';
import { useAuth } from '../AuthContext.tsx';
import { createBooking } from '../api.ts';
import { 
  X, 
  CheckCircle, 
  User, 
  Mail, 
  Phone, 
  FileText,
  AlertCircle,
  Car as CarIcon,
  LogIn
} from 'lucide-react';

interface BookingModalProps {
  car: Car | null;
  existingBookings?: Booking[];
  onClose: () => void;
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onBookingSuccess: (booking: Booking) => void;
}

const PICKUP_LOCATIONS = [
  'Downtown Executive Hub (Main Terminal)',
  'Airport Terminal 2 Valet & Key Drop',
  'Beverly Hills Luxury Plaza',
  'Financial District Station',
  'Coastal Boulevard Marina Station'
];

export const BookingModal: React.FC<BookingModalProps> = ({ 
  car, 
  existingBookings = [],
  onClose, 
  onOpenAuth,
  onBookingSuccess 
}) => {
  const { user } = useAuth();

  // Booking details state
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const [dropoffDate, setDropoffDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });

  const [pickupLocation, setPickupLocation] = useState(PICKUP_LOCATIONS[0]);
  const [dropoffLocation, setDropoffLocation] = useState(PICKUP_LOCATIONS[0]);

  // Driver details state
  const [driverName, setDriverName] = useState(user?.name || '');
  const [driverEmail, setDriverEmail] = useState(user?.email || '');
  const [driverPhone, setDriverPhone] = useState(user?.phone || '');
  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber || '');
  const [specialNotes, setSpecialNotes] = useState('');

  // Protection plan
  const [protectionPlan, setProtectionPlan] = useState<'basic' | 'standard' | 'premium'>('standard');

  // Add-ons
  const [addOns, setAddOns] = useState({
    childSeat: false,
    additionalDriver: true,
    gpsNavigation: false,
    roadsidePlus: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Synchronize driver fields when user logs in
  useEffect(() => {
    if (user) {
      setDriverName(user.name || '');
      setDriverEmail(user.email || '');
      setDriverPhone(user.phone || '');
      setLicenseNumber(user.licenseNumber || '');
    }
  }, [user]);

  if (!car) return null;

  // Auto-correct dropoff date if pickup date exceeds it
  const handlePickupDateChange = (val: string) => {
    setPickupDate(val);
    if (new Date(val) >= new Date(dropoffDate)) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 2);
      setDropoffDate(nextDay.toISOString().split('T')[0]);
    }
  };

  // Calculate rental days
  const rentalDays = useMemo(() => {
    const start = new Date(pickupDate).getTime();
    const end = new Date(dropoffDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [pickupDate, dropoffDate]);

  // Check for date overlap conflict with existing bookings for this vehicle
  const conflictingBooking = useMemo(() => {
    if (!car || !existingBookings) return null;
    return existingBookings.find(b => {
      if (b.carId !== car.id || b.status === 'Cancelled') return false;
      // Overlap: startA <= endB && endA >= startB
      return pickupDate <= b.dropoffDate && dropoffDate >= b.pickupDate;
    });
  }, [car, existingBookings, pickupDate, dropoffDate]);

  // Protection cost per day
  const protectionDailyRate = protectionPlan === 'premium' ? 30 : protectionPlan === 'standard' ? 20 : 0;
  const totalProtectionCost = protectionDailyRate * rentalDays;

  // Add-ons total
  const addOnsTotal = useMemo(() => {
    let sum = 0;
    if (addOns.childSeat) sum += 10 * rentalDays;
    if (addOns.additionalDriver) sum += 15 * rentalDays;
    if (addOns.gpsNavigation) sum += 10 * rentalDays;
    if (addOns.roadsidePlus) sum += 8 * rentalDays;
    return sum;
  }, [addOns, rentalDays]);

  // Pricing calculations
  const subtotal = (car.pricePerDay * rentalDays) + totalProtectionCost + addOnsTotal;
  const tax = Math.round(subtotal * 0.10);
  const totalAmount = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      setErrorMessage('You must be logged in to reserve a vehicle. Please sign in or register.');
      return;
    }

    if (conflictingBooking) {
      setErrorMessage(
        `Date Conflict: This car is already reserved from ${conflictingBooking.pickupDate} to ${conflictingBooking.dropoffDate}. Please choose different dates.`
      );
      return;
    }

    if (!driverName || !driverEmail || !licenseNumber) {
      setErrorMessage('Please fill in driver name, email, and driver license number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await createBooking({
        carId: car.id,
        carName: car.name,
        carCategory: car.category,
        carImageUrl: car.imageUrl,
        userId: user.id,
        userName: driverName,
        userEmail: driverEmail,
        userPhone: driverPhone || user.phone || '',
        licenseNumber,
        pickupLocation,
        dropoffLocation,
        pickupDate,
        dropoffDate,
        rentalDays,
        dailyRate: car.pricePerDay,
        protectionPlan,
        protectionCost: totalProtectionCost,
        addOns,
        subtotal,
        tax,
        totalAmount,
        status: 'Confirmed',
        notes: specialNotes
      });

      onBookingSuccess(newBooking);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-blue-light)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CarIcon size={22} />
            </div>
            <div>
              <h2 className="modal-title">Book {car.name}</h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                ${car.pricePerDay}/day • {car.category} Class • Hub & Delivery
              </span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Guest Lockout: If user is not logged in */}
        {!user ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div 
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--accent-blue-light)', 
                color: 'var(--accent-blue)', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <LogIn size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-black)', marginBottom: '8px' }}>
              Sign In Required to Reserve
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 24px', lineHeight: '1.6' }}>
              To ensure safety and vehicle compliance, customers must have an active RentalWheels account with a verified driver license before booking.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-blue btn-lg" 
                onClick={() => {
                  onClose();
                  onOpenAuth('login');
                }}
              >
                <LogIn size={16} />
                <span>Sign In or Register</span>
              </button>
            </div>
          </div>
        ) : (
          /* Logged In Booking Form */
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              {errorMessage && (
                <div 
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#fef2f2',
                    color: '#991b1b',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Date Conflict Warning Banner */}
              {conflictingBooking && (
                <div 
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#fffbeb',
                    color: '#b45309',
                    border: '1px solid #fde68a',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>
                    This vehicle is already booked from {conflictingBooking.pickupDate} to {conflictingBooking.dropoffDate}. Please choose different dates.
                  </span>
                </div>
              )}

              {/* Vehicle Summary Bar */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '24px'
                }}
              >
                <img 
                  src={car.imageUrl} 
                  alt={car.name} 
                  style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-black)' }}>{car.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {car.specs.transmission} • {car.specs.seats} Seats • {car.specs.fuelType} • ${car.pricePerDay}/day
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success">Verified Available</span>
                </div>
              </div>

              {/* Section 1: Dates & Locations */}
              <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-black)', marginBottom: '14px' }}>
                1. Rental Dates & Stations
              </h4>
              
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Pick-up Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={pickupDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handlePickupDateChange(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Drop-off Date ({rentalDays} {rentalDays === 1 ? 'day' : 'days'})</label>
                  <input
                    type="date"
                    className="form-input"
                    value={dropoffDate}
                    min={pickupDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Pick-up Hub Location</label>
                  <select
                    className="form-select"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  >
                    {PICKUP_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Drop-off Hub Location</label>
                  <select
                    className="form-select"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                  >
                    {PICKUP_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section 2: Protection Package */}
              <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-black)', marginTop: '16px', marginBottom: '12px' }}>
                2. Protection Plan
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {/* Basic */}
                <div 
                  onClick={() => setProtectionPlan('basic')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: protectionPlan === 'basic' ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                    backgroundColor: protectionPlan === 'basic' ? 'var(--accent-blue-light)' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-black)' }}>Basic Cover</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0' }}>$1,500 Collision Deductible</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-blue)' }}>Free Included</div>
                </div>

                {/* Standard */}
                <div 
                  onClick={() => setProtectionPlan('standard')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: protectionPlan === 'standard' ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                    backgroundColor: protectionPlan === 'standard' ? 'var(--accent-blue-light)' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-black)' }}>Standard</div>
                    <span className="badge badge-blue" style={{ fontSize: '9px', padding: '1px 6px' }}>Popular</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0' }}>$500 Deductible + Glass & Tire</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-blue)' }}>+$20 / day</div>
                </div>

                {/* Premium */}
                <div 
                  onClick={() => setProtectionPlan('premium')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: protectionPlan === 'premium' ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                    backgroundColor: protectionPlan === 'premium' ? 'var(--accent-blue-light)' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-black)' }}>VIP Zero Excess</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0' }}>$0 Liability + Total Peace of Mind</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-blue)' }}>+$30 / day</div>
                </div>
              </div>

              {/* Section 3: Add-on Options */}
              <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-black)', marginBottom: '12px' }}>
                3. Optional Add-ons
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <label 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '10px 14px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-subtle)', 
                    cursor: 'pointer',
                    backgroundColor: addOns.additionalDriver ? 'var(--accent-blue-light)' : '#ffffff'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={addOns.additionalDriver}
                    onChange={(e) => setAddOns({ ...addOns, additionalDriver: e.target.checked })}
                  />
                  <div style={{ fontSize: '13px' }}>
                    <div style={{ fontWeight: 600 }}>Additional Driver</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+$15/day</div>
                  </div>
                </label>

                <label 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '10px 14px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-subtle)', 
                    cursor: 'pointer',
                    backgroundColor: addOns.gpsNavigation ? 'var(--accent-blue-light)' : '#ffffff'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={addOns.gpsNavigation}
                    onChange={(e) => setAddOns({ ...addOns, gpsNavigation: e.target.checked })}
                  />
                  <div style={{ fontSize: '13px' }}>
                    <div style={{ fontWeight: 600 }}>High-Precision GPS</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+$10/day</div>
                  </div>
                </label>

                <label 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '10px 14px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-subtle)', 
                    cursor: 'pointer',
                    backgroundColor: addOns.childSeat ? 'var(--accent-blue-light)' : '#ffffff'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={addOns.childSeat}
                    onChange={(e) => setAddOns({ ...addOns, childSeat: e.target.checked })}
                  />
                  <div style={{ fontSize: '13px' }}>
                    <div style={{ fontWeight: 600 }}>Child Safety Booster Seat</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+$10/day</div>
                  </div>
                </label>

                <label 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '10px 14px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-subtle)', 
                    cursor: 'pointer',
                    backgroundColor: addOns.roadsidePlus ? 'var(--accent-blue-light)' : '#ffffff'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={addOns.roadsidePlus}
                    onChange={(e) => setAddOns({ ...addOns, roadsidePlus: e.target.checked })}
                  />
                  <div style={{ fontSize: '13px' }}>
                    <div style={{ fontWeight: 600 }}>Roadside Plus Assistance</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+$8/day</div>
                  </div>
                </label>
              </div>

              {/* Section 4: Driver Credentials */}
              <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-black)', marginBottom: '14px' }}>
                4. Primary Driver Information
              </h4>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={driverEmail}
                    onChange={(e) => setDriverEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Driver's License Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="DL-XXXX-XX"
                    required
                  />
                </div>
              </div>

              {/* Price Breakdown Calculation */}
              <div 
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 20px',
                  border: '1px solid var(--border-subtle)',
                  marginTop: '16px'
                }}
              >
                <h5 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Live Price Summary Breakdown
                </h5>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span>Vehicle Rental ({rentalDays} days × ${car.pricePerDay})</span>
                  <span style={{ fontWeight: 600 }}>${car.pricePerDay * rentalDays}</span>
                </div>

                {totalProtectionCost > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                    <span>{protectionPlan === 'premium' ? 'VIP Zero Excess' : 'Standard'} Protection</span>
                    <span style={{ fontWeight: 600 }}>+${totalProtectionCost}</span>
                  </div>
                )}

                {addOnsTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                    <span>Selected Add-ons</span>
                    <span style={{ fontWeight: 600 }}>+${addOnsTotal}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span>Taxes & Concession Fees (10%)</span>
                  <span style={{ fontWeight: 600 }}>+${tax}</span>
                </div>

                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    paddingTop: '12px',
                    marginTop: '8px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-black)' }}>Total Amount Due</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-blue)' }}>${totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Footer Submit */}
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-blue btn-lg" 
                disabled={isSubmitting || !!conflictingBooking}
                style={{ minWidth: '200px' }}
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : conflictingBooking ? (
                  <span>Dates Unavailable</span>
                ) : (
                  <>
                    <CheckCircle size={17} />
                    <span>Confirm Reservation (${totalAmount})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
