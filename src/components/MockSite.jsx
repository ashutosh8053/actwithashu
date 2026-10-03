// Placeholder "website recordings" for the showcase cards, used until real
// screen recordings are dropped into src/config/site.js. Each variant is a
// miniature site with slow internal motion so it reads as footage, not a still.
// All sizing is in container units, so they scale with the card.

function Nav({ dark = true, brand }) {
  return (
    <div className={`ms-nav ${dark ? '' : 'ms-nav--light'}`}>
      <span className="ms-brand">{brand}</span>
      <span className="ms-links">
        <i /><i /><i /><i />
      </span>
      <span className="ms-pill">Contact</span>
    </div>
  )
}

function Streaks({ hue }) {
  return (
    <svg className="ms-streaks" viewBox="0 0 400 250" preserveAspectRatio="none" style={{ '--hue': hue }}>
      <defs>
        <filter id={`b${hue}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <g fill="none" stroke={`hsl(${hue} 90% 62%)`} filter={`url(#b${hue})`} strokeLinecap="round">
        <path d="M-20 200 C 80 120, 140 260, 240 150 S 380 40, 430 90" strokeWidth="6" opacity=".9" />
        <path d="M-20 60 C 60 120, 160 10, 260 90 S 360 220, 430 170" strokeWidth="4" opacity=".55" />
        <path d="M40 260 C 120 160, 220 220, 300 120 S 400 10, 420 -10" strokeWidth="3" opacity=".45" />
      </g>
      <g fill="none" stroke={`hsl(${hue} 100% 88%)`} strokeLinecap="round">
        <path d="M-20 200 C 80 120, 140 260, 240 150 S 380 40, 430 90" strokeWidth="1.1" opacity=".8" />
      </g>
    </svg>
  )
}

const variants = {
  aurora: () => (
    <div className="ms ms--dark" style={{ '--bg': '#050913' }}>
      <Streaks hue={215} />
      <div className="ms-chrome" />
      <Nav brand="LUMEN" />
      <div className="ms-hero ms-hero--bl">
        <h4>Liquid<br />Light</h4>
        <p><i /><i /><i /></p>
      </div>
    </div>
  ),
  ember: () => (
    <div className="ms ms--dark" style={{ '--bg': '#0d0704' }}>
      <Streaks hue={26} />
      <div className="ms-chrome ms-chrome--warm" />
      <Nav brand="FORGE" />
      <div className="ms-hero ms-hero--bl">
        <h4>Shaped<br />by Fire</h4>
        <p><i /><i /><i /></p>
      </div>
    </div>
  ),
  mono: () => (
    <div className="ms ms--dark" style={{ '--bg': '#0b0b0c' }}>
      <Streaks hue={240} />
      <div className="ms-chrome ms-chrome--mono" />
      <Nav brand="ATELIER" />
      <div className="ms-hero ms-hero--bl">
        <h4>Quiet<br />Form</h4>
        <p><i /><i /><i /></p>
      </div>
    </div>
  ),
  violet: () => (
    <div className="ms ms--violet">
      <Nav brand="NOVA" />
      <div className="ms-hero ms-hero--tl">
        <h4>Brands that<br /><em>move people</em></h4>
        <span className="ms-btn">Start a project</span>
      </div>
      <div className="ms-figure" />
    </div>
  ),
  light: () => (
    <div className="ms ms--light">
      <Nav dark={false} brand="Halcyon" />
      <div className="ms-marquee">
        <span>Websites that feel expensive · Websites that feel expensive · </span>
      </div>
      <div className="ms-phone"><span>Explore the work</span></div>
      <div className="ms-phone ms-phone--l" />
      <div className="ms-phone ms-phone--r" />
    </div>
  ),
  orb: () => (
    <div className="ms ms--dark" style={{ '--bg': '#040309' }}>
      <div className="ms-orb" />
      <Nav brand="BEYOND" />
      <div className="ms-hero ms-hero--tl">
        <h4>Beyond</h4>
      </div>
      <div className="ms-hero ms-hero--br">
        <h4>the grid</h4>
      </div>
    </div>
  ),
  gallery: () => (
    <div className="ms ms--dark" style={{ '--bg': '#06070d' }}>
      <Nav brand="ORBIT" />
      <div className="ms-grid">
        {Array.from({ length: 6 }, (_, i) => <span key={i} style={{ '--i': i }} />)}
      </div>
    </div>
  ),
}

export default function MockSite({ variant }) {
  const V = variants[variant] ?? variants.aurora
  return <V />
}
