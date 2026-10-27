import React from 'react';
import { Car } from '../types.ts';
import { Star, Users, Gauge, Fuel, Zap, Eye, CalendarCheck } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onViewDetails: (car: Car) => void;
  onBookNow: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onViewDetails, onBookNow }) => {
  return (
    <div className="car-card">
      <div className="card-image-box">
        <img 
          src={car.imageUrl} 
          alt={car.name} 
          className="card-img" 
          loading="lazy" 
          onError={(e) => {
            // High-reliability automotive placeholder fallback
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="card-top-badges">
          <span className="badge badge-dark" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>
            {car.category}
          </span>
          <span 
            className={car.isAvailable ? 'badge badge-success' : 'badge badge-warning'}
            style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}
          >
            {car.isAvailable ? 'Available' : 'Reserved'}
          </span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <div>
            <div className="card-car-brand">{car.brand} • {car.year}</div>
            <h3 className="card-car-title">{car.name}</h3>
          </div>
          <div className="card-rating" title={`${car.reviewCount || 0} customer reviews`}>
            <Star size={14} fill="#eab308" />
            <span>{car.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Specs Row: cleanly proportioned with no text collisions */}
        <div className="card-specs-row">
          <div className="spec-item" title={`${car.specs.seats} Passenger Seating`}>
            <Users size={15} />
            <span className="spec-value">{car.specs.seats} Seats</span>
            <span className="spec-label">Capacity</span>
          </div>
          <div className="spec-item" title={`${car.specs.transmission} Transmission`}>
            <Gauge size={15} />
            <span className="spec-value">{car.specs.transmission === 'Automatic' ? 'Auto' : 'Manual'}</span>
            <span className="spec-label">Gearbox</span>
          </div>
          <div className="spec-item" title={`${car.specs.fuelType} Powertrain`}>
            {car.specs.fuelType === 'Electric' ? <Zap size={15} /> : <Fuel size={15} />}
            <span className="spec-value">{car.specs.fuelType}</span>
            <span className="spec-label">Power</span>
          </div>
          <div className="spec-item" title={`0 to 60 mph in ${car.specs.acceleration}`}>
            <Gauge size={15} />
            <span className="spec-value">{car.specs.acceleration.split(' ')[0]}</span>
            <span className="spec-label">0-60 mph</span>
          </div>
        </div>

        <div className="card-footer-row">
          <div className="card-price-box">
            <div className="card-price-daily">
              ${car.pricePerDay}<span>/day</span>
            </div>
            {car.originalPrice && car.originalPrice > car.pricePerDay && (
              <span className="card-price-original">${car.originalPrice}/day</span>
            )}
          </div>

          <div className="card-action-btns">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => onViewDetails(car)}
              title="Inspect specifications and gallery"
            >
              <Eye size={14} />
              <span>Details</span>
            </button>
            <button
              type="button"
              className="btn btn-blue btn-sm"
              onClick={() => onBookNow(car)}
              disabled={!car.isAvailable}
              style={{ opacity: car.isAvailable ? 1 : 0.6 }}
              title={car.isAvailable ? 'Book this car' : 'Vehicle currently on active reservation'}
            >
              <CalendarCheck size={14} />
              <span>{car.isAvailable ? 'Book' : 'Reserved'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
