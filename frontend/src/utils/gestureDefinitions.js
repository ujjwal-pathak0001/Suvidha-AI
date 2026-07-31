import { GestureDescription, Finger, FingerCurl, FingerDirection } from 'fingerpose';

// ── ASL Alphabet Gesture Definitions ─────────────────────────────────
// Each gesture defines expected finger curl and direction for one letter.
// Confidence weights (0.0–1.0) control how strictly each constraint is enforced.

// Helper to quickly set all four non-thumb fingers
const setFingers = (gesture, fingers, curl, confidence = 1.0) => {
  fingers.forEach(f => gesture.addCurl(f, curl, confidence));
};

const allFingers = [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky];

// ── A ─────────────────────────────────────────────────────────────────
const aGesture = new GestureDescription('A');
aGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
aGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.7);
setFingers(aGesture, allFingers, FingerCurl.FullCurl, 1.0);

// ── B ─────────────────────────────────────────────────────────────────
const bGesture = new GestureDescription('B');
bGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
setFingers(bGesture, allFingers, FingerCurl.NoCurl, 1.0);
[Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky].forEach(f =>
  bGesture.addDirection(f, FingerDirection.VerticalUp, 0.7)
);

// ── C ─────────────────────────────────────────────────────────────────
const cGesture = new GestureDescription('C');
cGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);
setFingers(cGesture, allFingers, FingerCurl.HalfCurl, 1.0);

// ── D ─────────────────────────────────────────────────────────────────
const dGesture = new GestureDescription('D');
dGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8);
dGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
dGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.8);
setFingers(dGesture, [Finger.Middle, Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── E ─────────────────────────────────────────────────────────────────
const eGesture = new GestureDescription('E');
eGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8);
setFingers(eGesture, allFingers, FingerCurl.FullCurl, 0.9);

// ── F ─────────────────────────────────────────────────────────────────
const fGesture = new GestureDescription('F');
fGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8);
fGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
setFingers(fGesture, [Finger.Middle, Finger.Ring, Finger.Pinky], FingerCurl.NoCurl, 1.0);
[Finger.Middle, Finger.Ring, Finger.Pinky].forEach(f =>
  fGesture.addDirection(f, FingerDirection.VerticalUp, 0.7)
);

// ── G ─────────────────────────────────────────────────────────────────
const gGesture = new GestureDescription('G');
gGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);
gGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.7);
gGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
gGesture.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.8);
setFingers(gGesture, [Finger.Middle, Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── H ─────────────────────────────────────────────────────────────────
const hGesture = new GestureDescription('H');
hGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.7);
hGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
hGesture.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.8);
hGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
hGesture.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 0.8);
setFingers(hGesture, [Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── I ─────────────────────────────────────────────────────────────────
const iGesture = new GestureDescription('I');
iGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);
setFingers(iGesture, [Finger.Index, Finger.Middle, Finger.Ring], FingerCurl.FullCurl, 1.0);
iGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
iGesture.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.8);

// ── K ─────────────────────────────────────────────────────────────────
const kGesture = new GestureDescription('K');
kGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);
kGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
kGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.7);
kGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
kGesture.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.7);
setFingers(kGesture, [Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── L ─────────────────────────────────────────────────────────────────
const lGesture = new GestureDescription('L');
lGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
lGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.7);
lGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
lGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.8);
setFingers(lGesture, [Finger.Middle, Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── M ─────────────────────────────────────────────────────────────────
const mGesture = new GestureDescription('M');
mGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);
setFingers(mGesture, allFingers, FingerCurl.FullCurl, 0.9);
mGesture.addDirection(Finger.Index, FingerDirection.VerticalDown, 0.7);

// ── N ─────────────────────────────────────────────────────────────────
const nGesture = new GestureDescription('N');
nGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);
nGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 0.9);
nGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.9);
setFingers(nGesture, [Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── O ─────────────────────────────────────────────────────────────────
const oGesture = new GestureDescription('O');
oGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8);
setFingers(oGesture, allFingers, FingerCurl.HalfCurl, 0.9);

// ── P ─────────────────────────────────────────────────────────────────
const pGesture = new GestureDescription('P');
pGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);
pGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
pGesture.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 0.7);
pGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
pGesture.addDirection(Finger.Middle, FingerDirection.DiagonalDownLeft, 0.7);
setFingers(pGesture, [Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── Q ─────────────────────────────────────────────────────────────────
const qGesture = new GestureDescription('Q');
qGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);
qGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.7);
qGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
qGesture.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 0.7);
setFingers(qGesture, [Finger.Middle, Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── R ─────────────────────────────────────────────────────────────────
const rGesture = new GestureDescription('R');
rGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);
rGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
rGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.8);
rGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
rGesture.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.8);
setFingers(rGesture, [Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── S ─────────────────────────────────────────────────────────────────
const sGesture = new GestureDescription('S');
sGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.7);
setFingers(sGesture, allFingers, FingerCurl.FullCurl, 1.0);

// ── T ─────────────────────────────────────────────────────────────────
const tGesture = new GestureDescription('T');
tGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8);
tGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
setFingers(tGesture, [Finger.Middle, Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── U ─────────────────────────────────────────────────────────────────
const uGesture = new GestureDescription('U');
uGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);
uGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
uGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.8);
uGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
uGesture.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.8);
setFingers(uGesture, [Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── V ─────────────────────────────────────────────────────────────────
const vGesture = new GestureDescription('V');
vGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);
vGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
vGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.7);
vGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
vGesture.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.7);
setFingers(vGesture, [Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── W ─────────────────────────────────────────────────────────────────
const wGesture = new GestureDescription('W');
wGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);
setFingers(wGesture, [Finger.Index, Finger.Middle, Finger.Ring], FingerCurl.NoCurl, 1.0);
[Finger.Index, Finger.Middle, Finger.Ring].forEach(f =>
  wGesture.addDirection(f, FingerDirection.VerticalUp, 0.7)
);
wGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ── X ─────────────────────────────────────────────────────────────────
const xGesture = new GestureDescription('X');
xGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.7);
xGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
setFingers(xGesture, [Finger.Middle, Finger.Ring, Finger.Pinky], FingerCurl.FullCurl, 1.0);

// ── Y ─────────────────────────────────────────────────────────────────
const yGesture = new GestureDescription('Y');
yGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
yGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.7);
setFingers(yGesture, [Finger.Index, Finger.Middle, Finger.Ring], FingerCurl.FullCurl, 1.0);
yGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
yGesture.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.7);

// ── Exports ──────────────────────────────────────────────────────────
export const Gestures = [
  aGesture, bGesture, cGesture, dGesture, eGesture,
  fGesture, gGesture, hGesture, iGesture, kGesture,
  lGesture, mGesture, nGesture, oGesture, pGesture,
  qGesture, rGesture, sGesture, tGesture, uGesture,
  vGesture, wGesture, xGesture, yGesture,
];

export default Gestures;
