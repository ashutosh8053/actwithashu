# "Claude is coding blind": competitor DNA rulebook and slide specs

Reference: @bitbybit's **cream "tool roundup" system**, as in "Your app looks vibe coded" (6 slides), "Want all 4 links?", "Best Claude Code skills for animation" and "Free Claude Code credit". This is the account's most-repeated look, and it differs from the grotesk "6 Claude Skills" system used for The Design Stack.

## 1. Competitor design DNA

**Typography**
- **Headline face:** a heavy, soft, ball-terminal serif (Recoleta / Cooper class) at about 10–11% of canvas width, tracking about −0.02em, leading about 0.95, centred.
- **Accent words:** the punchline word is set in the *same serif, italic, in orange*, and is often larger than the rest of the line ("**vibe coded.**").
- **Domain names:** split at the dot, e.g. "godly" in ink and "**.design**" in orange italic.
- **Body:** a neutral grotesk (Inter / SF class), medium weight, about 30% of headline size, centred, always two lines, grey-ink.
- **Eyebrow pill:** orange, white caps tracked about 0.15em, about 22px, in the format `01 / 04 · CATEGORY`. Centred on tool slides, top-left on the cover and CTA.
- **Hierarchy:** headline → screenshot → subline. Nothing else competes.

**Layout**
- **Margins:** about 60px outer margins.
- **Bands:** pill at y≈90, title at y≈170, subline at y≈320, then the proof card from y≈490 to the bottom margin.
- **Symmetry:** tool slides are centred. The cover and CTA break that with a top-left pill and a bottom-left orange action pill.
- **Proof scale:** the screenshot card is 88% wide and takes about half the slide height.

