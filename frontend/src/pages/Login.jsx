import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Login() {
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await loginUser(form);
      loginSuccess(res.data);
      navigate('/convert');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <Link to="/" className="auth-logo">🤟 SuvidhaAI</Link>
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">⚠️ {error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Your username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Sign In →'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup">Create one free</Link>
        </div>

        <div className="auth-copyright">
          © {new Date().getFullYear()} SuvidhaAI. All rights reserved.<br />
          Developed by <strong>Ujjwal Pathak</strong>
        </div>
      </div>
    </div>
  );
}
