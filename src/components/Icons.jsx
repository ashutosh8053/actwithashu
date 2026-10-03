// Minimal 24px line/solid icons, drawn to sit at one optical weight together.
const base = { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': true }

export const icons = {
  instagram: (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg {...base} fill="currentColor">
      <path d="M6.9 8.6H3.6V20h3.3V8.6ZM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.4 13.5c0-3.1-1.7-5.1-4.3-5.1-1.5 0-2.5.8-3 1.6V8.6H9.9V20h3.3v-6c0-1.6.8-2.6 2-2.6s1.9.9 1.9 2.6v6h3.3v-6.5Z" />
    </svg>
  ),
  topmate: (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="16" rx="3.5" />
      <path d="M3 9.5h18M8 2.8v3.4M16 2.8v3.4M9 14.5l2 2 4-4" />
    </svg>
  ),
  arrow: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12h15M13 5.5 19.5 12 13 18.5" />
    </svg>
  ),
  arrowUpRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  ),
}
