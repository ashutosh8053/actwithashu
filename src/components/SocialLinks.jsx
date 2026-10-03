import { icons } from './Icons'
import { useMagnetic } from '../lib/useMagnetic'
import { socials } from '../config/site'

function Social({ s }) {
  const ref = useMagnetic(0.35, 6)
  return (
    <a
      ref={ref}
      href={s.href}
      target={s.href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      aria-label={s.label}
      className="social grid size-11 place-items-center rounded-full text-white/70 transition-colors duration-300 hover:text-white"
    >
      {icons[s.id]}
    </a>
  )
}

// A single glass capsule rather than a row of buttons — reads as one object.
export default function SocialLinks() {
  return (
    <nav aria-label="Social profiles" className="social-dock inline-flex items-center gap-0.5 rounded-full p-1">
      {socials.map((s) => <Social key={s.id} s={s} />)}
    </nav>
  )
}
