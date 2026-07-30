import './About.css';

const techStack = [
  { name: 'NLTK Engine',    role: 'Natural Language Processing', icon: '🧠', desc: 'Tokenization, POS tagging, lemmatization, and stopword removal.' },
  { name: 'Web Speech API', role: 'Voice Recognition',           icon: '🎙️', desc: 'Real-time browser-based speech recognition in English (IN).' },
  { name: 'Django REST',    role: 'Backend API',                  icon: '⚙️', desc: 'Secure token-authenticated REST API for NLP processing.' },
  { name: 'Blender 3D',     role: 'Sign Animations',              icon: '🎬', desc: '150+ words and full alphabet rendered as MP4 ISL animations.' },
];

const timeline = [
  { step: '01', title: 'Speak or Type',    desc: 'Use your microphone or keyboard to input any English sentence.' },
  { step: '02', title: 'NLP Processing',   desc: 'NLTK removes stopwords, detects tense, and lemmatizes each word.' },
  { step: '03', title: 'Sign Mapping',     desc: 'Each processed word is mapped to its ISL video animation.' },
  { step: '04', title: 'Watch & Learn',    desc: 'Animations play sequentially so you can follow along word by word.' },
];

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-badge">🌟 About SuvidhaAI</div>
          <h1>Making Communication <span className="about-em">Accessible for All</span></h1>
          <p>
            SuvidhaAI bridges the gap between spoken English and Indian Sign Language through
            cutting-edge NLP and 3D animation technology — completely in your browser.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="about-section">
        <h2 className="section-title">How SuvidhaAI Works</h2>
        <div className="timeline">
          {timeline.map((t) => (
            <div key={t.step} className="timeline-item">
              <div className="timeline-step">{t.step}</div>
              <div className="timeline-content">
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="about-section alt">
        <h2 className="section-title">Technology Stack</h2>
        <div className="tech-grid">
          {techStack.map((t) => (
            <div key={t.name} className="tech-card">
              <div className="tech-icon">{t.icon}</div>
              <div>
                <div className="tech-name">{t.name}</div>
                <div className="tech-role">{t.role}</div>
                <div className="tech-desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="about-section mission">
        <div className="mission-card">
          <div className="mission-emoji">🤟</div>
          <h2>Our Mission</h2>
          <p>
            An estimated 18 million people in India use Indian Sign Language as their primary mode of
            communication. SuvidhaAI aims to make ISL more accessible for learners, educators, and
            families — one sign at a time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="about-footer-brand">🤟 SuvidhaAI</div>
        <p>© {new Date().getFullYear()} SuvidhaAI — Indian Sign Language Converter. All rights reserved.</p>
        <p>Developed by <strong>Ujjwal Pathak</strong></p>
      </footer>
    </div>
  );
}
