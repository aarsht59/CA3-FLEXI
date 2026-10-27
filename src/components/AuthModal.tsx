import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.tsx';
import { X, Lock, Mail, User, Phone, FileText, AlertCircle, Info } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onSuccessNotice?: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  initialTab = 'login',
  onClose, 
  onSuccessNotice 
}) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTab(initialTab);
    setError(null);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please provide an email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(cleanEmail, password);
      onClose();
      onSuccessNotice?.(`Welcome back, ${cleanEmail}!`);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanLicense = licenseNumber.trim();

    if (!cleanName) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!cleanPhone) {
      setError('Please provide a contact phone number.');
      return;
    }
    if (!cleanLicense) {
      setError("Please provide your driver's license number.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await register({
        name: cleanName,
        email: cleanEmail,
        password,
        phone: cleanPhone,
        licenseNumber: cleanLicense
      });
      onClose();
      onSuccessNotice?.(`Account registered successfully as customer!`);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {tab === 'login' ? 'Sign In to RentalWheels' : 'Create New Customer Account'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {tab === 'login' ? 'Access your vehicle reservations and agreements' : 'Register to reserve luxury and performance fleet vehicles'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Tab Switcher */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); }}
              style={{
                flex: 1,
                padding: '10px',
                background: 'none',
                border: 'none',
                borderBottom: tab === 'login' ? '2px solid var(--accent-blue)' : '2px solid transparent',
                fontWeight: 700,
                fontSize: '14px',
                color: tab === 'login' ? 'var(--accent-black)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(null); }}
              style={{
                flex: 1,
                padding: '10px',
                background: 'none',
                border: 'none',
                borderBottom: tab === 'register' ? '2px solid var(--accent-blue)' : '2px solid transparent',
                fontWeight: 700,
                fontSize: '14px',
                color: tab === 'register' ? 'var(--accent-black)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Meaningful Error Banner */}
          {error && (
            <div 
              style={{ 
                padding: '12px 14px', 
                backgroundColor: '#fef2f2', 
                color: '#b91c1c', 
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)', 
                fontSize: '13px', 
                fontWeight: 600,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Helpful Demo Credentials Tip */}
              <div 
                style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  marginBottom: '16px',
                  display: 'flex',
                  gap: '8px',
                  lineHeight: '1.4'
                }}
              >
                <Info size={16} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Default Evaluation Credentials:</strong><br />
                  Customer: <code>customer@rentalwheels.com</code> / <code>CustomerPass123!</code><br />
                  Fleet Admin: <code>admin@rentalwheels.com</code> / <code>AdminPass123!</code>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-blue"
                style={{ width: '100%', marginTop: '4px' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. marcus@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password (Min. 6 characters)</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  minLength={6}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Driver License Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="DL-84920-CA"
                    required
                  />
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Note: Standard registration creates a verified customer account for rental bookings.
              </div>

              <button
                type="submit"
                className="btn btn-blue"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
