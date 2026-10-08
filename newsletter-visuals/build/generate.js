// Generates the newsletter visual set as standalone SVGs.
// Geometry is computed (not hand-drawn) so every percentage is drawn to scale.
// Usage: node generate.js  -> writes ../svg/*.svg
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'svg');
fs.mkdirSync(OUT, { recursive: true });

// ---- Design tokens (single source for every graphic) ----
const C = {
  paper: '#EEF0F3',
  ink: '#0E1525',
  ink2: '#566075',
  rule: '#C3C9D4',
  tint: '#DDE1E8',
  accent: '#2D46F5',
  accentMid: '#7C8CF8',
  accentSoft: '#D3D9FD',
  gold: '#B57610',      // money, text
  goldFill: '#E9A93A',  // money, marks
};

const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');";
const STYLE = `<style>${FONTS}
.disp{font-family:'Bricolage Grotesque','Helvetica Neue',Arial,sans-serif;font-weight:700;letter-spacing:-0.01em}
.num{font-family:'Bricolage Grotesque','Helvetica Neue',Arial,sans-serif;font-weight:800;letter-spacing:-0.03em;font-variant-numeric:tabular-nums}
.sans{font-family:'IBM Plex Sans','Helvetica Neue',Arial,sans-serif;font-weight:500}
.mono{font-family:'IBM Plex Mono',Menlo,Consolas,monospace;font-weight:500;letter-spacing:0.12em;text-transform:uppercase}
</style>`;

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const f = n => Math.round(n * 10) / 10;

