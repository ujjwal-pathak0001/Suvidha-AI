import { useState, useRef, useEffect, useCallback } from 'react';
import { GestureEstimator } from 'fingerpose';
import { Gestures } from '../utils/gestureDefinitions';
import {
  initHandLandmarker,
  detectHands,
  landmarksToFingerpose,
  closeHandLandmarker,
} from '../utils/handLandmarker';
import './SignRecognizer.css';

const CONFIDENCE_THRESHOLD = 7.5;   // fingerpose score threshold (out of 10)
const STABLE_FRAMES = 12;           // frames required with same letter to accept
const HAND_CONNECTIONS = [           // MediaPipe hand skeleton connections
  [0,1],[1,2],[2,3],[3,4],           // thumb
  [0,5],[5,6],[6,7],[7,8],           // index
  [0,9],[9,10],[10,11],[11,12],      // middle
  [0,13],[13,14],[14,15],[15,16],    // ring
  [0,17],[17,18],[18,19],[19,20],    // pinky
  [5,9],[9,13],[13,17],              // palm
];

export default function SignRecognizer() {
  const [cameraActive, setCameraActive]   = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [detectedLetter, setDetectedLetter] = useState('');
  const [confidence, setConfidence]       = useState(0);
  const [handDetected, setHandDetected]   = useState(false);
  const [accumulatedText, setAccumulatedText] = useState('');
  const [letterHistory, setLetterHistory] = useState([]);

  const videoRef      = useRef(null);
  const canvasRef     = useRef(null);
  const streamRef     = useRef(null);
  const animFrameRef  = useRef(null);
  const stableCountRef = useRef(0);
  const lastLetterRef  = useRef('');
  const gestureEstimatorRef = useRef(null);

  // Initialize gesture estimator once
  useEffect(() => {
    try {
      gestureEstimatorRef.current = new GestureEstimator(Gestures);
    } catch (err) {
      console.error('Failed to initialize gesture estimator:', err);
      setError('Failed to load gesture recognition. Please refresh the page.');
    }
  }, []);

  // ── Start camera ─────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Step 1: Get camera stream FIRST (so user sees video immediately)
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
      } catch (camErr) {
        if (camErr.name === 'NotAllowedError') {
          throw new Error('CAMERA_DENIED');
        } else if (camErr.name === 'NotFoundError' || camErr.name === 'DevicesNotFoundError') {
          throw new Error('CAMERA_NOT_FOUND');
        } else {
          throw new Error('CAMERA_ERROR:' + camErr.message);
        }
      }

      streamRef.current = stream;

      // Step 2: Attach stream to video element and wait for it to be ready
      const video = videoRef.current;
      if (!video) throw new Error('VIDEO_ELEMENT_MISSING');

      video.srcObject = stream;

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('VIDEO_TIMEOUT')), 10000);
        video.onloadedmetadata = () => {
          clearTimeout(timeout);
          video.play().then(resolve).catch(reject);
        };
        video.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('VIDEO_PLAY_ERROR'));
        };
      });

      setCameraActive(true);

      // Step 3: Initialize MediaPipe AI model (downloads ~5MB on first use)
      try {
        await initHandLandmarker();
      } catch (modelErr) {
        console.error('MediaPipe model init error:', modelErr);
        setError('⚠️ AI model failed to load. Hand detection won\'t work, but camera is active. Try refreshing the page.');
      }

    } catch (err) {
      // Clean up stream on error
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;

      const msg = err.message || '';
      if (msg === 'CAMERA_DENIED') {
        setError('Camera permission denied. Please allow camera access in your browser settings and try again.');
      } else if (msg === 'CAMERA_NOT_FOUND') {
        setError('No camera found. Please connect a webcam and try again.');
      } else if (msg === 'VIDEO_TIMEOUT') {
        setError('Camera took too long to start. Please try again.');
      } else {
        setError(`Camera error: ${msg.replace('CAMERA_ERROR:', '')}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Stop camera ──────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setHandDetected(false);
    setDetectedLetter('');
    setConfidence(0);
    stableCountRef.current = 0;
    lastLetterRef.current = '';
  }, []);

  // ── Detection loop ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!cameraActive) return;

    const detect = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(detect);
        return;
      }

      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Detect hands
      const result = detectHands(video, performance.now());

      if (result && result.landmarks) {
        setHandDetected(true);

        // Draw landmarks on canvas
        drawLandmarks(ctx, result.landmarks, canvas.width, canvas.height);

        // Convert to fingerpose format and classify
        const fpLandmarks = landmarksToFingerpose(
          result.landmarks,
          canvas.width,
          canvas.height
        );

        try {
          const estimation = gestureEstimatorRef.current.estimate(fpLandmarks, 7);

          if (estimation.gestures && estimation.gestures.length > 0) {
            // Get best match
            const best = estimation.gestures.reduce((a, b) =>
              a.score > b.score ? a : b
            );

            setDetectedLetter(best.name);
            setConfidence(best.score);

            // Stabilization: accept letter after STABLE_FRAMES consecutive frames
            if (best.name === lastLetterRef.current && best.score >= CONFIDENCE_THRESHOLD) {
              stableCountRef.current++;
              if (stableCountRef.current === STABLE_FRAMES) {
                // Accept this letter
                setAccumulatedText(prev => prev + best.name);
                setLetterHistory(prev => [...prev, best.name].slice(-30));
              }
            } else {
              lastLetterRef.current = best.name;
              stableCountRef.current = 0;
            }
          } else {
            setDetectedLetter('');
            setConfidence(0);
            stableCountRef.current = 0;
            lastLetterRef.current = '';
          }
        } catch {
          // fingerpose can throw on certain landmark configs
        }
      } else {
        setHandDetected(false);
        setDetectedLetter('');
        setConfidence(0);
        stableCountRef.current = 0;
        lastLetterRef.current = '';
      }

      animFrameRef.current = requestAnimationFrame(detect);
    };

    animFrameRef.current = requestAnimationFrame(detect);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [cameraActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      closeHandLandmarker();
    };
  }, [stopCamera]);

  // ── Draw hand landmarks ──────────────────────────────────────────────────
  const drawLandmarks = (ctx, landmarks, w, h) => {
    // Draw connections
    ctx.strokeStyle = 'rgba(110, 231, 183, 0.6)';
    ctx.lineWidth = 2;
    HAND_CONNECTIONS.forEach(([i, j]) => {
      const a = landmarks[i];
      const b = landmarks[j];
      ctx.beginPath();
      ctx.moveTo(a.x * w, a.y * h);
      ctx.lineTo(b.x * w, b.y * h);
      ctx.stroke();
    });

    // Draw points
    landmarks.forEach((lm, i) => {
      const x = lm.x * w;
      const y = lm.y * h;
      ctx.beginPath();
      ctx.arc(x, y, i === 0 ? 5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#6ee7b7' : 'rgba(255,255,255,0.85)';
      ctx.fill();
    });
  };

  // ── UI Handlers ──────────────────────────────────────────────────────────
  const handleSpace = () => setAccumulatedText(prev => prev + ' ');
  const handleBackspace = () => setAccumulatedText(prev => prev.slice(0, -1));
  const handleClear = () => { setAccumulatedText(''); setLetterHistory([]); };
  const handleCopy = () => {
    navigator.clipboard.writeText(accumulatedText);
  };

  const confidencePercent = Math.min(100, Math.round((confidence / 10) * 100));

  return (
    <div className="recognizer-page">
      <div className="recognizer-header">
        <h1>📷 Sign Language Recognizer</h1>
        <p className="recognizer-subhead">
          Show hand signs to your camera — AI detects and converts them to text in real-time
        </p>
      </div>

      <div className="recognizer-layout">
        {/* ── Left Panel: Camera ────────────────────────── */}
        <div className="panel cam-panel">
          <div className="panel-title">
            <span className="panel-icon">📹</span>
            Camera Feed
            {handDetected && <span className="hand-badge">✋ Hand Detected</span>}
          </div>

          <div className={`video-wrapper ${handDetected ? 'hand-active' : ''}`}>
            {!cameraActive && (
              <div className="cam-empty">
                <div className="cam-empty-icon">📷</div>
                <p>Camera is off</p>
                <p className="cam-hint">Click "Start Camera" to begin recognizing signs</p>
              </div>
            )}
            <video
              ref={videoRef}
              className="cam-video"
              playsInline
              muted
              style={{ display: cameraActive ? 'block' : 'none' }}
            />
            <canvas
              ref={canvasRef}
              className="cam-canvas"
              style={{ display: cameraActive ? 'block' : 'none' }}
            />
          </div>

          {/* Camera Controls */}
          <div className="cam-controls">
            {!cameraActive ? (
              <button
                className="cam-btn start"
                onClick={startCamera}
                disabled={loading}
              >
                {loading ? (
                  <><span className="btn-spinner" /> Loading AI Model…</>
                ) : (
                  <>📷 Start Camera</>
                )}
              </button>
            ) : (
              <button className="cam-btn stop" onClick={stopCamera}>
                ⏹ Stop Camera
              </button>
            )}
          </div>

          {error && <div className="cam-error">⚠️ {error}</div>}

          {/* Detection Info */}
          {cameraActive && (
            <div className="detection-info">
              <div className="detection-row">
                <span className="det-label">Detected:</span>
                <span className={`det-letter ${detectedLetter ? 'active' : ''}`}>
                  {detectedLetter || '—'}
                </span>
              </div>
              <div className="detection-row">
                <span className="det-label">Confidence:</span>
                <div className="confidence-bar-wrapper">
                  <div
                    className={`confidence-bar ${confidencePercent > 75 ? 'high' : confidencePercent > 50 ? 'mid' : 'low'}`}
                    style={{ width: `${confidencePercent}%` }}
                  />
                </div>
                <span className="det-pct">{confidencePercent}%</span>
              </div>
              <div className="detection-row">
                <span className="det-label">Stability:</span>
                <div className="stability-dots">
                  {Array.from({ length: STABLE_FRAMES }, (_, i) => (
                    <span
                      key={i}
                      className={`stability-dot ${i < stableCountRef.current ? 'filled' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right Panel: Output ───────────────────────── */}
        <div className="panel output-panel">
          <div className="panel-title">
            <span className="panel-icon">📝</span>
            Recognized Text
          </div>

          <div className="output-text-area">
            {accumulatedText ? (
              <p className="output-text">{accumulatedText}<span className="cursor-blink">|</span></p>
            ) : (
              <p className="output-placeholder">
                Recognized letters will appear here as you sign…
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="output-actions">
            <button className="action-btn" onClick={handleSpace} title="Add space">
              ␣ Space
            </button>
            <button className="action-btn" onClick={handleBackspace} title="Remove last character">
              ⌫ Backspace
            </button>
            <button className="action-btn" onClick={handleClear} title="Clear all text">
              🗑 Clear
            </button>
            <button className="action-btn copy" onClick={handleCopy} title="Copy to clipboard" disabled={!accumulatedText}>
              📋 Copy
            </button>
          </div>

          {/* Letter History */}
          {letterHistory.length > 0 && (
            <div className="history-section">
              <span className="history-label">Recent detections:</span>
              <div className="history-chips">
                {letterHistory.map((l, i) => (
                  <span key={`${l}-${i}`} className="history-chip">{l}</span>
                ))}
              </div>
            </div>
          )}

          {/* Sign Guide */}
          <div className="sign-guide">
            <div className="guide-title">🤟 Quick Reference</div>
            <p className="guide-text">
              Show ASL alphabet signs to your webcam. Hold each sign steady for ~1 second.
              Best results with good lighting and a plain background.
            </p>
            <div className="guide-letters">
              {'ABCDEFGHIKLMNOPQRSTUVWXY'.split('').map(l => (
                <span key={l} className="guide-letter">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="recognizer-footer">
        © {new Date().getFullYear()} SuvidhaAI — Powered by MediaPipe Hand Landmarker + fingerpose.<br />
        Developed by <strong>Ujjwal Pathak</strong>
      </div>
    </div>
  );
}
