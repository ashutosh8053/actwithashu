import { icons } from './Icons'
import { links } from '../config/site'

// Secondary links as hairline rows — editorial, not a stack of buttons.
export default function LinkList({ start = 7 }) {
  return (
    <ul className="w-full">
      {links.map((l, i) => (
        <li key={l.label} className="reveal" style={{ '--d': start + i }}>
          <a
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className="link-row group flex items-center justify-between gap-4 py-4 text-[15px] font-medium text-white/85 transition-colors duration-300 hover:text-white"
          >
            <span>{l.label}</span>
            <span className="flex items-center gap-3 text-xs font-medium text-white/40">
              {l.hint}
              <span className="grid size-8 place-items-center rounded-full border border-white/10 text-white/70 transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:rotate-45 group-hover:border-white/25 group-hover:text-white">
                {icons.arrowUpRight}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
