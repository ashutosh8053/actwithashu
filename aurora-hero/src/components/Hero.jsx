import { useRef } from 'react';
import FluidBackground from './FluidBackground.jsx';

const NAV = ['Work', 'Process', 'Pricing', 'FAQ', 'Contact'];

// Replace with your real booking / WhatsApp / Instagram DM link.
const CTA_HREF = '#contact';

// Foreground drifts slightly with the cursor for parallax depth.
const parallax = (depth) => ({
  transform: `translate3d(calc(var(--px) * ${depth}px), calc(var(--py) * ${depth}px), 0)`,
  willChange: 'transform',
});

export default function Hero() {
  const hostRef = useRef(null);

  return (
    <section
      ref={hostRef}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden"
      style={{ '--px': 0, '--py': 0 }}
    >
      <FluidBackground hostRef={hostRef} />

      {/* Nav */}
      <header className="relative z-10 flex w-full items-center justify-between px-4 py-5 sm:px-8 lg:px-12">
        <a href="#" className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-emerald-300/60 text-[13px] font-semibold text-emerald-200">
            A
          </span>
          <span className="text-[15px] font-semibold uppercase tracking-[0.18em] text-white/90">ActWithAshu</span>
        </a>
        <nav className="hidden items-center gap-8 text-[12px] font-medium uppercase tracking-[0.14em] text-white/60 lg:flex">
          {NAV.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="transition-colors duration-300 hover:text-white">
              {item}
            </a>
          ))}
        </nav>
        <a
          href={CTA_HREF}
          className="btn bg-gradient-to-b from-amber-200 to-amber-400 px-5 py-2.5 text-[11px] font-semibold text-ink shadow-[0_0_24px_-4px_rgba(251,191,36,0.6)] hover:shadow-[0_0_36px_-2px_rgba(251,191,36,0.85)]"
        >
          Claim $1 site
        </a>
      </header>

      {/* Hero copy */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-10 text-center sm:px-8">
        <div className="flex flex-col items-center animate-fade-up" style={parallax(-10)}>
          <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.32em] text-emerald-300/90 sm:text-[12px]">
            Premium web design studio
          </p>

          <h1 className="max-w-5xl text-balance text-[44px] font-semibold leading-[1.04] tracking-[-0.035em] text-white/95 [text-shadow:0_4px_40px_rgba(0,0,0,0.5)] sm:text-[72px] lg:text-[96px]">
            <span className="block">Your Premium Website,</span>
            <span className="block">
              Built for Just{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-300 bg-clip-text text-transparent [text-shadow:none] drop-shadow-[0_0_28px_rgba(110,231,183,0.45)]">
                $1
              </span>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-[15px] leading-[1.7] text-white/70 sm:text-[17px]">
            Your brand. Your story. Your website. A cinematic, high-converting site like this one, designed and built
            for you for just one dollar.
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-8">
            <a
              href={CTA_HREF}
              className="btn w-full border border-emerald-300/70 bg-emerald-400/10 px-9 text-emerald-100 shadow-[0_0_30px_-6px_rgba(52,211,153,0.6),inset_0_0_20px_rgba(52,211,153,0.12)] backdrop-blur-md hover:bg-emerald-400/20 hover:shadow-[0_0_44px_-4px_rgba(52,211,153,0.8),inset_0_0_20px_rgba(52,211,153,0.2)] sm:w-auto"
            >
              Get my $1 website
            </a>
            <a
              href="#work"
              className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-white/70 transition hover:text-white"
            >
              See the work
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
            <span>Mobile-ready</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/25" />
            <span>Lightning fast</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/25" />
            <span>Built to convert</span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none relative z-10 mb-7 flex flex-col items-center gap-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/45">Scroll</span>
        <span className="h-10 w-px overflow-hidden bg-white/15">
          <span className="block h-1/2 w-px animate-[scrollcue_2s_ease-in-out_infinite] bg-white/70" />
        </span>
      </div>
    </section>
  );
}
