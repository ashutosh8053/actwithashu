import { useEffect, useRef, useState } from 'react';
import { createFluid } from '../lib/fluid.js';
import { createSpring, stepSpring } from '../lib/spring.js';
import { createGrainTexture } from '../lib/grain.js';

// Linear-RGB dye colors. Kept below 1 so overlapping ink glows instead of
// clipping; the display shader's filmic curve handles the rest.
const PALETTE = [
  [0.55, 0.22, 1.0], // violet
  [0.2, 0.95, 0.62], // mint / emerald
  [0.1, 0.65, 1.0], // cyan-blue
  [1.0, 0.18, 0.55], // magenta
  [0.95, 0.1, 0.12], // crimson
  [1.0, 0.78, 0.25], // gold
  [0.82, 0.8, 1.0], // pearl
];

const IDLE_AFTER_MS = 2200;

function lerpColor(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function detectProfile() {
  const mq = (q) => window.matchMedia?.(q).matches ?? false;
  return {
    mobile: mq('(pointer: coarse)') || window.innerWidth < 768,
    reducedMotion: mq('(prefers-reduced-motion: reduce)'),
  };
}

/**
 * Full-screen WebGL ink/fluid background. The cursor drives a spring-
 * smoothed emitter that injects force + color, so trails curve naturally
 * instead of snapping to the pointer. When idle, a ghost emitter keeps
 * the ink moving. Writes `--px` / `--py` (-1..1) on `hostRef` for parallax.
 */
export default function FluidBackground({ hostRef }) {
  const canvasRef = useRef(null);
  const lightRef = useRef(null);
  const [grain, setGrain] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => setGrain(createGrainTexture()), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef?.current ?? canvas.parentElement;
    const profile = detectProfile();
    const mobile = profile.mobile;

    let fluid;
    try {
      fluid = createFluid(
        canvas,
        mobile
          ? { simResolution: 96, dyeResolution: 512, pressureIterations: 14, bloomIterations: 6, curl: 28, bloomIntensity: 0.45 }
          : {},
      );
    } catch (err) {
      console.warn('Fluid simulation unavailable:', err);
    }
    if (!fluid) {
      setFailed(true);
      return undefined;
    }

    const dprCap = mobile ? 1 : 1.5;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const rect = canvas.getBoundingClientRect();
      fluid.resize(Math.max(1, Math.round(rect.width * dpr)), Math.max(1, Math.round(rect.height * dpr)));
    }
    resize();

    // Spring-smoothed emitter: the "magnetic" lag that makes trails flow.
    const emitter = {
      x: createSpring(0.5, { stiffness: 140, damping: 17 }),
      y: createSpring(0.5, { stiffness: 140, damping: 17 }),
    };
    const light = {
      x: createSpring(0.5, { stiffness: 30, damping: 11 }),
      y: createSpring(0.5, { stiffness: 30, damping: 11 }),
    };
    const pointer = { x: 0.5, y: 0.5, active: false, lastMove: -Infinity };
    let prevX = 0.5;
    let prevY = 0.5;
    let colorIndex = Math.floor(Math.random() * PALETTE.length);
    let colorT = 0;

    function currentColor(boost = 1) {
      const a = PALETTE[colorIndex % PALETTE.length];
      const b = PALETTE[(colorIndex + 1) % PALETTE.length];
      const c = lerpColor(a, b, colorT);
      const k = (mobile ? 0.3 : 0.38) * boost;
      return [c[0] * k, c[1] * k, c[2] * k];
    }
    function randomColor(k) {
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      return [c[0] * k, c[1] * k, c[2] * k];
    }

    function burst(x, y, count, strength) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const force = strength * (0.5 + Math.random());
        fluid.splat(
          x + (Math.random() - 0.5) * 0.1,
          y + (Math.random() - 0.5) * 0.1,
          Math.cos(angle) * force,
          Math.sin(angle) * force,
          randomColor(0.45 + Math.random() * 0.3),
          0.6 + Math.random() * 0.5,
        );
      }
    }

    function toUv(e) {
      const rect = canvas.getBoundingClientRect();
      return [(e.clientX - rect.left) / rect.width, 1 - (e.clientY - rect.top) / rect.height];
    }
    function onPointerMove(e) {
      const [x, y] = toUv(e);
      pointer.x = x;
      pointer.y = y;
      pointer.lastMove = performance.now();
      if (!pointer.active) {
        // Jump the emitter so the first trail starts under the finger/cursor.
        emitter.x.value = emitter.x.target = prevX = x;
        emitter.y.value = emitter.y.target = prevY = y;
        emitter.x.velocity = emitter.y.velocity = 0;
      }
      pointer.active = true;
    }
    function onPointerDown(e) {
      onPointerMove(e);
      const [x, y] = toUv(e);
      burst(x, y, mobile ? 3 : 5, 900);
    }
    function onPointerEnd(e) {
      if (e.pointerType === 'touch') pointer.active = false;
    }
    function onMouseOut(e) {
      if (!e.relatedTarget) pointer.active = false;
    }

    let raf = 0;
    let running = false;
    let last = performance.now();
    let t = Math.random() * 50;
    let nextAmbient = 0;

    function frame(now) {
      // Dye per splat scales with real frame time so ink density is the
      // same at 30, 60 or 120 Hz.
      const frameScale = Math.min((now - last) / 16.67, 4);
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      t += dt;

      // Slow, continuous color drift through the palette.
      colorT += dt * 0.6;
      if (colorT >= 1) {
        colorT -= 1;
        colorIndex++;
      }

      const idle = !pointer.active || now - pointer.lastMove > IDLE_AFTER_MS;
      const speed = profile.reducedMotion ? 0.35 : 1;
      if (idle) {
        // Ghost emitter wanders a Lissajous path so the ink never settles.
        emitter.x.target = 0.5 + 0.36 * Math.sin(t * 0.37 * speed) * Math.cos(t * 0.13 * speed);
        emitter.y.target = 0.5 + 0.3 * Math.sin(t * 0.29 * speed + 1.2);
      } else {
        emitter.x.target = pointer.x;
        emitter.y.target = pointer.y;
      }
      light.x.target = emitter.x.target;
      light.y.target = emitter.y.target;

      const ex = stepSpring(emitter.x, dt);
      const ey = stepSpring(emitter.y, dt);
      const lx = stepSpring(light.x, dt);
      const ly = stepSpring(light.y, dt);

      const dx = ex - prevX;
      const dy = ey - prevY;
      prevX = ex;
      prevY = ey;
      const moved = Math.hypot(dx, dy);
      if (moved > 0.0004) {
        const force = (idle ? 3200 : 6200) * (mobile ? 0.8 : 1);
        const aspect = fluid.aspect;
        // Slow drift adds a whisper of ink; fast flicks add a vivid streak.
        const vivid = Math.min(Math.max(moved / 0.006, 0.25), 1) * frameScale;
        fluid.splat(
          ex,
          ey,
          dx * force * (aspect < 1 ? aspect : 1),
          (dy * force) / (aspect > 1 ? aspect : 1),
          currentColor((idle ? 0.2 : 1) * vivid),
        );
      }

      // Occasional ambient puffs from the edges add depth and variety.
      if (!profile.reducedMotion && now > nextAmbient) {
        nextAmbient = now + (mobile ? 2600 : 1700) + Math.random() * 1800;
        const side = Math.random();
        const x = side < 0.5 ? (side < 0.25 ? 0.05 : 0.95) : Math.random();
        const y = side < 0.5 ? Math.random() : side < 0.75 ? 0.05 : 0.95;
        const angle = Math.atan2(0.5 - y, 0.5 - x) + (Math.random() - 0.5) * 1.4;
        const force = 500 + Math.random() * 500;
        fluid.splat(x, y, Math.cos(angle) * force, Math.sin(angle) * force, randomColor(0.25 + Math.random() * 0.2), 1.1);
      }

      fluid.step(dt * speed);
      fluid.render();

      host.style.setProperty('--px', ((ex - 0.5) * 2).toFixed(4));
      host.style.setProperty('--py', ((0.5 - ey) * 2).toFixed(4));
      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${(lx * 100 - 50).toFixed(3)}vw, ${((1 - ly) * 100 - 50).toFixed(3)}vh, 0)`;
        lightRef.current.style.opacity = idle ? '0.5' : '1';
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

    // Opening reveal: a few colored bursts so the first frame isn't empty.
    burst(0.22, 0.62, 3, 700);
    burst(0.78, 0.4, 3, 700);
    burst(0.5, 0.15, 2, 500);

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerEnd, { passive: true });
    window.addEventListener('pointercancel', onPointerEnd, { passive: true });
    document.addEventListener('mouseout', onMouseOut);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      document.removeEventListener('mouseout', onMouseOut);
      fluid.destroy();
    };
  }, [hostRef]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-ink">
      {failed && (
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_25%_35%,rgba(139,92,246,0.35),transparent_70%),radial-gradient(50%_45%_at_75%_65%,rgba(16,185,129,0.25),transparent_70%),radial-gradient(40%_40%_at_60%_20%,rgba(232,72,160,0.2),transparent_70%)]" />
      )}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ transform: 'translateZ(0)' }} />

      {/* Soft radial light trailing the cursor */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={lightRef}
          className="h-[90vmax] w-[90vmax] shrink-0 rounded-full mix-blend-soft-light transition-opacity duration-1000"
          style={{
            willChange: 'transform, opacity',
            background: 'radial-gradient(closest-side, rgba(255,255,255,0.1), rgba(255,255,255,0.025) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Readability: darken behind the headline, then a cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(45%_38%_at_50%_52%,rgba(5,4,10,0.4),transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(140%_100%_at_50%_45%,transparent_45%,rgba(5,4,10,0.75)_100%)]" />

      {grain && (
        <div
          className="absolute -inset-[20%] animate-grain opacity-40 mix-blend-overlay"
          style={{ willChange: 'transform', backgroundImage: `url(${grain})`, backgroundSize: '160px 160px' }}
        />
      )}
    </div>
  );
}
