import React from 'react';
import { Car, ShieldCheck, Clock, MapPin, Database, Award, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'explore' | 'user-dashboard' | 'admin-dashboard') => void;
  openCompassModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openCompassModal }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#ffffff',
                  color: '#0a0f1d',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Car size={20} strokeWidth={2.4} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                Rental<span style={{ color: '#60a5fa' }}>Wheels</span>
              </span>
            </div>
            <p className="footer-desc">
              Next-generation luxury and performance car rentals. Engineered with native Node.js backend architecture and MongoDB database persistence.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                onClick={openCompassModal}
                className="btn btn-sm" 
                style={{ backgroundColor: '#1e293b', color: '#60a5fa', borderColor: '#334155' }}
              >
                <Database size={14} />
                <span>MongoDB Compass Guide</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>
                  Home Showcase
                </a>
              </li>
              <li>
                <a href="#explore" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }}>
                  Explore Fleet
                </a>
              </li>
              <li>
                <a href="#dashboard" onClick={(e) => { e.preventDefault(); setActiveTab('user-dashboard'); }}>
                  Customer Dashboard
                </a>
              </li>
              <li>
                <a href="#admin" onClick={(e) => { e.preventDefault(); setActiveTab('admin-dashboard'); }}>
                  Admin Fleet Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Fleet Categories */}
          <div>
            <h4 className="footer-title">Fleet Classes</h4>
            <ul className="footer-links">
              <li><a href="#explore" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }}>Luxury Sedans</a></li>
              <li><a href="#explore" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }}>Sports & Supercars</a></li>
              <li><a href="#explore" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }}>Premium Electric & EVs</a></li>
              <li><a href="#explore" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }}>Executive SUVs</a></li>
              <li><a href="#explore" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }}>Open-Top Convertibles</a></li>
            </ul>
          </div>

          {/* Guarantees */}
          <div>
            <h4 className="footer-title">The RentalWheels Standard</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <ShieldCheck size={18} color="#60a5fa" />
                <span>Comprehensive Insurance Included</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Clock size={18} color="#60a5fa" />
                <span>24/7 VIP Concierge & Roadside Support</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <MapPin size={18} color="#60a5fa" />
                <span>Doorstep Valet Delivery Available</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Award size={18} color="#60a5fa" />
                <span>100% Guaranteed Vehicle Model</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} RentalWheels Inc. Built with React.js & Native Node.js HTTP Backend.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Rental</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
