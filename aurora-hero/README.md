# Aurora Hero

A full-screen, interactive aurora-gradient hero built with React + Tailwind CSS.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## How it works

| Piece | Where |
| --- | --- |
| Blob palette, sizes, parallax layers | `src/lib/blobs.js` |
| Spring physics (semi-implicit Euler) | `src/lib/spring.js` |
| Generated film-grain texture | `src/lib/grain.js` |
| Animation engine + layers | `src/components/AuroraBackground.jsx` |
| Nav + glass card | `src/components/Hero.jsx` |

- **Aurora:** nine large radial-gradient blobs (violet, blue, cyan, pink, emerald) in three parallax layers, blended with `mix-blend-mode: screen` for an additive glow that can't clip to white. Blob opacity is capped and a vignette darkens the edges to keep saturation in check.
- **Motion:** each blob drifts on two detuned sine waves per axis. One `requestAnimationFrame` loop writes `translate3d` / `scale` / `opacity` straight to the DOM, so React never re-renders mid-animation.
- **Interaction:** the cursor drives a spring that lags the pointer slightly, which gives the magnetic feel. Blobs near it (Gaussian falloff) are pulled toward it, scale up and brighten, each through its own spring.
- **Bloom:** a masked `backdrop-filter: saturate() brightness()` disc plus a soft additive glow sit under the cursor. Their strength follows a movement-energy value that rises with pointer speed and fades out smoothly once the pointer stops.
- **Light and depth:** a large `soft-light` radial light trails the cursor on a slower spring. The layers move against the cursor at different depths for parallax. The glass card tilts slightly through the `--px` / `--py` CSS variables, and a sheen across it follows the cursor.
- **Idle and touch:** after 3.5 s without input, or on touch devices, a "ghost" light drifts along a slow Lissajous path so the scene keeps moving.
- **Performance:** GPU-only properties (`transform`, `opacity`) and `will-change`. The loop pauses when the hero is off screen (IntersectionObserver), dt is clamped, and resizes go through ResizeObserver.
- **Mobile:** detected by a coarse pointer or a width under 768 px. It uses six blobs instead of nine, lower interaction intensity, a smaller bloom and no backdrop-filter bloom.
- **Reduced motion:** `prefers-reduced-motion` slows the drift to 30 % speed and stops the grain and entrance animations.

Customise the palette and composition in `src/lib/blobs.js`.
