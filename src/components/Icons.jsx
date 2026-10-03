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
  youtube: (
    <svg {...base} fill="currentColor">
      <path d="M22 12c0-2.4-.2-4-.5-4.9a2.5 2.5 0 0 0-1.8-1.7C18.2 5 12 5 12 5s-6.2 0-7.7.4a2.5 2.5 0 0 0-1.8 1.7C2.2 8 2 9.6 2 12s.2 4 .5 4.9a2.5 2.5 0 0 0 1.8 1.7C5.8 19 12 19 12 19s6.2 0 7.7-.4a2.5 2.5 0 0 0 1.8-1.7c.3-.9.5-2.5.5-4.9Zm-12 3V9l5.2 3L10 15Z" />
    </svg>
  ),
  linkedin: (
    <svg {...base} fill="currentColor">
      <path d="M6.9 8.6H3.6V20h3.3V8.6ZM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.4 13.5c0-3.1-1.7-5.1-4.3-5.1-1.5 0-2.5.8-3 1.6V8.6H9.9V20h3.3v-6c0-1.6.8-2.6 2-2.6s1.9.9 1.9 2.6v6h3.3v-6.5Z" />
    </svg>
  ),
  x: (
    <svg {...base} fill="currentColor">
      <path d="M17.6 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.1 21H2l7.3-8.3L1.6 3h6.4l4.4 5.9L17.6 3Zm-1.1 16.2h1.7L7.1 4.7H5.3l11.2 14.5Z" />
    </svg>
  ),
  whatsapp: (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
      <path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.3l-4.5 1.2Z" />
      <path d="M9 8.3c.2-.4.5-.4.8-.4h.4c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.4c0 .3 0 .6-.4.8-.6.4-1.5.6-2.4.3a8.6 8.6 0 0 1-5-5c-.3-.9-.1-1.8.3-2.4Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  mail: (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
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
