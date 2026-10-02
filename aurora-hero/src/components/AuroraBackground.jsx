import { useEffect, useMemo, useRef, useState } from 'react';
import { createSpring, stepSpring } from '../lib/spring.js';
import { createGrainTexture } from '../lib/grain.js';
import { BLOBS, LAYERS, PARALLAX_SHIFT, blobGradient } from '../lib/blobs.js';

const GPU = { willChange: 'transform, opacity', backfaceVisibility: 'hidden' };
const IDLE_AFTER_MS = 3500;

function detectProfile() {
  const mq = (q) => window.matchMedia?.(q).matches ?? false;
  const coarse = mq('(pointer: coarse)');
  return {
    mobile: coarse || window.innerWidth < 768,
    reducedMotion: mq('(prefers-reduced-motion: reduce)'),
  };
}

/**
 * Full-bleed aurora background. All per-frame work happens in a single
 * requestAnimationFrame loop that writes transforms/opacity straight to
 * DOM nodes — React never re-renders while it animates.
 *
 * `hostRef` (optional) receives `--px` / `--py` custom properties
 * (spring-smoothed cursor, -1..1) so foreground content can react too.
 */
export default function AuroraBackground({ hostRef }) {
  const rootRef = useRef(null);
  const layerRefs = useRef([]);
  const blobRefs = useRef([]);
  const lightRef = useRef(null);
  const bloomRef = useRef(null);
  const vibranceRef = useRef(null);

  const [profile] = useState(detectProfile);
  const [grain, setGrain] = useState('');
  const blobs = useMemo(
    () => BLOBS.filter((b) => !(profile.mobile && b.desktopOnly)),
    [profile.mobile],
  );

  useEffect(() => setGrain(createGrainTexture()), []);

  useEffect(() => {
    const root = rootRef.current;
    const host = hostRef?.current ?? root;
    if (!root) return undefined;

    let vw = 0;
    let vh = 0;
    let unit = 0;
    let minDim = 0;
    let mobile = profile.mobile;
    let intensity = 1;
    let bloomSize = 560;
    const timeScale = profile.reducedMotion ? 0.3 : 1;

    // Cursor follows the pointer with a soft, slightly underdamped spring —
    // this lag is what gives the interaction its "magnetic" feel.
    const cursor = {
      x: createSpring(0, { stiffness: 90, damping: 15 }),
      y: createSpring(0, { stiffness: 90, damping: 15 }),
    };
    // Ambient light trails further behind for a layered sense of depth.
    const light = {
      x: createSpring(0, { stiffness: 28, damping: 11 }),
      y: createSpring(0, { stiffness: 28, damping: 11 }),
    };
    const presence = createSpring(0, { stiffness: 30, damping: 11 });
    const energy = createSpring(0, { stiffness: 70, damping: 15 });
    let energyTarget = 0;

    const blobState = blobs.map(() => ({
      pullX: createSpring(0, { stiffness: 55, damping: 12 }),
      pullY: createSpring(0, { stiffness: 55, damping: 12 }),
      scale: createSpring(1, { stiffness: 80, damping: 13 }),
      glow: createSpring(0, { stiffness: 45, damping: 12 }),
      size: 0,
    }));

    const pointer = { x: 0, y: 0, t: 0, active: false, lastMove: -Infinity };

    function measure() {
      const rect = root.getBoundingClientRect();
      vw = rect.width;
      vh = rect.height;
      unit = Math.max(vw, vh);
      minDim = Math.min(vw, vh);
      mobile = profile.mobile || vw < 768;
      intensity = mobile ? 0.62 : 1;
      bloomSize = mobile ? 360 : 560;

      blobs.forEach((b, i) => {
        const size = b.size * unit * (mobile ? 1.2 : 1);
        blobState[i].size = size;
        const el = blobRefs.current[i];
        if (el) {
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
        }
      });
      for (const el of [bloomRef.current, vibranceRef.current]) {
        if (el) {
          el.style.width = `${bloomSize}px`;
          el.style.height = `${bloomSize}px`;
        }
      }
    }

    measure();
    // Start everything centered so the first frames don't sweep in from 0,0.
    for (const s of [cursor.x, light.x]) s.value = s.target = vw / 2;
    for (const s of [cursor.y, light.y]) s.value = s.target = vh / 2;

    function onPointerMove(e) {
      const rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      const dt = Math.max(now - pointer.t, 8) / 1000;
      if (pointer.active) {
        const speed = Math.hypot(x - pointer.x, y - pointer.y) / dt;
        energyTarget = Math.max(energyTarget, Math.min(1, speed / 1600));
      }
      pointer.x = x;
      pointer.y = y;
      pointer.t = now;
      pointer.lastMove = now;
      pointer.active = true;
    }
    function onPointerEnd(e) {
      if (e.pointerType === 'touch') pointer.active = false;
    }
    function onMouseOut(e) {
      if (!e.relatedTarget) pointer.active = false;
    }
    function onBlur() {
      pointer.active = false;
    }

    let raf = 0;
    let running = false;
    let last = 0;
    let t = Math.random() * 100;

    function frame(now) {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      t += dt * timeScale;

      // When the pointer is idle (or on touch devices), a "ghost" light
      // drifts along a slow Lissajous path so the scene never feels static.
      const idle = !pointer.active || now - pointer.lastMove > IDLE_AFTER_MS;
      if (idle) {
        cursor.x.target = vw * (0.5 + 0.3 * Math.sin(t * 0.21));
        cursor.y.target = vh * (0.5 + 0.22 * Math.sin(t * 0.29 + 1.3));
        presence.target = mobile ? 0.55 : 0.4;
      } else {
        cursor.x.target = pointer.x;
        cursor.y.target = pointer.y;
        presence.target = 1;
      }
      light.x.target = cursor.x.target;
      light.y.target = cursor.y.target;

      // Movement energy spikes on fast motion, then bleeds off smoothly.
      energyTarget *= Math.exp(-dt * 1.6);
      energy.target = energyTarget;

      const cx = stepSpring(cursor.x, dt);
      const cy = stepSpring(cursor.y, dt);
      const lx = stepSpring(light.x, dt);
      const ly = stepSpring(light.y, dt);
      const pres = Math.max(0, stepSpring(presence, dt));
      const en = Math.min(1, Math.max(0, stepSpring(energy, dt)));

      const nx = vw ? cx / vw - 0.5 : 0;
      const ny = vh ? cy / vh - 0.5 : 0;
      host.style.setProperty('--px', (nx * 2).toFixed(4));
      host.style.setProperty('--py', (ny * 2).toFixed(4));

      // Parallax: nearer layers drift further, opposite the cursor.
      const layerOffsets = LAYERS.map((layer, i) => {
        const ox = -nx * layer.depth * PARALLAX_SHIFT * intensity;
        const oy = -ny * layer.depth * PARALLAX_SHIFT * intensity;
        const el = layerRefs.current[i];
        if (el) el.style.transform = `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0)`;
        return [ox, oy];
      });

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const s = blobState[i];
        const el = blobRefs.current[i];
        if (!el) continue;

        // Organic float: two detuned sines per axis read as fluid drift.
        const a = b.amp * minDim;
        const ph = b.phase;
        const f = b.freq;
        const bx = b.x * vw + a * Math.sin(t * f + ph) + a * 0.45 * Math.sin(t * f * 1.73 + ph * 2.1);
        const by = b.y * vh + a * Math.cos(t * f * 0.87 + ph) + a * 0.4 * Math.sin(t * f * 1.41 + ph * 1.3);

        // Proximity uses the un-pulled position to avoid a feedback loop.
        const [ox, oy] = layerOffsets[b.layer];
        const dx = cx - (bx + ox);
        const dy = cy - (by + oy);
        const radius = s.size * 0.5 + 140;
        const prox = Math.exp(-(dx * dx + dy * dy) / (radius * radius)) * pres;

        s.pullX.target = dx * prox * 0.24 * intensity;
        s.pullY.target = dy * prox * 0.24 * intensity;
        s.scale.target = 1 + prox * (0.1 + 0.22 * en) * intensity;
        s.glow.target = prox * (0.16 + 0.24 * en) * intensity;

        const px = stepSpring(s.pullX, dt);
        const py = stepSpring(s.pullY, dt);
        const sc = stepSpring(s.scale, dt);
        const gl = stepSpring(s.glow, dt);

        // Cap opacity so overlapping blobs can't blow out to white.
        const opacity = Math.min(b.opacity * (mobile ? 0.85 : 1) + gl, 0.78);
        const half = s.size / 2;
        el.style.transform = `translate3d(${(bx + px - half).toFixed(2)}px, ${(by + py - half).toFixed(2)}px, 0) scale(${sc.toFixed(4)})`;
        el.style.opacity = opacity.toFixed(3);
      }

      const halfBloom = bloomSize / 2;
      const bloomScale = 0.8 + 0.35 * en;
      const bloomTransform = `translate3d(${(cx - halfBloom).toFixed(2)}px, ${(cy - halfBloom).toFixed(2)}px, 0) scale(${bloomScale.toFixed(4)})`;
      if (bloomRef.current) {
        bloomRef.current.style.transform = bloomTransform;
        bloomRef.current.style.opacity = (pres * (0.22 + 0.6 * en) * intensity).toFixed(3);
      }
      if (vibranceRef.current) {
        vibranceRef.current.style.transform = bloomTransform;
        vibranceRef.current.style.opacity = (pres * (0.45 + 0.55 * en)).toFixed(3);
      }
      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${(lx - 600).toFixed(2)}px, ${(ly - 600).toFixed(2)}px, 0)`;
        lightRef.current.style.opacity = (0.35 + 0.65 * pres).toFixed(3);
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    // Pause the loop when the hero is scrolled out of view.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(root);
    const ro = new ResizeObserver(measure);
    ro.observe(root);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerEnd, { passive: true });
    window.addEventListener('pointercancel', onPointerEnd, { passive: true });
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('blur', onBlur);

    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('blur', onBlur);
    };
  }, [blobs, hostRef, profile]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 isolate overflow-hidden bg-ink"
    >
      {/* Base wash so the darkest areas still carry a hint of color */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#0d0b24_0%,#04050d_60%)]" />

      {/* Parallax layers of aurora blobs, blended additively (screen) */}
      {LAYERS.map((_, li) => (
        <div
          key={li}
          ref={(el) => (layerRefs.current[li] = el)}
          className="absolute inset-0 mix-blend-screen"
          style={GPU}
        >
          {blobs.map((b, bi) =>
            b.layer === li ? (
              <div
                key={bi}
                ref={(el) => (blobRefs.current[bi] = el)}
                className="absolute left-0 top-0 rounded-full mix-blend-screen"
                style={{ ...GPU, background: blobGradient(b.color), opacity: b.opacity }}
              />
            ) : null,
          )}
        </div>
      ))}

      {/* Large, slow radial light that trails the cursor */}
      <div
        ref={lightRef}
        className="absolute left-0 top-0 h-[1200px] w-[1200px] rounded-full mix-blend-soft-light"
        style={{
          ...GPU,
          background:
            'radial-gradient(closest-side, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 45%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* Bloom: boosts saturation + brightness of whatever color is under the cursor */}
      {!profile.mobile && (
        <div
          ref={vibranceRef}
          className="absolute left-0 top-0 rounded-full"
          style={{
            ...GPU,
            opacity: 0,
            backdropFilter: 'saturate(1.55) brightness(1.18)',
            WebkitBackdropFilter: 'saturate(1.55) brightness(1.18)',
            maskImage: 'radial-gradient(closest-side, #000 0%, rgba(0,0,0,0.6) 45%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(closest-side, #000 0%, rgba(0,0,0,0.6) 45%, transparent 100%)',
          }}
        />
      )}
      <div
        ref={bloomRef}
        className="absolute left-0 top-0 rounded-full mix-blend-screen"
        style={{
          ...GPU,
          opacity: 0,
          background:
            'radial-gradient(closest-side, rgba(236,228,255,0.55) 0%, rgba(190,170,255,0.22) 30%, rgba(120,140,255,0.08) 60%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Cinematic vignette keeps edges dark and the palette restrained */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_45%,transparent_40%,rgba(4,5,13,0.55)_75%,rgba(4,5,13,0.9)_100%)]" />

      {/* Animated film grain */}
      {grain && (
        <div
          className="absolute -inset-[20%] animate-grain opacity-70 mix-blend-overlay"
          style={{ ...GPU, willChange: 'transform', backgroundImage: `url(${grain})`, backgroundSize: '160px 160px' }}
        />
      )}
    </div>
  );
}
