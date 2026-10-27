import React, { useState } from 'react';
import { DatabaseStatusInfo } from '../types.ts';
import { resetFleetData, fetchDbStatus } from '../api.ts';
import { X, Database, CheckCircle, RefreshCw, Copy, Check, Server, Layers, ShieldCheck } from 'lucide-react';

interface MongoCompassModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbInfo: DatabaseStatusInfo | null;
  onRefreshInfo: () => void;
  onNotify: (msg: string) => void;
}

export const MongoCompassModal: React.FC<MongoCompassModalProps> = ({
  isOpen,
  onClose,
  dbInfo,
  onRefreshInfo,
  onNotify
}) => {
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);

  if (!isOpen) return null;

  const compassUri = dbInfo?.compassConnectString || 'mongodb://127.0.0.1:27017/rentalwheels';

  const handleCopyUri = () => {
    navigator.clipboard.writeText(compassUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify('MongoDB URI copied to clipboard!');
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await resetFleetData();
      onRefreshInfo();
      onNotify('Sample fleet and bookings re-seeded successfully!');
    } catch {
      onNotify('Failed to reset database.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-blue-light)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Database size={20} />
            </div>
            <div>
              <h2 className="modal-title">MongoDB Compass Management</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Database Architecture & Connection Configuration
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Badge */}
          <div 
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: dbInfo?.isMongoConnected ? '#ecfdf5' : '#eff6ff',
              border: dbInfo?.isMongoConnected ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: dbInfo?.isMongoConnected ? '#065f46' : '#1e40af' }}>
                Backend Database Status
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-black)', marginTop: '2px' }}>
                {dbInfo?.mode || 'In-Memory Store (MongoDB Compass Ready)'}
              </div>
            </div>
            <span className={dbInfo?.isMongoConnected ? 'badge badge-success' : 'badge badge-blue'}>
              {dbInfo?.isMongoConnected ? 'Live MongoDB' : 'Compass Ready'}
            </span>
          </div>

          {/* Connection URI Box */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>MongoDB Compass Connection String</span>
              <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 600 }}>Default port 27017</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input
                type="text"
                readOnly
                className="form-input"
                value={compassUri}
                style={{ fontFamily: 'monospace', fontSize: '13px', backgroundColor: 'var(--bg-secondary)' }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCopyUri}
                style={{ padding: '0 14px' }}
                title="Copy Connection String"
              >
                {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Collections Overview */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Database Collections & Schema
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--accent-black)' }}>
                  <Layers size={14} color="var(--accent-blue)" /> cars
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Fleet catalog, specs, pricing, availability
                </div>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--accent-black)' }}>
                  <Layers size={14} color="var(--accent-blue)" /> bookings
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Rental reservations, dates, calculations
                </div>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--accent-black)' }}>
                  <Layers size={14} color="var(--accent-blue)" /> users
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Customers, Admins, licenses, contact info
                </div>
              </div>
            </div>
          </div>

          {/* Steps to connect with MongoDB Compass */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-black)', marginBottom: '8px' }}>
              How to manage via MongoDB Compass:
            </h4>
            <ol style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              <li>Launch <strong>MongoDB Compass</strong> on your computer.</li>
              <li>Paste <code>mongodb://127.0.0.1:27017</code> into the New Connection box.</li>
              <li>Click <strong>Connect</strong> to view the <code>rentalwheels</code> database.</li>
              <li>Browse or edit the <code>cars</code>, <code>bookings</code>, and <code>users</code> documents in real-time.</li>
            </ol>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleReset}
            disabled={resetting}
          >
            <RefreshCw size={14} className={resetting ? 'animate-spin' : ''} />
            <span>Reset / Re-seed Fleet</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
