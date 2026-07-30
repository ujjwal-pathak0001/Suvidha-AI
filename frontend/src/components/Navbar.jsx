import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../api/api';
import './Navbar.css';

export default function Navbar() {
  const { user, token, logoutSuccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { if (token) await logoutUser(token); } catch (_) {}
    logoutSuccess();
    setLoggingOut(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">🤟</span>
          <span className="logo-text">SuvidhaAI</span>
        </Link>

        {/* Desktop nav links */}
        <div className="navbar-links">
          <Link to="/"       className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/about"  className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
          {user && (
            <Link to="/convert" className={`nav-link ${isActive('/convert') ? 'active' : ''}`}>Converter</Link>
          )}
        </div>

        {/* Auth buttons */}
        <div className="navbar-auth">
          {user ? (
            <>
              <span className="nav-username">👤 {user.username}</span>
              <button className="btn-outline" onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? 'Signing out…' : 'Sign Out'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn-outline">Log In</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/"       onClick={() => setMenuOpen(false)} className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/about"  onClick={() => setMenuOpen(false)} className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
        {user && (
          <Link to="/convert" onClick={() => setMenuOpen(false)} className={`nav-link ${isActive('/convert') ? 'active' : ''}`}>Converter</Link>
        )}
        {user ? (
          <>
            <span className="nav-username mobile">👤 {user.username}</span>
            <button className="btn-outline mobile" onClick={handleLogout}>{loggingOut ? '…' : 'Sign Out'}</button>
          </>
        ) : (
          <>
            <Link to="/login"  onClick={() => setMenuOpen(false)} className="btn-outline mobile">Log In</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary mobile">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
