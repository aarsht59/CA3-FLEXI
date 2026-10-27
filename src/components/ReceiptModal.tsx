import React from 'react';
import { Booking } from '../types.ts';
import { X, Printer, CheckCircle, Calendar } from 'lucide-react';

interface ReceiptModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-success" style={{ padding: '4px 10px' }}>
              <CheckCircle size={14} /> {booking.status}
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>
              Ref: {booking.bookingRef}
            </span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '20px', borderBottom: '2px solid var(--accent-black)', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-black)' }}>
                Rental<span style={{ color: 'var(--accent-blue)' }}>Wheels</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Digital Rental Agreement & Payment Receipt
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Issue Date</div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>
                {new Date(booking.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <h5 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                Rented Vehicle
              </h5>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-black)' }}>
                {booking.carName}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--accent-blue)', fontWeight: 600 }}>
                {booking.carCategory} Class
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Daily Rate: ${booking.dailyRate} / day
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                Primary Driver
              </h5>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-black)' }}>
                {booking.userName}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Email: {booking.userEmail}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                License: {booking.licenseNumber}
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  <Calendar size={13} color="var(--accent-blue)" /> Pick-up Date & Station
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{booking.pickupDate}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{booking.pickupLocation}</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  <Calendar size={13} color="var(--accent-blue)" /> Drop-off Date ({booking.rentalDays} Days)
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{booking.dropoffDate}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{booking.dropoffLocation}</div>
              </div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '24px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px 0' }}>Item Description</th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 0' }}>Vehicle Base Rental ({booking.rentalDays} days @ ${booking.dailyRate}/day)</td>
                <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600 }}>${booking.dailyRate * booking.rentalDays}</td>
              </tr>
              {booking.protectionCost > 0 && (
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 0' }}>{booking.protectionPlan.toUpperCase()} Protection Package</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600 }}>+${booking.protectionCost}</td>
                </tr>
              )}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 0' }}>State & Municipal Taxes (10%)</td>
                <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600 }}>+${booking.tax}</td>
              </tr>
              <tr>
                <td style={{ padding: '14px 0', fontSize: '15px', fontWeight: 800 }}>Total Paid / Guaranteed</td>
                <td style={{ padding: '14px 0', textAlign: 'right', fontSize: '20px', fontWeight: 800, color: 'var(--accent-blue)' }}>
                  ${booking.totalAmount}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ padding: '12px 16px', background: 'var(--accent-blue-light)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--text-main)' }}>
            <strong>Keyless Pickup Instructions:</strong> Please present your driver license {booking.licenseNumber} at the {booking.pickupLocation} valet desk, or scan booking ref <strong>{booking.bookingRef}</strong> at the kiosk.
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>Close</button>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
