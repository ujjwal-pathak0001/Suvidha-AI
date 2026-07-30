import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const features = [
  {
    icon: '🎙️',
    title: 'Voice to Text',
    desc: 'Speak naturally and watch your words convert in real-time using the Web Speech API.',
  },
  {
    icon: '🧠',
    title: 'Smart NLP Processing',
    desc: 'NLTK-powered lemmatization, tense detection, and stopword removal for accurate ISL mapping.',
  },
  {
    icon: '🤟',
    title: 'ISL Animations',
    desc: 'Beautiful 3D-rendered Indian Sign Language animations for 150+ words and all alphabets.',
  },
];

const stats = [
  { value: '150+', label: 'Sign Words' },
  { value: '26',   label: 'Alphabets' },
  { value: '10',   label: 'Numerals' },
  { value: 'Real-time', label: 'Processing' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🤟 Indian Sign Language Converter</div>
          <h1 className="hero-title">
            SuvidhaAI —<br />
            <span className="hero-title-sub">Sign Language Made Simple</span>
          </h1>
          <p className="hero-subtitle">
            Speak or type anything — watch it instantly translate into
            Indian Sign Language animations powered by AI & NLP.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/convert" className="cta-primary">
                Open Converter <span className="arrow">→</span>
              </Link>
            ) : (
              <>
                <Link to="/signup" className="cta-primary">
                  Get Started Free <span className="arrow">→</span>
                </Link>
                <Link to="/login" className="cta-secondary">Log In</Link>
              </>
            )}
          </div>
        </div>

        {/* Floating demo card */}
        <div className="hero-visual">
          <div className="demo-card">
            <div className="demo-header">
              <span className="demo-dot red" /><span className="demo-dot yellow" /><span className="demo-dot green" />
              <span className="demo-title">SuvidhaAI — Converter</span>
            </div>
            <div className="demo-body">
              <div className="demo-input-row">
                <div className="demo-input">"Hello, how are you?"</div>
                <div className="demo-mic">🎙️</div>
              </div>
              <div className="demo-arrow">↓ NLP Processing</div>
              <div className="demo-words">
                {['Hello', 'How', 'You'].map((w, i) => (
                  <span key={w} className="demo-word" style={{ animationDelay: `${i * 0.3}s` }}>{w}</span>
                ))}
              </div>
              <div className="demo-video-placeholder">
                <div className="demo-avatar">🧏</div>
                <div className="demo-caption">Sign Animation Playing…</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Three powerful steps from voice to sign</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className="feature-step">Step {i + 1}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to Start Communicating?</h2>
          <p>Join thousands bridging the gap between spoken and sign language.</p>
          {!user && (
            <Link to="/signup" className="cta-primary large">Create Free Account →</Link>
          )}
          {user && (
            <Link to="/convert" className="cta-primary large">Open Converter →</Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-brand">🤟 SuvidhaAI</div>
        <p className="footer-copy">
          © {new Date().getFullYear()} SuvidhaAI — Indian Sign Language Converter.
          All rights reserved.
        </p>
        <p className="footer-dev">Developed by <strong>Ujjwal Pathak</strong></p>
      </footer>
    </div>
  );
}
