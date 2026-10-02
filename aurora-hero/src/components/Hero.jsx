import { useRef } from 'react';
import AuroraBackground from './AuroraBackground.jsx';

const NAV = ['Product', 'Platform', 'Customers', 'Pricing'];

export default function Hero() {
  const hostRef = useRef(null);

  return (
    <section
      ref={hostRef}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden"
      style={{ '--px': 0, '--py': 0 }}
    >
      <AuroraBackground hostRef={hostRef} />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-8 sm:py-7">
        <a href="#" className="flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.01em]">
          <span className="h-6 w-6 rounded-full bg-[conic-gradient(from_200deg,#8b5cf6,#22c8ee,#10b981,#e848a0,#8b5cf6)] shadow-[0_0_24px_rgba(139,92,246,0.6)]" />
          Lumina
        </a>
        <nav className="hidden items-center gap-9 text-sm font-medium text-white/70 md:flex">
          {NAV.map((item) => (
            <a key={item} href="#" className="transition-colors duration-300 hover:text-white">
              {item}
            </a>
          ))}
        </nav>
        <a href="#" className="btn border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[12px] backdrop-blur-md hover:bg-white/10">
          Sign in
        </a>
      </header>

      {/* Glass card */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-6 sm:px-8 [perspective:1400px]">
        <div
          className="group relative w-full max-w-3xl animate-fade-up"
          style={{
            transform:
              'rotateX(calc(var(--py) * -3deg)) rotateY(calc(var(--px) * 4deg)) translate3d(calc(var(--px) * 8px), calc(var(--py) * 8px), 0)',
            willChange: 'transform',
          }}
        >
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.12] bg-white/[0.045] px-6 py-10 text-center shadow-[0_30px_120px_-20px_rgba(10,8,40,0.8),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[14px] sm:rounded-[36px] sm:px-14 sm:py-16">
            {/* Sheen that tracks the cursor across the glass */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(600px circle at calc(50% + var(--px) * 50%) calc(50% + var(--py) * 50%), rgba(255,255,255,0.09), transparent 45%)',
              }}
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <a
              href="#"
              className="relative mx-auto mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-white/80 transition hover:bg-white/10"
            >
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
                New
              </span>
              Realtime rendering engine 2.0
              <span aria-hidden="true" className="text-white/50">→</span>
            </a>

            <h1 className="relative text-balance text-[34px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[52px] lg:text-[60px]">
              <span className="block">Interfaces that breathe.</span>
              <span className="block text-white/[0.62]">Shipped at the speed of thought.</span>
            </h1>

            <p className="relative mx-auto mt-6 max-w-xl text-[15px] leading-[1.7] text-white/65 sm:text-[17px]">
              Lumina gives product teams a cinematic, GPU-accelerated design layer — fluid motion, living color and
              pixel-perfect performance, without writing a single shader.
            </p>

            <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href="#"
                className="btn w-full bg-white text-ink shadow-[0_0_40px_-6px_rgba(200,180,255,0.7)] hover:shadow-[0_0_60px_-4px_rgba(200,180,255,0.9)] sm:w-auto"
              >
                Start building free
              </a>
              <a href="#" className="btn w-full border border-white/15 bg-white/[0.04] text-white hover:bg-white/10 sm:w-auto">
                Watch the film
              </a>
            </div>

            <div className="relative mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-medium text-white/45">
              <span>
                <span className="text-white/85">60 FPS</span> on any device
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
              <span>
                <span className="text-white/85">12k+</span> teams shipping
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
              <span>
                <span className="text-white/85">SOC 2</span> Type II
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none relative z-10 mb-8 flex justify-center">
        <div className="flex h-10 w-6 justify-center rounded-full border border-white/20 pt-2">
          <span className="h-2 w-[3px] animate-bounce rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
