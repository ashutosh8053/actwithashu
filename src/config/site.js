// Everything you will want to edit lives here.
// Items marked TODO are placeholders — swap in your real handles, URLs and media.

export const profile = {
  name: 'Ashutosh',
  surname: 'Jain',
  handle: '@actwithashu',
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
    // TODO: point at your booking form / WhatsApp / DM link
    href: 'https://instagram.com/actwithashu',
  },
}

// Secondary links — kept short on purpose.
export const links = [
  // TODO: replace with your real portfolio URL
  { label: 'Explore my work', hint: 'Portfolio', href: '#work' },
  // TODO: replace with your Calendly / Cal.com link
  { label: 'Book a 15-min call', hint: 'Free', href: 'mailto:aashutoshjain1999@gmail.com?subject=Website%20inquiry' },
]

// TODO: confirm each handle/URL.
export const socials = [
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/actwithashu' },
  { id: 'youtube', label: 'YouTube', href: 'https://youtube.com/@actwithashu' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/actwithashu' },
  { id: 'x', label: 'X', href: 'https://x.com/actwithashu' },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/' },
  { id: 'mail', label: 'Email', href: 'mailto:aashutoshjain1999@gmail.com' },
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
