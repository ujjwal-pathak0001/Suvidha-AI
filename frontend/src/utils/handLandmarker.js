import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

let handLandmarker = null;
let lastVideoTime = -1;

/**
 * Initialize the MediaPipe HandLandmarker.
 * Downloads the WASM runtime + model on first call, then reuses.
 */
export async function initHandLandmarker() {
  if (handLandmarker) return handLandmarker;

  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numHands: 1,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  return handLandmarker;
}

/**
 * Detect hand landmarks from a video frame.
 * @param {HTMLVideoElement} video
 * @param {number} timestamp - performance.now() or similar
 * @returns {{ landmarks: Array, worldLandmarks: Array, handedness: Array } | null}
 */
export function detectHands(video, timestamp) {
  if (!handLandmarker || !video || video.readyState < 2) return null;

  // MediaPipe requires strictly increasing timestamps
  if (timestamp <= lastVideoTime) {
    timestamp = lastVideoTime + 1;
  }
  lastVideoTime = timestamp;

  try {
    const result = handLandmarker.detectForVideo(video, timestamp);
    if (result.landmarks && result.landmarks.length > 0) {
      return {
        landmarks: result.landmarks[0],        // 21 normalized landmarks
        worldLandmarks: result.worldLandmarks?.[0] || null,
        handedness: result.handednesses?.[0] || null,
      };
    }
  } catch (e) {
    console.warn('Hand detection error:', e);
  }
  return null;
}

/**
 * Convert MediaPipe landmarks to the format fingerpose expects.
 * fingerpose wants: [[x, y, z], [x, y, z], ...] for 21 landmarks
 * where x/y are pixel coordinates and z is depth.
 */
export function landmarksToFingerpose(landmarks, videoWidth, videoHeight) {
  return landmarks.map(lm => [
    lm.x * videoWidth,
    lm.y * videoHeight,
    lm.z * videoWidth, // z is relative to x scale
  ]);
}

/**
 * Cleanup: close the hand landmarker.
 */
export function closeHandLandmarker() {
  if (handLandmarker) {
    handLandmarker.close();
    handLandmarker = null;
    lastVideoTime = -1;
  }
}
