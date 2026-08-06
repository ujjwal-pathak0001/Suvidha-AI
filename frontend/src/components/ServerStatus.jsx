import { useState, useEffect } from 'react';
import { warmupServer } from '../api/api';

/**
 * Shows a slim top-banner while the Render backend is waking up.
 * Automatically hides once the server responds.
 */
export default function ServerStatus() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  useEffect(() => {
    const start = Date.now();

    warmupServer()
      .then(() => {
        setStatus('online');
      })
      .catch(() => {
        setStatus('offline');
      });

    // If it takes more than 2 seconds, show the banner
    const timer = setTimeout(() => {
      setStatus((s) => (s === 'checking' ? 'waking' : s));
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (status === 'online' || status === 'checking') return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      padding: '8px 16px',
      textAlign: 'center',
      fontSize: '0.85rem',
      fontWeight: 500,
      color: '#fff',
      background: status === 'waking'
        ? 'linear-gradient(90deg, #f59e0b, #d97706)'
        : 'linear-gradient(90deg, #ef4444, #dc2626)',
      animation: 'slideDown 0.3s ease-out',
    }}>
      {status === 'waking' && (
        <>⏳ Server is waking up (free tier)… this takes ~30 seconds on first visit</>
      )}
      {status === 'offline' && (
        <>⚠️ Backend server is not responding. Some features may not work.</>
      )}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
