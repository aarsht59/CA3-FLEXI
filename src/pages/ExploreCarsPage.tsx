import React, { useState, useMemo, useEffect } from 'react';
import { Car } from '../types.ts';
import { CarCard } from '../components/CarCard.tsx';
import { Search, RotateCcw, Car as CarIcon, MapPin } from 'lucide-react';

interface ExploreCarsPageProps {
  cars: Car[];
  initialCategory?: string;
  initialLocation?: string;
  onViewDetails: (car: Car) => void;
  onBookNow: (car: Car) => void;
}

const CATEGORIES = ['All', 'Sports', 'Electric', 'Luxury', 'SUV', 'Convertible'];

export const ExploreCarsPage: React.FC<ExploreCarsPageProps> = ({
  cars,
  initialCategory,
  initialLocation,
  onViewDetails,
  onBookNow
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMax, setPriceMax] = useState<number>(600);
  const [transmissionFilter, setTransmissionFilter] = useState<'All' | 'Automatic' | 'Manual'>('All');
  const [seatsFilter, setSeatsFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name'>('featured');

  // Sync state if initial props change
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  // Filtered and sorted cars
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        // Category filter
        if (selectedCategory !== 'All' && car.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // Location filter
        if (selectedLocation !== 'All' && car.location && !car.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }

        // Search query filter (name, brand, model, features)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match = 
            car.name.toLowerCase().includes(q) ||
            car.brand.toLowerCase().includes(q) ||
            car.model.toLowerCase().includes(q) ||
            car.category.toLowerCase().includes(q) ||
            (car.features && car.features.some(f => f.toLowerCase().includes(q)));
          if (!match) return false;
        }

        // Price filter
        if (car.pricePerDay > priceMax) {
          return false;
        }

        // Transmission filter
        if (transmissionFilter !== 'All' && car.specs.transmission !== transmissionFilter) {
          return false;
        }

        // Seats filter
        if (seatsFilter !== 'All') {
          const num = parseInt(seatsFilter, 10);
          if (seatsFilter === '5+' ? car.specs.seats < 5 : car.specs.seats !== num) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
        if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [cars, selectedCategory, selectedLocation, searchQuery, priceMax, transmissionFilter, seatsFilter, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSearchQuery('');
    setPriceMax(600);
    setTransmissionFilter('All');
    setSeatsFilter('All');
    setSortBy('featured');
  };

  return (
    <div className="section" style={{ paddingTop: '36px' }}>
      <div className="container">
        {/* Title Row */}
        <div style={{ marginBottom: '24px' }}>
          <div className="section-subtitle">RentalWheels Fleet</div>
          <h1 className="section-title">Explore Our Vehicles</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Choose from high-performance supercars, quiet luxury sedans, and versatile all-terrain SUVs.
          </p>
        </div>

        {/* Filter Bar Box */}
        <div className="filters-container">
          {/* Category Pills */}
          <div className="filter-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`cat-pill ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Controls Row */}
          <div className="filters-controls-row">
            {/* Search Input */}
            <div className="search-box-pill">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by make, model, or specs (Porsche, Tesla, AMG)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Hub Location filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Hub:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '7px 12px', fontSize: '13px' }}
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="All">All Locations</option>
                <option value="Downtown">Downtown Hub</option>
                <option value="Airport">Airport Valet</option>
                <option value="Beverly">Beverly Hills</option>
                <option value="Financial">Financial District</option>
              </select>
            </div>

            {/* Price Max Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Max:
              </span>
              <input
                type="range"
                min={150}
                max={600}
                step={25}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                style={{ width: '90px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-blue)', minWidth: '50px' }}>
                ${priceMax}/d
              </span>
            </div>

            {/* Transmission */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Gearbox:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '7px 10px', fontSize: '13px' }}
                value={transmissionFilter}
                onChange={(e) => setTransmissionFilter(e.target.value as any)}
              >
                <option value="All">All</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Seats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Seats:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '7px 10px', fontSize: '13px' }}
                value={seatsFilter}
                onChange={(e) => setSeatsFilter(e.target.value)}
              >
                <option value="All">Any</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="5+">5+</option>
              </select>
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Sort:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '7px 12px', fontSize: '13px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleResetFilters}
              title="Reset all search criteria"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Results Count Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--accent-black)' }}>{filteredCars.length}</strong> vehicles matching criteria
          </div>
        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className="cars-grid">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onViewDetails={onViewDetails}
                onBookNow={onBookNow}
              />
            ))}
          </div>
        ) : (
          <div 
            style={{
              padding: '64px 24px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-subtle)',
              marginTop: '16px'
            }}
          >
            <div 
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                marginBottom: '16px'
              }}
            >
              <CarIcon size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-black)', marginBottom: '8px' }}>
              No vehicles match your selected filters
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px' }}>
              Try adjusting your max price slider, clearing your search query, or choosing another category.
            </p>
            <button type="button" className="btn btn-blue" onClick={handleResetFilters}>
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
