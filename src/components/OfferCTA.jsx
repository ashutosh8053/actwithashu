import { icons } from './Icons'
import { useLocalLight, useMagnetic } from '../lib/useMagnetic'
import { offer } from '../config/site'

/*
 * Reference pattern: a quiet bordered panel carrying the deal, then a full-width
 * pastel pill whose gradient slowly drifts. Here the panel carries the $5 offer.
 */
export default function OfferCTA() {
  const panel = useLocalLight()
  const pill = useMagnetic(0.12, 8)

  return (
    <div className="flex w-full flex-col gap-5">
      <div ref={panel} className="reveal offer-panel relative rounded-[22px] px-6 py-5 text-center lg:text-left" style={{ '--d': 5 }}>
        <p className="flex items-center justify-center gap-2 text-xs font-medium tracking-[0.04em] text-white/55 lg:justify-start">
          <span className="pulse-dot" /> {offer.eyebrow}
        </p>
        <h2 className="mt-2 text-[1.35rem] font-semibold leading-[1.2] tracking-[-0.015em] lg:text-[1.5rem]">
          <span className="text-white">Premium Website</span>{' '}
          <span className="whitespace-nowrap text-white/60">Built for <span className="price">$5</span></span>
        </h2>
        <p className="mt-2 text-[14px] leading-[1.6] text-white/60">
          {offer.detail.before}
          <strong className="font-medium text-white/90">{offer.detail.strong}</strong>
          {offer.detail.after}
        </p>
      </div>

      <a
        ref={pill}
        href={offer.cta.href}
        target="_blank"
        rel="noreferrer"
        className="reveal cta-pill group relative flex h-[60px] items-center justify-center gap-3 overflow-hidden rounded-full text-[13px] font-medium uppercase tracking-[0.09em] text-[#15141a]"
        style={{ '--d': 6 }}
      >
        <span className="cta-gradient" aria-hidden />
        <span className="cta-sheen" aria-hidden />
        <span className="relative">{offer.cta.label}</span>
        <span className="relative transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-1">{icons.arrow}</span>
      </a>
    </div>
  )
}
