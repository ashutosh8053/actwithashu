# actwithashu — link-in-bio landing page

A cinematic one-page link hub: a WebGL aurora background that reacts to the cursor, tilted website-preview screens, and the **Premium Website Built for $5** offer.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

## Edit your content

Everything editable lives in **`src/config/site.js`**: name, handle, bio, the offer, links, social URLs and the showcase playlists. Lines marked `TODO` are placeholders.

### Assets still needed

| Asset | Where it goes | Used for |
|---|---|---|
| Profile photo (square, ≥ 300px) | `public/media/avatar.jpg`, then set `profile.avatar = 'media/avatar.jpg'` | Avatar in the gradient ring (a monogram is shown until then) |
| 4–7 screen recordings of your sites (16:10, 1280×800, H.264, muted, 2–4 s, ~1–2 MB each) + a poster JPG each | `public/media/`, then listed in `showcase.back` / `showcase.front` as `{ type: 'video', src, poster, duration }` | The two tilted preview screens (built-in animated placeholders are shown until then) |
| Real social, booking and portfolio URLs | `src/config/site.js` | Socials dock, CTA, link rows |

## Structure

```
src/
  config/site.js              content + media playlists
  lib/motion.js               one shared rAF loop, spring-smoothed pointer, device capability flags
  lib/useMagnetic.js          magnetic hover + cursor-tracking border light
  components/
    AuroraBackground.jsx      WebGL aurora shader (cursor bloom, parallax, grain) + CSS fallback
    Hero.jsx                  layout: one column on mobile, split on desktop
    ProfileContent.jsx        avatar, name, handle, bio
    SocialLinks.jsx           glass socials dock
    OfferCTA.jsx              $5 offer panel + pastel gradient pill CTA
    LinkList.jsx              secondary links
    ShowcaseStack.jsx         the two tilted screens, 3D cursor tilt / scroll parallax
    VideoCard.jsx             playlist player: hard cuts, lazy loading, plays only on screen
    MockSite.jsx              placeholder site previews
```

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `master`/`main`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
