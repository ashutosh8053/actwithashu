// RGB triplets — tuned slightly below full saturation so additive
// blending stays luminous without clipping into neon.
export const COLORS = {
  violet: '139, 92, 246',
  blue: '59, 110, 246',
  cyan: '34, 200, 238',
  pink: '232, 72, 160',
  emerald: '16, 185, 129',
};

// Parallax layers, far → near. `depth` scales how far a layer drifts
// against the cursor; `shift` is the max offset in px at depth 1.
export const LAYERS = [
  { depth: 0.18 },
  { depth: 0.45 },
  { depth: 0.9 },
];
export const PARALLAX_SHIFT = 70;

// x / y: normalized viewport position. size: fraction of max(vw, vh).
// amp: float amplitude as fraction of min(vw, vh). freq: rad/s.
export const BLOBS = [
  // Far — large, slow washes of color
  { layer: 0, color: 'violet', x: 0.2, y: 0.28, size: 0.78, opacity: 0.55, amp: 0.08, freq: 0.07, phase: 0.0 },
  { layer: 0, color: 'blue', x: 0.8, y: 0.22, size: 0.72, opacity: 0.5, amp: 0.07, freq: 0.06, phase: 1.7 },
  { layer: 0, color: 'emerald', x: 0.52, y: 0.95, size: 0.7, opacity: 0.32, amp: 0.06, freq: 0.08, phase: 3.1 },
  // Mid
  { layer: 1, color: 'cyan', x: 0.72, y: 0.64, size: 0.5, opacity: 0.4, amp: 0.1, freq: 0.11, phase: 0.6 },
  { layer: 1, color: 'pink', x: 0.26, y: 0.74, size: 0.48, opacity: 0.38, amp: 0.1, freq: 0.1, phase: 2.4 },
  { layer: 1, color: 'violet', x: 0.5, y: 0.36, size: 0.42, opacity: 0.3, amp: 0.09, freq: 0.12, phase: 4.2 },
  // Near — smaller accents, desktop only
  { layer: 2, color: 'pink', x: 0.88, y: 0.82, size: 0.3, opacity: 0.3, amp: 0.12, freq: 0.15, phase: 5.0, desktopOnly: true },
  { layer: 2, color: 'cyan', x: 0.12, y: 0.16, size: 0.28, opacity: 0.28, amp: 0.12, freq: 0.14, phase: 1.1, desktopOnly: true },
  { layer: 2, color: 'emerald', x: 0.4, y: 0.14, size: 0.26, opacity: 0.24, amp: 0.11, freq: 0.16, phase: 3.7, desktopOnly: true },
];

export function blobGradient(color) {
  const c = COLORS[color];
  return `radial-gradient(closest-side, rgba(${c}, 1) 0%, rgba(${c}, 0.6) 32%, rgba(${c}, 0.22) 62%, rgba(${c}, 0) 100%)`;
}
