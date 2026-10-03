// Everything you will want to edit lives here.
// Items marked TODO are placeholders — swap in your real handles, URLs and media.

export const profile = {
  name: 'Ashutosh',
  surname: 'Jain',
  handle: '@theashutoshjain',
  // TODO: drop your photo at public/media/avatar.jpg and set this to 'media/avatar.jpg'
  avatar: null,
  // Colour split: `lead` renders full white, `rest` renders muted.
  bio: {
    lead: 'I design and build cinematic websites',
    rest: ' for founders, coaches and creators — motion-rich, fast, and made to convert.',
  },
}

export const offer = {
  eyebrow: 'Limited slots this month',
  title: 'Premium Website Built for $5',
  // Rendered inside the bordered offer box, mirroring the reference's promo panel.
  detail: {
    before: 'A custom one-page site with motion, mobile polish and launch help — ',
    strong: 'for just $5',
    after: '. Ready in days, not weeks.',
  },
  cta: {
    label: 'Claim the $5 website',
    href: 'https://topmate.io/ashutosh_jain/1527603',
  },
}

// Secondary links — kept short on purpose.
export const links = [
  // TODO: replace with your real portfolio URL
  { label: 'Explore my work', hint: 'Portfolio', href: '#work' },
  { label: 'Book a call', hint: 'Topmate', href: 'https://topmate.io/ashutosh_jain/1527603' },
]

export const socials = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/theashutoshjain' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/ashutosh-jain-7b2816171' },
  { id: 'topmate', label: 'Book a call on Topmate', href: 'https://topmate.io/ashutosh_jain/1527603' },
]

/*
 * Showcase playlists — the two tilted "website preview" cards from the reference.
 * Each card cycles through its items with hard cuts, like the reference.
 *
 * To use your own screen recordings (recommended), put them in public/media/ and use:
 *   { type: 'video', src: 'media/site-1.mp4', poster: 'media/site-1.jpg', duration: 3.2 }
 * Ideal export: 16:10, 1280×800, H.264, no audio, ~1–2 MB per clip.
 *
 * Until then, `mock` items render built-in animated placeholder site previews.
 */
export const showcase = {
  back: [
    { type: 'mock', variant: 'aurora', duration: 3.4 },
    { type: 'mock', variant: 'ember', duration: 3.0 },
    { type: 'mock', variant: 'mono', duration: 3.2 },
  ],
  front: [
    { type: 'mock', variant: 'violet', duration: 2.4 },
    { type: 'mock', variant: 'light', duration: 2.2 },
    { type: 'mock', variant: 'orb', duration: 2.6 },
    { type: 'mock', variant: 'gallery', duration: 2.3 },
  ],
}
