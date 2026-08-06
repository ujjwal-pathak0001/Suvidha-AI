import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

let handLandmarker = null;
let lastVideoTime = -1;
let isInitializing = false;

/**
 * Initialize the MediaPipe HandLandmarker.
 * Downloads the WASM runtime + model on first call, then reuses.
 */
export async function initHandLandmarker() {
  if (handLandmarker) return handLandmarker;
  if (isInitializing) return null; // prevent double init

  isInitializing = true;

  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
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
  } catch (err) {
    console.error('Failed to init HandLandmarker with GPU, trying CPU:', err);
    // Fallback to CPU if GPU delegate fails
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );

      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      return handLandmarker;
    } catch (cpuErr) {
      console.error('HandLandmarker init failed completely:', cpuErr);
      throw cpuErr;
    }
  } finally {
    isInitializing = false;
  }
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
    const result = handLandmarker.detectForVideo(video, Math.round(timestamp));
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
    try {
      handLandmarker.close();
    } catch (e) {
      // ignore close errors
    }
    handLandmarker = null;
    lastVideoTime = -1;
  }
}
