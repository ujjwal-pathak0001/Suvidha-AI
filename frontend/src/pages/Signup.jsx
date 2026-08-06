import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Signup() {
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ username: '', password1: '', password2: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password1 || !form.password2) { setError('Please fill in all fields.'); return; }
    if (form.password1 !== form.password2) { setError('Passwords do not match.'); return; }
    if (form.password1.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await signupUser(form);
      loginSuccess(res.data);
      navigate('/convert');
    } catch (err) {
      setError(err.response?.data?.error || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password1;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)           s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9]/.test(p))         s++;
    if (/[^A-Za-z0-9]/.test(p))  s++;
    return s;
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#86efac', '#6ee7b7'][strength];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <Link to="/" className="auth-logo">🤟 SuvidhaAI</Link>
          <h1>Create account</h1>
          <p>Start converting speech to sign language for free</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">⚠️ {error}</div>}

          <div className="form-group">
            <label htmlFor="su-username">Username</label>
            <input
              id="su-username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="su-password1">Password</label>
            <input
              id="su-password1"
              name="password1"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password1}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {form.password1 && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1,2,3,4].map((i) => (
                    <div
                      key={i}
                      className="strength-bar"
                      style={{ background: i <= strength ? strengthColor : 'rgba(255,255,255,0.08)' }}
                    />
                  ))}
                </div>
                <span style={{ color: strengthColor, fontSize: '0.74rem', fontWeight: 600 }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="su-password2">Confirm Password</label>
            <input
              id="su-password2"
              name="password2"
              type="password"
              placeholder="Repeat password"
              value={form.password2}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner" /> Connecting…</> : 'Create Account →'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>

        <div className="auth-copyright">
          © {new Date().getFullYear()} SuvidhaAI. All rights reserved.<br />
          Developed by <strong>Ujjwal Pathak</strong>
        </div>
      </div>
    </div>
  );
}
