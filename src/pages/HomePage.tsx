import React, { useState } from 'react';
import { Car } from '../types.ts';
import { CarCard } from '../components/CarCard.tsx';
import { 
  ArrowRight, 
  Search, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  Award, 
  Clock, 
  Star,
  ChevronRight,
  Sparkles,
  Key
} from 'lucide-react';

interface HomePageProps {
  cars: Car[];
  onViewDetails: (car: Car) => void;
  onBookNow: (car: Car) => void;
  onExploreFleet: (filters?: { category?: string; location?: string; search?: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  cars,
  onViewDetails,
  onBookNow,
  onExploreFleet
}) => {
  const [quickLocation, setQuickLocation] = useState('All');
  const [quickCategory, setQuickCategory] = useState('All');
  const [quickService, setQuickService] = useState('Hub Pickup');

  // Featured fleet selection
  const featuredCars = cars.filter(c => c.featured).slice(0, 4);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onExploreFleet({
      category: quickCategory === 'All' ? undefined : quickCategory,
      location: quickLocation === 'All' ? undefined : quickLocation
    });
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg-accent" />
        <div className="container">
          <div className="hero-grid">
            {/* Left Column: Headline and Call-to-actions */}
            <div>
              <div className="hero-tag">
                <Sparkles size={14} />
                <span>Next-Gen Premium Fleet Rental</span>
              </div>
              <h1 className="hero-headline">
                Drive The <span className="highlight">Extraordinary</span> Every Mile.
              </h1>
              <p className="hero-description">
                Experience the world's most coveted luxury sedans, supercars, executive SUVs, and high-performance electric vehicles with transparent pricing and keyless delivery.
              </p>

              <div className="hero-cta-group">
                <button 
                  type="button" 
                  className="btn btn-blue btn-lg"
                  onClick={() => onExploreFleet()}
                >
                  <span>Explore Full Fleet ({cars.length})</span>
                  <ArrowRight size={18} />
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline btn-lg"
                  onClick={() => onExploreFleet({ category: 'Electric' })}
                >
                  <Zap size={18} color="var(--accent-blue)" />
                  <span>Electric / EV Fleet</span>
                </button>
              </div>

              {/* Stats Row */}
              <div className="hero-stats-row">
                <div className="hero-stat-item">
                  <div className="stat-value">{cars.length}<span>+</span></div>
                  <div className="stat-label">Luxury Vehicles</div>
                </div>
                <div className="hero-stat-item">
                  <div className="stat-value">4.9<span>★</span></div>
                  <div className="stat-label">Customer Rating</div>
                </div>
                <div className="hero-stat-item">
                  <div className="stat-value">100<span>%</span></div>
                  <div className="stat-label">Guaranteed Models</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card (Text cleanly docked beneath image) */}
            <div className="hero-visual">
              <div className="hero-card-display">
                <div className="hero-img-box">
                  <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                    alt="Porsche 911 Carrera S"
                    className="hero-car-img"
                  />
                </div>
                <div className="hero-card-docked">
                  <div className="badge-car-info">
                    <h4>Porsche 911 Carrera S</h4>
                    <p>3.0L Twin-Turbo Boxer • 443 HP • 0-60 in 3.3s</p>
                  </div>
                  <div className="badge-price">
                    <div className="amount">$320</div>
                    <div className="period">per day</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK SEARCH WIDGET (Clean spacing, zero overlap) */}
          <div className="quick-search-box">
            <form onSubmit={handleQuickSearch} className="quick-search-grid">
              <div className="search-field">
                <label><MapPin size={14} /> Pick-up Location</label>
                <div className="search-input-wrap">
                  <MapPin size={18} />
                  <select 
                    className="search-select"
                    value={quickLocation}
                    onChange={(e) => setQuickLocation(e.target.value)}
                  >
                    <option value="All">All Pickup Locations</option>
                    <option value="Downtown Executive Hub">Downtown Executive Hub (Main)</option>
                    <option value="Airport Terminal 2 Valet">Airport Terminal 2 Valet</option>
                    <option value="Beverly Hills Luxury Plaza">Beverly Hills Luxury Plaza</option>
                    <option value="Financial District Station">Financial District Station</option>
                  </select>
                </div>
              </div>

              <div className="search-field">
                <label><Calendar size={14} /> Vehicle Class</label>
                <div className="search-input-wrap">
                  <Search size={18} />
                  <select 
                    className="search-select"
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                  >
                    <option value="All">All Vehicle Classes</option>
                    <option value="Sports">Sports & Performance</option>
                    <option value="Electric">Electric / EV</option>
                    <option value="SUV">Executive SUVs</option>
                    <option value="Luxury">Luxury Sedans</option>
                    <option value="Convertible">Convertibles</option>
                  </select>
                </div>
              </div>

              <div className="search-field">
                <label><Key size={14} /> Service Delivery</label>
                <div className="search-input-wrap">
                  <Clock size={18} />
                  <select 
                    className="search-select"
                    value={quickService}
                    onChange={(e) => setQuickService(e.target.value)}
                  >
                    <option value="Hub Pickup">Instant Keyless Hub Pickup</option>
                    <option value="Valet Delivery">Doorstep Valet Delivery</option>
                    <option value="Airport Meet">VIP Airport Meet & Greet</option>
                  </select>
                </div>
              </div>

              <div>
                <button type="submit" className="btn btn-blue btn-lg" style={{ width: '100%' }}>
                  <Search size={18} />
                  <span>Find Available Cars</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION SECTION */}
      <section className="section" style={{ paddingBottom: '32px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-black)' }}>Transparent Pricing</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                No surprise airport fees, hidden mileage charges, or undisclosed taxes. Clear daily breakdowns with guaranteed rates.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-black)' }}>Instant Digital Pickup</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Bypass counter lines entirely. Receive your digital confirmation and access your vehicle seamlessly at our hubs.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Award size={22} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-black)' }}>Guaranteed Make & Model</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Never get downgraded to "or similar." You drive the exact Porsche, Tesla, or Mercedes you reserved.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Clock size={22} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-black)' }}>24/7 VIP Concierge</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Direct access to dedicated fleet managers for itinerary changes, roadside assistance, or extensions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED FLEET SECTION */}
      <section className="section section-secondary">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-subtitle">Exclusive Selection</div>
              <h2 className="section-title">Featured Fleet Vehicles</h2>
            </div>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => onExploreFleet()}
            >
              <span>View Full Fleet ({cars.length})</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="cars-grid">
            {featuredCars.map(car => (
              <CarCard
                key={car.id}
                car={car}
                onViewDetails={onViewDetails}
                onBookNow={onBookNow}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <div className="section-subtitle">Effortless Journey</div>
            <h2 className="section-title">How RentalWheels Works</h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '8px' }}>
              From reservation to the open highway in three frictionless steps.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-title">Select Your Dream Machine</h3>
              <p className="step-desc">
                Filter by performance class, engine specs, transmission, or fuel type to pick the exact car tailored to your journey.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-title">Customize Protection & Extras</h3>
              <p className="step-desc">
                Choose transparent zero-deductible insurance coverage, add child seats, GPS navigation, or secondary drivers with instant quote calculation.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-title">Unlock & Drive</h3>
              <p className="step-desc">
                Pick up keys at our airport or downtown hub, or have the car delivered to your doorstep. Hit the ignition and enjoy pure performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / BANNER */}
      <section className="section" style={{ backgroundColor: 'var(--accent-black)', color: '#ffffff', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#60a5fa', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Customer Satisfaction
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px' }}>
                "The cleanest booking flow and most pristine vehicles in the industry."
              </h2>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#eab308" color="#eab308" />
                ))}
              </div>
              <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6' }}>
                "Reserved the Porsche 911 for a weekend trip through the coast. The booking was instantaneous, the car was waiting spotless with full fuel, and returning took less than two minutes. RentalWheels sets the gold standard."
              </p>
              <div style={{ marginTop: '20px', fontWeight: 700, fontSize: '15px' }}>
                Marcus Vance — <span style={{ color: '#60a5fa', fontWeight: 500 }}>Verified Customer</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
                Ready to Experience RentalWheels?
              </h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6' }}>
                Browse our full fleet of sports cars, luxury sedans, electric vehicles, and executive SUVs today.
              </p>
              <button 
                type="button" 
                className="btn btn-blue btn-lg" 
                style={{ width: '100%' }}
                onClick={() => onExploreFleet()}
              >
                <span>Browse All Cars</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
