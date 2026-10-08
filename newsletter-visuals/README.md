# Newsletter visual system — "How To TAKE Customers from Just looking"

- `index.html` — strategy, content check, visual map, specs, and all graphics inline.
- `svg/` — vector masters (fonts: Bricolage Grotesque, IBM Plex Sans, IBM Plex Mono via Google Fonts).
- `png/` — 2× renders for email.
- `build/` — `generate.js` (computed, to-scale geometry) → `render.js` (PNG) → `build-page.js` (index.html).

Rebuild: `cd build && node generate.js && NODE_PATH=$(npm root -g) node render.js && node build-page.js`
