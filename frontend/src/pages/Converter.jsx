import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { convertText } from '../api/api';
import './Converter.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const BACKEND_BASE = API_BASE.replace(/\/api\/?$/, '');
const DJANGO_STATIC = `${BACKEND_BASE}/static/`;

export default function Converter() {
  const { user, token } = useAuth();

  const [inputText, setInputText]     = useState('');
  const [words, setWords]             = useState([]);
  const [originalText, setOriginalText] = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Video player state
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [hasStarted, setHasStarted]   = useState(false);

  const videoRef = useRef(null);
  const recRef   = useRef(null);

  // ── Submit text for NLP conversion ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) { setError('Please enter some text.'); return; }
    setLoading(true);
    setError('');
    setWords([]);
    setHasStarted(false);
    setCurrentIdx(0);
    try {
      const res = await convertText(inputText.trim(), token);
      setWords(res.data.words);
      setOriginalText(res.data.text);
    } catch (err) {
      setError(err.response?.data?.error || 'Conversion failed. Is the Django server running?');
    } finally {
      setLoading(false);
    }
  };

  // ── Speech recognition ──────────────────────────────────────────────────
  const handleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Try Chrome.');
      return;
    }
    if (isRecording) {
      recRef.current?.stop();
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.onstart  = () => setIsRecording(true);
    rec.onresult = (e) => setInputText(e.results[0][0].transcript);
    rec.onerror  = () => { setIsRecording(false); setError('Microphone error. Check permissions.'); };
    rec.onend    = () => setIsRecording(false);
    rec.start();
    recRef.current = rec;
  };

  // ── Video playback ──────────────────────────────────────────────────────
  const playFrom = useCallback((idx) => {
    if (!videoRef.current || !words[idx]) return;
    videoRef.current.src = `${DJANGO_STATIC}${words[idx]}.mp4`;
    videoRef.current.load();
    videoRef.current.play().catch(() => {});
    setCurrentIdx(idx);
    setIsPlaying(true);
    setHasStarted(true);
  }, [words]);

  const handleVideoEnd = useCallback(() => {
    const next = currentIdx + 1;
    if (next < words.length) {
      playFrom(next);
    } else {
      setIsPlaying(false);
    }
  }, [currentIdx, words.length, playFrom]);

  // Auto-play when words arrive
  useEffect(() => {
    if (words.length > 0) {
      setTimeout(() => playFrom(0), 300);
    }
  }, [words]); // eslint-disable-line

  const handlePlayPause = () => {
    if (!videoRef.current || words.length === 0) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!hasStarted) {
        playFrom(0);
      } else if (currentIdx >= words.length) {
        playFrom(0);
        setCurrentIdx(0);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleReplay = () => {
    setCurrentIdx(0);
    playFrom(0);
  };

  const handleWordClick = (idx) => playFrom(idx);

  return (
    <div className="converter-page">
      <div className="converter-header">
        <h1>🤟 SuvidhaAI — Sign Language Converter</h1>
        <p className="converter-subhead">Welcome, <strong>{user?.username}</strong> — speak or type to convert to Indian Sign Language</p>
      </div>

      <div className="converter-layout">
        {/* ── Left Panel ─────────────────────────────────── */}
        <div className="panel left-panel">
          <div className="panel-title">
            <span className="panel-icon">🎙️</span>
            Input
          </div>

          <form onSubmit={handleSubmit} className="input-form">
            <div className="input-row">
              <input
                id="text-input"
                type="text"
                className={`text-input ${isRecording ? 'recording' : ''}`}
                placeholder="Type a sentence or press mic to speak…"
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setError(''); }}
              />
              <button
                type="button"
                className={`mic-btn ${isRecording ? 'active' : ''}`}
                onClick={handleMic}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? (
                  <span className="mic-pulse">⏹</span>
                ) : '🎙️'}
              </button>
            </div>

            {isRecording && (
              <div className="recording-indicator">
                <span className="rec-dot" />
                Listening… speak now
              </div>
            )}

            {error && <div className="conv-error">⚠️ {error}</div>}

            <button type="submit" className="convert-btn" disabled={loading || !inputText.trim()}>
              {loading ? (
                <><span className="btn-spinner" /> Processing…</>
              ) : (
                <><span>✨</span> Convert to Sign Language</>
              )}
            </button>
          </form>

          {/* Results */}
          {originalText && (
            <div className="results-section">
              <div className="result-row">
                <span className="result-label">Original text</span>
                <span className="result-text">"{originalText}"</span>
              </div>
              {words.length > 0 && (
                <div className="result-row">
                  <span className="result-label">Sign words ({words.length})</span>
                  <div className="word-chips">
                    {words.map((w, i) => (
                      <button
                        key={`${w}-${i}`}
                        className={`word-chip ${i === currentIdx && hasStarted ? 'active' : ''}`}
                        onClick={() => handleWordClick(i)}
                        title={`Play sign for "${w}"`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right Panel ────────────────────────────────── */}
        <div className="panel right-panel">
          <div className="panel-title">
            <span className="panel-icon">🤟</span>
            ISL Animation
          </div>

          <div className="video-container">
            {words.length === 0 ? (
              <div className="video-empty">
                <div className="empty-icon">🧏</div>
                <p>Your ISL animation will appear here</p>
                <p className="empty-hint">Type or speak a sentence and click Convert</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="sign-video"
                  onEnded={handleVideoEnd}
                  playsInline
                  muted={false}
                />

                {/* Progress bar */}
                <div className="video-progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${words.length > 0 ? ((currentIdx + 1) / words.length) * 100 : 0}%` }}
                  />
                </div>

                {/* Word indicator */}
                <div className="now-playing">
                  {hasStarted && words[currentIdx] && (
                    <>
                      <span className="np-label">Now signing:</span>
                      <span className="np-word">{words[currentIdx]}</span>
                      <span className="np-count">{currentIdx + 1} / {words.length}</span>
                    </>
                  )}
                </div>

                {/* Controls */}
                <div className="video-controls">
                  <button className="ctrl-btn" onClick={handleReplay} title="Replay from start">↺</button>
                  <button className={`ctrl-btn play-btn ${isPlaying ? 'pause' : 'play'}`} onClick={handlePlayPause}>
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <div className="ctrl-label">{isPlaying ? 'Playing' : 'Paused'}</div>
                </div>
              </>
            )}
          </div>

          {/* Quick try examples */}
          {words.length === 0 && (
            <div className="examples-section">
              <p className="examples-label">Try an example:</p>
              <div className="example-chips">
                {['Hello how are you', 'I am happy', 'Thank you very much', 'Good morning'].map((ex) => (
                  <button
                    key={ex}
                    className="example-chip"
                    onClick={() => setInputText(ex)}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="converter-footer">
        © {new Date().getFullYear()} SuvidhaAI — Indian Sign Language Converter. All rights reserved.<br />
        Developed by <strong>Ujjwal Pathak</strong>
      </div>
    </div>
  );
}
