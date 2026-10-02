# ActWithAshu — $5 Website Hero

A full-screen hero with a real-time **WebGL fluid simulation** behind it: smoky, ink-in-water color that follows your cursor, built with React + Tailwind CSS and raw WebGL (no Three.js needed).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## How it works

| Piece | Where |
| --- | --- |
| Fluid solver, bloom, shading (GLSL) | `src/lib/fluid.js` |
| Cursor emitter, color drift, ambient ink | `src/components/FluidBackground.jsx` |
| Nav, headline, CTAs | `src/components/Hero.jsx` |
| Spring physics | `src/lib/spring.js` |
| Film-grain texture | `src/lib/grain.js` |

- **Fluid:** a stable-fluids Navier–Stokes solver runs on the GPU in half-float framebuffers. Each step computes curl, applies vorticity confinement, computes divergence, solves pressure with Jacobi iterations, subtracts the pressure gradient and advects. Vorticity confinement creates the swirling, smoky tendrils.
- **Cursor:** the pointer drives a spring-smoothed emitter, so trails curve and flow instead of snapping to the pointer. Faster movement injects more force and more vivid dye. Clicking or tapping releases a burst of color.
- **Color:** the dye drifts slowly through violet, mint, cyan, magenta, crimson, gold and pearl. A filmic tone curve lets bright cores glow without clipping to white.
- **Bloom and shading:** a threshold bloom chain makes dense ink glow, and normal-based shading gives the smoke volume.
- **Always alive:** when the pointer is idle, a ghost emitter wanders a slow path and puffs of ink drift in from the edges.
- **Depth:** a soft radial light trails the cursor, the copy moves with subtle parallax, and a vignette and animated grain sit on top.
- **Performance:**
  - Everything runs in one `requestAnimationFrame` loop that pauses when the hero is off screen.
  - The device pixel ratio is capped at 1.5, and ink density is independent of frame rate.
- **Mobile:**
  - The simulation and dye resolution are lower, with fewer pressure iterations and lighter bloom.
  - Touching and dragging stirs the ink.
- **Fallbacks:**
  - Browsers without WebGL get a static gradient.
  - `prefers-reduced-motion` slows the fluid and turns off the ambient puffs.

## Customise

- Messaging and CTA link: `src/components/Hero.jsx` (contact links are in the `SOCIALS` list at the top).
- Fluid feel (curl, dissipation, bloom): the `DEFAULTS` block in `src/lib/fluid.js`.
- Ink colors: `PALETTE` in `src/components/FluidBackground.jsx`.