function svg(id, w, h, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" id="${id}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
${STYLE}
<defs>
  <pattern id="${id}-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="9" height="9" fill="${C.tint}"/>
    <line x1="0" y1="0" x2="0" y2="9" stroke="${C.rule}" stroke-width="2"/>
  </pattern>
  <marker id="${id}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="${C.ink}"/>
  </marker>
  <marker id="${id}-arrow-acc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="${C.accent}"/>
  </marker>
  <marker id="${id}-arrow-mute" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="${C.ink2}"/>
  </marker>
</defs>
<rect width="${w}" height="${h}" fill="${C.paper}"/>
${body}
</svg>
`;
}

const text = (x, y, s, cls, fill, size, extra = '') =>
  `<text x="${f(x)}" y="${f(y)}" class="${cls}" fill="${fill}" font-size="${size}" ${extra}>${esc(s)}</text>`;

// Area-true pyramid: a band's area share equals its percentage.
// Cut at cumulative share p sits at depth H*sqrt(p) because triangle area grows with depth^2.
function pyramid({ cx, top, H, half, shares }) {
  const cum = [0];
  shares.forEach(s => cum.push(cum[cum.length - 1] + s));
  const ys = cum.map(p => top + H * Math.sqrt(p / 100));
  const hw = y => half * (y - top) / H;
  const bands = shares.map((s, i) => {
    const y0 = ys[i], y1 = ys[i + 1];
    const pts = i === 0
      ? [[cx, y0], [cx + hw(y1), y1], [cx - hw(y1), y1]]
      : [[cx - hw(y0), y0], [cx + hw(y0), y0], [cx + hw(y1), y1], [cx - hw(y1), y1]];
    // visual centre: area-weighted mid-depth
    const mid = Math.sqrt((ys[i] - top) ** 2 / 2 + (ys[i + 1] - top) ** 2 / 2) + top;
    return { y0, y1, mid, pts, hw };
  });
  return { ys, bands, hw };
}
const poly = (pts, fill, extra = '') =>
  `<polygon points="${pts.map(p => p.map(f).join(',')).join(' ')}" fill="${fill}" stroke="${C.paper}" stroke-width="3" stroke-linejoin="round" ${extra}/>`;

const SHARES = [3, 17, 20, 60];
const LABELS = ['Buying Now', 'Info gathering Mode', 'Problem Aware', 'Not problem Aware'];

// ============ H1 · THE LARGE MARKET FORMULA ============
function h1(v97 = false) {
  const id = v97 ? 'h1v' : 'h1';
  const W = 1200, Hh = 1180;
  const P = pyramid({ cx: 520, top: 210, H: 760, half: 330, shares: SHARES });
  const fills = [C.ink, C.accent, C.accentMid, `url(#${id}-hatch)`];
  const numFill = [C.ink, C.accent, C.accentMid, C.ink2];
  let b = '';
  b += text(60, 78, 'Pyramid level · Share', 'mono', C.accent, 15);
  b += text(60, 134, 'THE LARGE MARKET FORMULA', 'disp', C.ink, 54);
  P.bands.forEach((band, i) => { b += poly(band.pts, fills[i]); });

  // right-hand label column, leader lines from each band
  P.bands.forEach((band, i) => {
    const y = i === 0 ? band.y0 + (band.y1 - band.y0) * 0.68 : (band.y0 + band.y1) / 2;
    const xEdge = 520 + band.hw(y) + 8;
    b += `<line x1="${f(xEdge)}" y1="${f(y)}" x2="872" y2="${f(y)}" stroke="${C.ink2}" stroke-width="1.2" stroke-dasharray="2 5"/>`;
    b += `<circle cx="${f(xEdge)}" cy="${f(y)}" r="3" fill="${C.ink2}"/>`;
    b += text(884, y + 14, `${SHARES[i]}%`, 'num', numFill[i], 62);
    b += text(886, y + 44, LABELS[i], 'sans', C.ink, 21);
  });

  if (v97) {
    // 97% variant: bracket spans everything below the tip (17% + 20% + 60%)
    const ya = P.ys[1] + 4, yz = P.ys[4] - 2;
    b += `<path d="M172,${f(ya)} H160 V${f(yz)} H172" fill="none" stroke="${C.accent}" stroke-width="2.5"/>`;
    b += text(146, (ya + yz) / 2 + 6, '97%', 'num', C.accent, 48, 'text-anchor="end"');
    b += text(146, (ya + yz) / 2 + 32, '17+20+60', 'mono', C.ink2, 12, 'text-anchor="end"');
  } else {
    // 37% bracket (17% + 20%) on the left
    const y37a = P.ys[1] + 4, y37b = P.ys[3] - 4;
    b += `<path d="M262,${f(y37a)} H250 V${f(y37b)} H262" fill="none" stroke="${C.accent}" stroke-width="2.5"/>`;
    b += text(232, (y37a + y37b) / 2 + 6, '37%', 'num', C.accent, 48, 'text-anchor="end"');
    b += text(232, (y37a + y37b) / 2 + 34, '17% + 20%', 'mono', C.ink2, 13, 'text-anchor="end"');
  }

  // footer: the same market as a 100-unit strip, 3% vs 97%
  const x0 = 60, x1 = 1140, bw = x1 - x0, by = 1052, bh = 26;
  b += `<line x1="60" y1="1000" x2="1140" y2="1000" stroke="${C.rule}" stroke-width="1"/>`;
  b += text(60, 1032, 'at any given time 3% of people are in buying mode!', 'mono', C.ink2, 14);
  let acc = x0;
  SHARES.forEach((s, i) => {
    const w = bw * s / 100;
    b += `<rect x="${f(acc)}" y="${by}" width="${f(w)}" height="${bh}" fill="${fills[i]}" stroke="${C.paper}" stroke-width="2"/>`;
    acc += w;
  });
  const x3 = x0 + bw * 0.03;
  b += text(x0, by + bh + 58, '3%', 'num', C.ink, 34);
  b += `<path d="M${f(x3 + 4)},${by + bh + 10} V${by + bh + 18} H${x1} V${by + bh + 10}" fill="none" stroke="${C.accent}" stroke-width="2.5"/>`;
  b += text((x3 + x1) / 2, by + bh + 58, '97%', 'num', C.accent, 34, 'text-anchor="middle"');
  b += text(x1, by + bh + 58, 'Area to scale', 'mono', C.ink2, 11, 'text-anchor="end"');
  return svg(id, W, Hh, 'The Large Market Formula: 3% Buying Now, 17% Info gathering Mode, 20% Problem Aware, 60% Not problem Aware', b);
}

// ============ H2 · ATTRACT → EDUCATE → NURTURE → ACT ============
function h2() {
  const id = 'h2';
  const W = 1200, Hh = 430;
  const steps = ['ATTRACT', 'EDUCATE', 'NURTURE', 'ACT'];
  const nums = ['①', '②', '③', '④'];
  const xs = [170, 450, 730, 1010];
  const r = [12, 17, 22, 30];
  const fill = [C.paper, C.accentSoft, C.accentMid, C.accent];
  const ty = 270;
  let b = `<defs><linearGradient id="${id}-warm" gradientUnits="userSpaceOnUse" x1="60" x2="1130" y1="0" y2="0">
    <stop offset="0" stop-color="${C.rule}"/><stop offset="1" stop-color="${C.accent}"/></linearGradient></defs>`;
  b += text(60, 78, 'The Key to Install them is -', 'mono', C.accent, 15);
  b += `<line x1="60" y1="${ty}" x2="1130" y2="${ty}" stroke="url(#${id}-warm)" stroke-width="6" stroke-linecap="round"/>`;
  b += `<path d="M1124,${ty - 12} L1146,${ty} L1124,${ty + 12} z" fill="${C.accent}"/>`;
  steps.forEach((s, i) => {
    b += text(xs[i], 178, nums[i], 'sans', C.ink2, 20, 'text-anchor="middle"');
    b += text(xs[i], 228, s, 'disp', i === 3 ? C.accent : C.ink, 46, 'text-anchor="middle"');
    b += `<circle cx="${xs[i]}" cy="${ty}" r="${r[i]}" fill="${fill[i]}" stroke="${i === 0 ? C.ink2 : C.accent}" stroke-width="${i === 0 ? 2 : 0}"/>`;
  });
  b += text(60, 352, 'cold traffic', 'mono', C.ink2, 14);
  b += text(1146, 352, 'pre qualified', 'mono', C.accent, 14, 'text-anchor="end"');
  return svg(id, W, Hh, 'Attract, Educate, Nurture, Act: from cold traffic to pre qualified', b);
}

// ============ H3 · ADVERTISING → PROFIT SYSTEM ============
function h3() {
  const id = 'h3';
  const W = 1200, Hh = 600;
  const ly = 330;
  const st = ['ADVERTISING', 'TRAFFIC', 'LEADS', 'EDUCATION', 'NURTURE', 'CONVERSION', 'PROFIT'];
  const sub = ['', 'google · facebook', '', 'HVCO', 'on auto pilot', 'Customer', ''];
  const x0 = 262, x1 = 952;
  const xs = st.map((_, i) => x0 + i * (x1 - x0) / (st.length - 1));
  const mk = [
    { fill: C.goldFill, stroke: 'none' },
    { fill: C.paper, stroke: C.ink2 },
    { fill: C.accentSoft, stroke: 'none' },
    { fill: C.accentSoft, stroke: 'none' },
    { fill: C.accentMid, stroke: 'none' },
    { fill: C.accent, stroke: 'none' },
    { fill: C.goldFill, stroke: 'none' },
  ];
  let b = '';
  b += text(60, 78, 'Automated Lead generation and Client Conversion System', 'mono', C.accent, 15);
  b += text(60, 128, 'that turns Advertising into profit', 'disp', C.ink, 42);

  // input
  b += text(60, ly + 26, '$1', 'num', C.gold, 104);
  b += text(64, ly + 64, 'put 1$ in', 'mono', C.ink2, 13);

  // main line
  b += `<line x1="${x0 - 30}" y1="${ly}" x2="1000" y2="${ly}" stroke="${C.ink}" stroke-width="3" marker-end="url(#${id}-arrow)"/>`;

  // zone brackets
  const zones = [
    [0, 2, 'Lead generation'],
    [3, 4, 'Your System - not you'],
    [5, 6, 'Client Conversion'],
  ];
  zones.forEach(([a, z, label]) => {
    const xa = xs[a] - 26, xz = xs[z] + 26;
    b += `<path d="M${f(xa)},282 V272 H${f(xz)} V282" fill="none" stroke="${C.rule}" stroke-width="2"/>`;
    b += text((xa + xz) / 2, 256, label, 'mono', C.ink2, 12, 'text-anchor="middle"');
  });

  st.forEach((s, i) => {
    b += `<circle cx="${f(xs[i])}" cy="${ly}" r="11" fill="${mk[i].fill}" stroke="${mk[i].stroke}" stroke-width="2.5"/>`;
    b += text(xs[i], ly + 46, s, 'mono', C.ink, 12.5, 'text-anchor="middle"');
    if (sub[i]) b += text(xs[i], ly + 68, sub[i], 'sans', C.ink2, 13, 'text-anchor="middle"');
  });

  // return range on a log scale: no single figure is singled out
  const vals = [2, 5, 10, 50, 200];
  const sx = 1046, yLo = 440, yHi = 214;
  const yOf = v => yLo - (Math.log10(v) - Math.log10(2)) / 2 * (yLo - yHi);
  b += `<line x1="${sx}" y1="${yLo}" x2="${sx}" y2="${yHi}" stroke="${C.goldFill}" stroke-width="3"/>`;
  b += text(sx - 6, yHi - 24, 'back', 'mono', C.ink2, 12);
  vals.forEach(v => {
    const y = yOf(v);
    b += `<line x1="${sx - 8}" y1="${f(y)}" x2="${sx + 8}" y2="${f(y)}" stroke="${C.goldFill}" stroke-width="3"/>`;
    b += text(sx + 20, y + 9, `$${v}`, 'num', C.gold, 28);
    if (v === 200) b += text(sx - 16, y + 5, 'or even', 'mono', C.ink2, 11, 'text-anchor="end"');
  });

  // reinvestment loop
  b += `<path d="M${sx},470 V540 H100 V${ly + 92}" fill="none" stroke="${C.ink2}" stroke-width="1.6" stroke-dasharray="6 6" marker-end="url(#${id}-arrow-mute)"/>`;
  b += `<rect x="404" y="526" width="400" height="28" fill="${C.paper}"/>`;
  b += text(604, 545, 'invest as much as your cash flows allows', 'mono', C.ink2, 12.5, 'text-anchor="middle"');
  return svg(id, W, Hh, 'Advertising to profit system: $1 in through traffic, leads, education, nurture and conversion to profit; $2, $5, $10, $50 or even $200 back', b);
}

// ============ H4 · HALO STRATEGY ============
function arcPt(cx, cy, r, deg) {
  const a = deg * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function sector(cx, cy, R, r, a0, a1) {
  const [ax, ay] = arcPt(cx, cy, R, a0), [bx, by] = arcPt(cx, cy, R, a1);
  const [cx2, cy2] = arcPt(cx, cy, r, a1), [dx, dy] = arcPt(cx, cy, r, a0);
  const large = (a1 - a0) > 180 ? 1 : 0;
  return `M${f(ax)},${f(ay)} A${R},${R} 0 ${large} 1 ${f(bx)},${f(by)} L${f(cx2)},${f(cy2)} A${r},${r} 0 ${large} 0 ${f(dx)},${f(dy)} Z`;
}
function h4() {
  const id = 'h4';
  const W = 1200, Hh = 900;
  const cx = 600, cy = 540;
  let b = '';
  b += text(60, 78, 'The HALO STRATEGY', 'mono', C.accent, 15);
  b += text(60, 132, 'YOU MUST KNOW YOUR CUSTOMER INTIMATELY!', 'disp', C.ink, 44);

  // halo
  b += `<circle cx="${cx}" cy="${cy}" r="330" fill="none" stroke="${C.accentMid}" stroke-width="1.5" stroke-dasharray="2 7"/>`;

  const quad = [
    { c: -90, n: '①', t: 'primary desire' },
    { c: 0, n: '②', t: 'Fears' },
    { c: 90, n: '③', t: 'wishes' },
    { c: 180, n: '④', t: 'dreams' },
  ];
  quad.forEach(q => {
    b += `<path d="${sector(cx, cy, 300, 212, q.c - 43, q.c + 43)}" fill="${C.accentSoft}"/>`;
    const [lx, ly] = arcPt(cx, cy, 256, q.c);
    b += text(lx, ly - 8, q.n, 'sans', C.accent, 18, 'text-anchor="middle"');
    b += text(lx, ly + 20, q.t, 'sans', C.ink, 22, 'text-anchor="middle"');
  });

  // ⑤ the hidden layer, closest to the core
  b += `<circle cx="${cx}" cy="${cy}" r="160" fill="none" stroke="${C.accent}" stroke-width="84"/>`;
  b += `<path id="${id}-top" d="M${cx - 160},${cy} A160,160 0 0 1 ${cx + 160},${cy}" fill="none"/>`;
  b += `<path id="${id}-bot" d="M${cx - 160},${cy} A160,160 0 0 0 ${cx + 160},${cy}" fill="none"/>`;
  b += `<text class="sans" font-size="16.5" fill="${C.paper}" font-weight="600" dominant-baseline="middle"><textPath href="#${id}-top" startOffset="50%" text-anchor="middle">${esc("⑤  The stuff they're thinking but not telling anyone.")}</textPath></text>`;
  b += `<text class="mono" font-size="12" fill="${C.accentSoft}" dominant-baseline="middle"><textPath href="#${id}-bot" startOffset="50%" text-anchor="middle">${esc("Customer's deepest & most")}</textPath></text>`;

  // core
  b += `<circle cx="${cx}" cy="${cy}" r="112" fill="${C.ink}"/>`;
  b += text(cx, cy + 10, 'CUSTOMER', 'disp', C.paper, 30, 'text-anchor="middle" letter-spacing="2"');
  return svg(id, W, Hh, "Halo Strategy: the customer's primary desire, fears, wishes, dreams, and the stuff they're thinking but not telling anyone", b);
}

// ============ S1 · THE 3% COMPETITION PROBLEM ============
function s1() {
  const id = 's1';
  const W = 1200, Hh = 660;
  const cx = 600, top = 250;
  const P = pyramid({ cx, top, H: 360, half: 290, shares: [3, 97] });
  let b = '';
  b += text(60, 78, 'The problem is your Compitor are going hard after 3%.', 'mono', C.accent, 15);
  b += poly(P.bands[1].pts, `url(#${id}-hatch)`);
  b += poly(P.bands[0].pts, C.ink);
  // many businesses converging on the same tip
  const tip = [cx, top + (P.ys[1] - top) * 0.66];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const deg = 200 + i * (140 / (n - 1));
    const [px, py] = arcPt(cx, top + 30, 175, deg);
    const dx = tip[0] - px, dy = tip[1] - py, L = Math.hypot(dx, dy);
    const ex = tip[0] - dx / L * 62, ey = tip[1] - dy / L * 62;
    b += `<line x1="${f(px)}" y1="${f(py)}" x2="${f(ex)}" y2="${f(ey)}" stroke="${C.ink}" stroke-width="1.6" marker-end="url(#${id}-arrow)"/>`;
    b += `<rect x="${f(px - 9)}" y="${f(py - 9)}" width="18" height="18" fill="${C.ink}"/>`;
  }
  const yTipLab = P.ys[1] + 6;
  b += `<line x1="${f(cx + P.hw(yTipLab) + 8)}" y1="${f(yTipLab)}" x2="830" y2="${f(yTipLab)}" stroke="${C.ink2}" stroke-width="1.2" stroke-dasharray="2 5"/>`;
  b += text(842, yTipLab + 12, '3%', 'num', C.ink, 40);
  b += text(918, yTipLab + 8, 'Buying Now', 'sans', C.ink, 20);
  b += text(cx, 530, '97%', 'num', C.ink2, 88, 'text-anchor="middle"');
  b += text(cx, 572, 'being Ignored', 'mono', C.ink2, 14, 'text-anchor="middle"');
  return svg(id, W, Hh, 'Many competitors aimed at the same 3% Buying Now while 97% is being ignored', b);
}

// ============ S2 · THE 37% OPPORTUNITY ============
function s2(v97 = false) {
  const id = v97 ? 's2v' : 's2';
  const W = 1200, Hh = 470;
  const x0 = 60, x1 = 1140, bw = x1 - x0, by = 214, bh = 54;
  const fills = [C.ink, C.accent, C.accentMid, `url(#${id}-hatch)`];
  const xs = [x0];
  SHARES.forEach(s => xs.push(xs[xs.length - 1] + bw * s / 100));
  let b = '';
  SHARES.forEach((s, i) => {
    b += `<rect x="${f(xs[i])}" y="${by}" width="${f(xs[i + 1] - xs[i])}" height="${bh}" fill="${fills[i]}" stroke="${C.paper}" stroke-width="2.5"/>`;
  });
  const end = v97 ? 4 : 3;
  const mid = (xs[1] + xs[end]) / 2;
  const quote = v97
    ? 'The GOAL is move the 97% of potential Customers up the pyramid faster.'
    : "\u201CI'm kinda thirsty - What Should I drink?\u201D";
  b += text(mid, 78, quote, 'sans', C.ink2, 21, 'text-anchor="middle" font-style="italic"');
  b += text(mid, 160, v97 ? '97%' : '37%', 'num', C.accent, 76, 'text-anchor="middle"');
  b += `<path d="M${f(xs[1] + 3)},202 V188 H${f(xs[end] - 3)} V202" fill="none" stroke="${C.accent}" stroke-width="2.5"/>`;
  const lab = (i, y) => {
    b += text(xs[i] + 6, y, `${SHARES[i]}%`, 'num', [C.ink, C.accent, C.accentMid, C.ink2][i], 30);
    b += text(xs[i] + 6, y + 26, LABELS[i], 'sans', C.ink, 17);
  };
  lab(1, 314); lab(2, 314); lab(3, 314);
  // 3% sits too narrow for an inline label; drop it to a second row
  b += `<line x1="${f(xs[0] + 16)}" y1="${by + bh + 4}" x2="${f(xs[0] + 16)}" y2="372" stroke="${C.ink2}" stroke-width="1.2" stroke-dasharray="2 4"/>`;
  b += text(x0, 408, '3%', 'num', C.ink, 30);
  b += text(x0 + 56, 406, 'Buying Now', 'sans', C.ink, 17);
  return svg(id, W, Hh, v97
    ? 'The 97% not buying now: Info gathering Mode 17%, Problem Aware 20%, Not problem Aware 60%'
    : 'The real money is in 37%: Info gathering Mode 17% plus Problem Aware 20%', b);
}

// ============ S3 · SALES FUNNEL ============
function s3() {
  const id = 's3';
  const W = 1200, Hh = 380;
  const cy = 220, xa = 60, xb = 1140, h0 = 220, h1 = 70;
  const hAt = x => h0 + (h1 - h0) * (x - xa) / (xb - xa);
  const cuts = [xa, 470, 820, xb];
  const fills = [C.tint, C.accentMid, C.accent];
  const tc = [C.ink, C.paper, C.paper];
  const labels = ['Website Visitor', 'Prospect', 'Customer'];
  let b = text(60, 78, 'Sales funnel', 'mono', C.accent, 15);
  for (let i = 0; i < 3; i++) {
    const a = cuts[i] + (i ? 4 : 0), z = cuts[i + 1] - (i < 2 ? 4 : 0);
    const pts = [[a, cy - hAt(a) / 2], [z, cy - hAt(z) / 2], [z, cy + hAt(z) / 2], [a, cy + hAt(a) / 2]];
    b += `<polygon points="${pts.map(p => p.map(f).join(',')).join(' ')}" fill="${fills[i]}"/>`;
    b += text((a + z) / 2, cy + 9, labels[i], 'disp', tc[i], 28, 'text-anchor="middle"');
  }
  return svg(id, W, Hh, 'Sales funnel: Website Visitor, then Prospect, then Customer', b);
}

// ============ M1 · MICRO KEY (opening) ============
function m1() {
  const id = 'm1';
  const W = 600, Hh = 360;
  const P = pyramid({ cx: 220, top: 40, H: 280, half: 200, shares: SHARES });
  const fills = [C.ink, C.accent, C.accentMid, `url(#${id}-hatch)`];
  let b = '';
  P.bands.forEach((band, i) => { b += poly(band.pts, fills[i]); });
  const yt = P.ys[1] - 10;
  b += `<line x1="${f(220 + P.hw(yt) + 6)}" y1="${f(yt)}" x2="400" y2="${f(yt)}" stroke="${C.ink2}" stroke-width="1" stroke-dasharray="2 4"/>`;
  b += text(410, yt + 10, '3%', 'num', C.ink, 30);
  const ya = P.ys[1] + 4, yz = P.ys[4];
  b += `<path d="M478,${f(ya + 12)} H490 V${f(yz)} H478" fill="none" stroke="${C.accent}" stroke-width="2.5"/>`;
  b += text(502, (ya + yz) / 2 + 14, '97%', 'num', C.accent, 40);
  return svg(id, W, Hh, 'Key: 3% at the top of the pyramid, 97% below it', b);
}

const all = { 'h1-large-market-formula': h1, 'h2-attract-educate-nurture-act': h2, 'h3-advertising-to-profit-system': h3, 'h4-halo-strategy': h4, 's1-3pct-competition': s1, 's2-37pct-opportunity': s2, 's3-sales-funnel': s3, 'm1-pyramid-key': m1,
  'h1-large-market-formula-97': () => h1(true), 's2-97pct-not-buying-now': () => s2(true) };
for (const [name, fn] of Object.entries(all)) {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), fn());
}
console.log('wrote', Object.keys(all).length, 'svgs to', OUT);
