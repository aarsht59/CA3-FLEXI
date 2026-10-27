import React from 'react';
import { useAuth } from '../AuthContext.tsx';
import { 
  Car as CarIcon, 
  User as UserIcon, 
  Database, 
  LogOut, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'explore' | 'user-dashboard' | 'admin-dashboard';
  setActiveTab: (tab: 'home' | 'explore' | 'user-dashboard' | 'admin-dashboard') => void;
  openAuthModal: (initialTab?: 'login' | 'register') => void;
  openCompassModal: () => void;
  isMongoOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  openCompassModal,
  isMongoOnline
}) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => setActiveTab('home')}>
            <div className="brand-icon">
              <CarIcon size={22} strokeWidth={2.4} />
            </div>
            <div className="brand-text">
              <span className="brand-title">Rental<span>Wheels</span></span>
              <span className="brand-tagline">Premium Mobility</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav>
            <ul className="nav-links">
              <li>
                <button
                  type="button"
                  className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => setActiveTab('home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`nav-link ${activeTab === 'explore' ? 'active' : ''}`}
                  onClick={() => setActiveTab('explore')}
                >
                  Explore Fleet
                </button>
              </li>
              {user && (
                <li>
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'user-dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('user-dashboard')}
                  >
                    My Bookings
                  </button>
                </li>
              )}
              {isAdmin && (
                <li>
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'admin-dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('admin-dashboard')}
                  >
                    Admin Portal
                  </button>
                </li>
              )}
            </ul>
          </nav>

          {/* Actions & User State */}
          <div className="nav-actions">
            {/* MongoDB Compass status badge */}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={openCompassModal}
              title="MongoDB Compass Database Configuration"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Database size={15} color={isMongoOnline ? '#16a34a' : '#dc2626'} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>
                {isMongoOnline ? 'MongoDB: Connected' : 'MongoDB: Offline'}
              </span>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isMongoOnline ? '#16a34a' : '#ef4444',
                  display: 'inline-block'
                }}
              />
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '5px 12px', 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: isAdmin ? 'var(--accent-black)' : 'var(--accent-blue)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-black)' }}>
                    {user.name}
                  </span>
                  <span 
                    className={isAdmin ? 'badge badge-dark' : 'badge badge-blue'} 
                    style={{ fontSize: '10px', padding: '2px 7px' }}
                  >
                    {isAdmin ? 'Admin' : 'Customer'}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    logout();
                    if (activeTab === 'user-dashboard' || activeTab === 'admin-dashboard') {
                      setActiveTab('home');
                    }
                  }}
                  title="Sign Out"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => openAuthModal('login')}
                >
                  <UserIcon size={15} />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openAuthModal('register')}
                >
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
