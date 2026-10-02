import { useRef } from 'react';
import FluidBackground from './FluidBackground.jsx';

const WHATSAPP_HREF = `https://wa.me/919817405878?text=${encodeURIComponent(
  "Hi Ashutosh! I'd like a premium website for $5.",
)}`;
const CALL_HREF = 'https://topmate.io/ashutosh_jain/1527603';

const SOCIALS = [
  {
    label: 'WhatsApp',
    href: WHATSAPP_HREF,
    icon: 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3Z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/theashutoshjain/',
    icon: 'M12 7.3A4.7 4.7 0 1 0 16.7 12 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm6-7.9a1.1 1.1 0 1 1-1.1-1.1A1.1 1.1 0 0 1 18 7.1ZM21.1 8a5.4 5.4 0 0 0-1.5-3.8A5.4 5.4 0 0 0 15.8 2.7C14.3 2.6 9.7 2.6 8.2 2.7a5.4 5.4 0 0 0-3.8 1.5A5.4 5.4 0 0 0 2.9 8c-.1 1.5-.1 6.1 0 7.6a5.4 5.4 0 0 0 1.5 3.8 5.4 5.4 0 0 0 3.8 1.5c1.5.1 6.1.1 7.6 0a5.4 5.4 0 0 0 3.8-1.5 5.4 5.4 0 0 0 1.5-3.8c.1-1.5.1-6.1 0-7.6Zm-2 9.2a3.1 3.1 0 0 1-1.7 1.7c-1.2.5-4 .4-5.4.4s-4.2.1-5.4-.4a3.1 3.1 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.4s-.1-4.2.4-5.4a3.1 3.1 0 0 1 1.7-1.7c1.2-.5 4-.4 5.4-.4s4.2-.1 5.4.4a3.1 3.1 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.4s.1 4.2-.4 5.4Z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ashutosh-jain-7b2816171',
    icon: 'M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2ZM8 19H5V9.5h3ZM6.5 8.2a1.7 1.7 0 1 1 1.7-1.7 1.7 1.7 0 0 1-1.7 1.7ZM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5S12.8 13 12.8 14.3V19h-3V9.5h2.8v1.3a3.1 3.1 0 0 1 2.8-1.5c3 0 3.6 2 3.6 4.6Z',
  },
  {
    label: 'Book a call',
    href: CALL_HREF,
    icon: 'M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V10h14Zm0-12H5V6h14ZM7 12h5v5H7Z',
  },
];

const external = { target: '_blank', rel: 'noopener noreferrer' };

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
      <header className="relative z-10 flex min-h-[77px] w-full items-center justify-center px-4 py-5 sm:px-8 lg:px-12">
        <nav className="hidden items-center gap-8 text-[12px] font-medium uppercase tracking-[0.14em] text-white/60 lg:flex">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} {...external} className="transition-colors duration-300 hover:text-white">
              {s.label}
            </a>
          ))}
        </nav>
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
                $5
              </span>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-[15px] leading-[1.7] text-white/70 sm:text-[17px]">
            Your brand. Your story. Your website. A cinematic, high-converting site like this one, designed and built
            for you for just five dollars.
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-8">
            <a
              href={WHATSAPP_HREF}
              {...external}
              className="btn w-full bg-gradient-to-b from-amber-200 to-amber-400 px-9 font-semibold text-ink shadow-[0_0_30px_-4px_rgba(251,191,36,0.6)] hover:shadow-[0_0_44px_-2px_rgba(251,191,36,0.85)] sm:w-auto"
            >
              Get my $5 website
            </a>
            <a
              href={CALL_HREF}
              {...external}
              className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-white/70 transition hover:text-white"
            >
              Book a free call
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  {...external}
                  aria-label={s.label}
                  title={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/60 hover:text-emerald-200 hover:shadow-[0_0_24px_-6px_rgba(52,211,153,0.7)]"
                >
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
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
