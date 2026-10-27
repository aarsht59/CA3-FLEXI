import React, { useState } from 'react';
import { Booking } from '../types.ts';
import { useAuth } from '../AuthContext.tsx';
import { updateBookingStatus } from '../api.ts';
import { 
  Calendar, 
  MapPin, 
  Receipt, 
  XCircle, 
  Car, 
  LogIn
} from 'lucide-react';

interface UserDashboardPageProps {
  bookings: Booking[];
  onRefreshBookings: () => void;
  onViewReceipt: (booking: Booking) => void;
  onExploreFleet: () => void;
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onNotify: (msg: string) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  bookings,
  onRefreshBookings,
  onViewReceipt,
  onExploreFleet,
  onOpenAuth,
  onNotify
}) => {
  const { user } = useAuth();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Protected: If user is not logged in
  if (!user) {
    return (
      <div className="section" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '520px' }}>
          <div 
            style={{
              width: '64px',
              height: '64px',
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
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-black)', marginBottom: '8px' }}>
            Customer Sign In Required
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
            Please sign in to your RentalWheels account to view active reservations, rental agreements, and past booking history.
          </p>
          <button 
            type="button" 
            className="btn btn-blue btn-lg"
            onClick={() => onOpenAuth('login')}
          >
            <LogIn size={16} />
            <span>Sign In to Account</span>
          </button>
        </div>
      </div>
    );
  }

  // Filter bookings strictly for this authenticated user
  const userBookings = bookings.filter(
    b => b.userId === user.id || (user.email && b.userEmail.toLowerCase() === user.email.toLowerCase())
  );

  const activeBookings = userBookings.filter(b => b.status === 'Confirmed' || b.status === 'Active');
  const pastBookings = userBookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  const totalSpent = userBookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleCancelBooking = async (booking: Booking) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${booking.bookingRef} for ${booking.carName}?`)) {
      return;
    }
    setCancellingId(booking.id);
    try {
      await updateBookingStatus(booking.id, 'Cancelled');
      onRefreshBookings();
      onNotify(`Reservation ${booking.bookingRef} has been cancelled.`);
    } catch (err: any) {
      onNotify(err.message || 'Failed to cancel reservation.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge badge-blue">Confirmed</span>;
      case 'Active':
        return <span className="badge badge-success">In Progress</span>;
      case 'Completed':
        return <span className="badge badge-neutral">Completed</span>;
      case 'Cancelled':
        return <span className="badge badge-warning" style={{ color: '#b91c1c' }}>Cancelled</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="section" style={{ paddingTop: '36px' }}>
      <div className="container">
        {/* User Greeting Banner */}
        <div 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 28px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-black)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 800,
                border: '2px solid var(--accent-blue)'
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-black)' }}>
                  {user.name}
                </h1>
                <span className="badge badge-blue" style={{ fontSize: '10px' }}>Verified Member</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {user.email} {user.licenseNumber ? `• License: ${user.licenseNumber}` : ''}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Active Trips
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-blue)' }}>
                {activeBookings.length}
              </div>
            </div>

            <div style={{ textAlign: 'right', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Bookings
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-black)' }}>
                {userBookings.length}
              </div>
            </div>

            <div style={{ textAlign: 'right', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Spent
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-black)' }}>
                ${totalSpent}
              </div>
            </div>
          </div>
        </div>

        {/* Active Reservations Section */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--accent-black)' }}>
                Active & Upcoming Reservations ({activeBookings.length})
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Manage scheduled vehicle pickups, agreements, and itinerary details.
              </p>
            </div>
            <button type="button" className="btn btn-blue btn-sm" onClick={onExploreFleet}>
              + Reserve Another Vehicle
            </button>
          </div>

          {activeBookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px 24px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <img
                      src={booking.carImageUrl}
                      alt={booking.carName}
                      style={{
                        width: '110px',
                        height: '75px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--accent-black)' }}>
                          {booking.carName}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span>Ref: <strong style={{ color: 'var(--accent-black)' }}>{booking.bookingRef}</strong></span>
                        <span>•</span>
                        <span>{booking.carCategory} Class</span>
                        <span>•</span>
                        <span>{booking.rentalDays} Days Rental</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: 600, marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={13} /> {booking.pickupLocation} ({booking.pickupDate} → {booking.dropoffDate})
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Amount</div>
                      <div style={{ fontSize: '19px', fontWeight: 800, color: 'var(--accent-blue)' }}>
                        ${booking.totalAmount}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => onViewReceipt(booking)}
                        title="View digital rental agreement receipt"
                      >
                        <Receipt size={14} />
                        <span>Receipt</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelBooking(booking)}
                        disabled={cancellingId === booking.id}
                        title="Cancel this reservation"
                      >
                        <XCircle size={14} />
                        <span>{cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              style={{
                padding: '40px 24px',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-subtle)'
              }}
            >
              <Car size={32} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-black)', marginBottom: '4px' }}>
                No active rentals at the moment
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Explore our fleet to reserve your next luxury or performance vehicle.
              </p>
              <button type="button" className="btn btn-blue btn-sm" onClick={onExploreFleet}>
                Browse Fleet Now
              </button>
            </div>
          )}
        </div>

        {/* Past Rental History */}
        <div>
          <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--accent-black)', marginBottom: '14px' }}>
            Past Rental History ({pastBookings.length})
          </h2>

          {pastBookings.length > 0 ? (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Vehicle</th>
                    <th>Dates</th>
                    <th>Station</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pastBookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{b.bookingRef}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{b.carName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.carCategory}</div>
                      </td>
                      <td>{b.pickupDate} → {b.dropoffDate}</td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.pickupLocation}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>${b.totalAmount}</td>
                      <td>{getStatusBadge(b.status)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => onViewReceipt(b)}
                        >
                          <Receipt size={13} />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px 0' }}>
              No completed or past rentals recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
