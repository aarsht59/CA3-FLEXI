import React, { useState } from 'react';
import { Car } from '../types.ts';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Gauge, 
  Fuel, 
  Zap, 
  Briefcase, 
  ShieldCheck, 
  CalendarCheck,
  Award,
  Sparkles
} from 'lucide-react';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
  onBookNow: (car: Car) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({ car, onClose, onBookNow }) => {
  if (!car) return null;

  const [activeImage, setActiveImage] = useState(car.imageUrl);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-dark">{car.category}</span>
              <span className="badge badge-blue">{car.year} Model</span>
              <span className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> {car.location}
              </span>
            </div>
            <h2 className="modal-title" style={{ fontSize: '24px' }}>{car.name}</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '24px 28px' }}>
          {/* Main Visual & Gallery */}
          <div style={{ marginBottom: '24px' }}>
            <div 
              style={{ 
                height: '340px', 
                borderRadius: 'var(--radius-lg)', 
                overflow: 'hidden', 
                backgroundColor: '#0a0f1d',
                marginBottom: '12px'
              }}
            >
              <img 
                src={activeImage} 
                alt={car.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            {car.galleryImages && car.galleryImages.length > 1 && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {car.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '76px',
                      height: '52px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: activeImage === img ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Performance Metric Grid */}
          <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Engine & Performance Specs
          </h4>
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '12px',
              marginBottom: '24px'
            }}
          >
            <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Powertrain / Output</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-black)', marginTop: '2px' }}>{car.specs.engineOrRange}</div>
            </div>

            <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Acceleration</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '2px' }}>{car.specs.acceleration}</div>
            </div>

            <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Top Track Speed</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-black)', marginTop: '2px' }}>{car.specs.topSpeed}</div>
            </div>

            <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Transmission</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-black)', marginTop: '2px' }}>{car.specs.transmission}</div>
            </div>

            <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Seating & Doors</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-black)', marginTop: '2px' }}>{car.specs.seats} Passengers / {car.specs.doors} Doors</div>
            </div>

            <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Efficiency / Range</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-black)', marginTop: '2px' }}>{car.specs.mpgOrEfficiency}</div>
            </div>
          </div>

          {/* Premium Features List */}
          <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Vehicle Highlights & Equipment
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '24px' }}>
            {car.features.map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} color="#2563eb" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Included Perks banner */}
          <div 
            style={{ 
              backgroundColor: 'var(--accent-blue-light)', 
              border: '1px solid var(--accent-blue-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={24} color="#2563eb" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-black)' }}>RentalWheels Concierge Guarantee</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Includes 200 free miles/day, 24/7 roadside assistance, sanitized delivery.</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-blue)', lineHeight: 1 }}>
                ${car.pricePerDay}<span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Back to Catalog
          </button>
          <button 
            type="button" 
            className="btn btn-blue btn-lg" 
            onClick={() => {
              onClose();
              onBookNow(car);
            }}
            disabled={!car.isAvailable}
          >
            <CalendarCheck size={18} />
            <span>{car.isAvailable ? `Reserve for $${car.pricePerDay}/day` : 'Currently Reserved'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