**Colour**
- **Base:** warm paper (#F2E9DE) or cool mist (#E7E6EC).
- **Per-tool backgrounds:** each tool slide takes the tool's own mood: dark forest green for transitions.dev, near-black for deck.gallery, beige for animos. That's the rhythm.
- **Orange:** #E4683C is the only accent. It appears on the pill, the italic word and the CTA, about 5% of pixel area.
- **Green:** a "FREE" sticker in #1F9D58 is the only other hue.

**Graphic language**
- **Browser cards:** real product screenshots in macOS browser frames (coloured traffic-light dots, centred URL pill), 30px radius, soft long shadow.
- **FREE sticker:** rotated about 9° and pinned to the card's top-right corner.
- **Feature grids:** 2×2 white cards with a bottom-left bold label (transitions.dev slide).
- **Mascot:** an 8-bit pixel mascot on the cover and CTA.
- **Motion marks:** short orange strokes beside the cover icon row.
- **App-icon tiles:** a row of 4 tiles under the cover subline.
- **Texture:** a subtle paper vignette.

**Content architecture.** Hook (a mild insult the viewer recognises) → one slide per tool (name, two-line benefit, proof) → CTA "Want all N links?" with a 2×2 thumbnail recap, numbered orange badges and a keyword pill.

**10 recognition markers**
1. Soft heavy serif with an orange italic punchline word.
2. A split-colour name on every tool title.
3. An orange caps pill with `01 / 04 ·`.
4. A centred two-line grotesk subline.
5. A macOS browser card with coloured dots and a URL pill.
6. A green rotated FREE sticker.
7. A different background per tool slide.
8. An 8-bit mascot on the bookends.
9. A cover row of four app-icon tiles flanked by orange motion marks.
10. A CTA with a 2×2 numbered thumbnail grid and an orange keyword pill.
11. "Swipe →" orange pill bottom-left.

## 2. Rulebook (followed)
- **Type:** Fraunces at SOFT 100, opsz 144, weight 800, which approximates Recoleta. One italic orange phrase per headline. Inter 500 at 33px for sublines, always two lines. JetBrains Mono only inside product UI.
- **Layout:** 64px margins. Fixed bands on tool slides (pill y84, title y172, subline y316, card y490–1130). Dots centred at the bottom.
- **Colour:** paper / mist / sand / forest / night backgrounds. Orange for accents only. Green only on FREE.
- **Spacing:** generous air above the card (about 60px), and nothing within 60px of the edges.
- **Composition:** centred symmetry on tool slides. Asymmetry only on the cover, problem slide and CTA, via the pill and action placement.
- **Graphics:** only browser cards, UI fragments, the FREE sticker, the mascot, icon tiles and motion marks. No blobs, glass or 3D.
- **Rhythm:** light → light → **dark** → light → warm → **dark** → light.

## 3. Topic and strategy
**"Claude is coding blind. 4 free MCPs that let it see what it builds."**
- **Why it's native:**
  - It sits between the competitor's two biggest themes: "your vibe-coded app looks bad" and "free tools/skills for Claude Code".
  - It keeps their roundup mechanic ("4 X that fix Y").
  - It ends in a "Want all 4…?" keyword CTA.
- **The new angle:** it moves from "make it pretty" to "make it *work*": Claude writes code it never sees run.
- **Accuracy:** all four tools are real and open source, checked on npm.
  - `@playwright/mcp`: Apache-2.0.
  - `chrome-devtools-mcp`: Apache-2.0.
  - `@upstash/context7-mcp`: MIT, free basic tier without a key.
  - `shadcn`: MIT; `shadcn mcp init --client claude`.
  - The capabilities shown come from each README. `browser_click` is a real Playwright MCP tool.

## 4. Creative direction (the 10–20% that's new)
- **A problem slide (2).** The competitor's 6-slide format jumps straight from hook to tools. A terminal saying "should work now" over a browser showing the error makes the hook pay off.
- **Proof I built, not borrowed.** I can't capture their sites, so each card shows the tool *in use* on your app: a click target with the `browser_click` result; a console with 500/TypeError/404 and an LCP warning; a prompt with "use context7" above the pulled docs; real shadcn components in the reference's 2×2 feature-card grid.
- **A mascot story.** Your pixel bot is *blindfolded* on the cover and *eyes open and waving* on the CTA, so the bookends carry the before and after.

## 5. Slides

| # | Background | Copy | Visual job |
|---|---|---|---|
| 1 | Paper | Pill "FOR CLAUDE CODE USERS" · "Claude is coding *blind.*" · "4 free MCPs that let it see what it builds." · Swipe → | Typography + mascot: a 178px orange italic "blind." over 4 glyph tiles with motion marks; a 22px-pixel blindfolded bot, bottom-centre |
| 2 | Mist | Pill "THE PROBLEM" · "It writes the code. It never *sees it run.*" · "So every fix ends with 'should work now.' Then you open the app. It doesn't." | Contradiction: a dark terminal ("Fixed the click handler. It should work now.") overlapping a browser card showing a red "onSubmit is not a function" toast |
| 3 | Forest | "01 / 04 · SEE THE APP" · "Playwright *MCP*" · "Claude opens your app in a real browser, clicks through it and checks what broke." | Browser card with a signup page, an orange click target on "Create account", and a dark call chip `playwright · browser_click → 200 OK ✓`; FREE |
| 4 | Mist | "02 / 04 · READ THE ERRORS" · "DevTools *MCP*" · "Console errors, failed requests, slow pages. Claude reads them instead of guessing." | Browser card with a DevTools console: 500, TypeError, 404 and an LCP warning; FREE |
| 5 | Sand | "03 / 04 · CURRENT DOCS" · "Context7 *MCP*" · "Pulls current, version-specific docs into the prompt. No more APIs that don't exist." | A prompt card with the "use context7" chip over a dark docs/code card marked "● current"; FREE |
| 6 | Night | "04 / 04 · REAL COMPONENTS" · "shadcn *MCP*" · "Claude browses real component registries and installs one, instead of inventing its own." | 2×2 white component cards (Dialog, Command menu, Data table, Calendar) with bottom-left labels; FREE |
| 7 | Mist | Pill "GET THE COMMANDS" · "Want all *4 MCPs?*" · "Every install command, plus the first prompt to try with each. Free in your DMs." · Comment "EYES" · "Save this for your next build" | 2×2 thumbnail recap with orange 01–04 badges and glyph+serif labels; orange keyword pill; mascot with open eyes, waving, bottom-right |

**Transitions.** The cover's four tiles become the four tool slides and then the four thumbnails, the same objects at three scales. The blindfold on slide 1 is answered by the open eyes on slide 7.

## 6. Final QA: the five weakest decisions in v1, and the fixes
1. **The CTA headline wrapped onto the subline** ("Want all 4 commands?"). Shortened to "Want all *4 MCPs?*", which fits one line like the reference.
2. **The cover mascot was too small and floated.** The reference covers anchor a big figure at the bottom. The mascot went from 20px to 22px pixels and sits on a shadow just above the dots. I added the reference's orange motion marks beside the icon row, then moved them clear of the tiles.
3. **The problem slide's terminal hid the browser heading** ("…ur account"), and the "broken button" didn't read as broken. The terminal now overlaps empty space, the button is normal, and the failure is carried by the red error toast.
4. **The DevTools panel was half empty.** I added a real 404 row, made the rows taller and shortened the card. It now reads as a full console.
5. **The "use context7" chip broke across two lines.** It now sits on its own line.

**Competitor test:**
- **Type:** same serif family feel and split-colour titles.
- **Layout:** same pill, title, subline, card bands and FREE sticker.
- **Rhythm:** same per-tool background changes and mascot bookends.
- **Generic AI patterns:** none (no blobs, glass, 3D or random icons).

**Where the skills pushed back:** Taste bans cream backgrounds and Fraunces as *defaults*. Both are kept because the reference brand uses them, which falls under Taste's own exception. Canvas Design's "invent a new art movement" step was skipped on purpose.

**Still imperfect:**
- **Font:** Fraunces SOFT is close to, but not exactly, Recoleta.
- **Proof cards:** they're built as UI fragments, not real screenshots. Real captures from your machine would be the last 10%.
