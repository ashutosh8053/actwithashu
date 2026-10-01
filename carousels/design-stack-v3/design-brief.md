# The Design Stack: art direction brief

Reference: @bitbybit "6 Claude Skills for Better Web Design" (8 slides). Sibling posts in the same feed were studied for account-level DNA ("Your app looks vibe coded", "5 ways to build an AI agent", "Free Claude Code credit").
Output: 9 slides, 1080×1350, rendered from `carousel.html`.

---

## 1. Competitor design DNA

**Identity.** Two systems share one accent. The *tool* posts (skills, links) use a cool off-white canvas, a heavy geometric grotesk and real product screenshots. The *story* posts (agents, credits) use warm paper, a soft serif and illustration. Both run on one saturated orange. The orange is the brand. The typeface changes with the content type.

**Typography.**
- **Typeface.** Headlines are a tight, heavy geometric grotesk (Satoshi or General Sans class) at about 9–11% of slide width, with tracking pulled to roughly −0.04em, so words read as solid shapes.
- **Body.** Body copy is the same family at regular weight, about 30% of headline size.
- **Hierarchy.** Size ratio is roughly 3.3:1 headline to body, and about 5:1 headline to eyebrow. Hierarchy comes from scale jumps, not from adding weights in between.
- **Labels.** Eyebrows and running heads are 18–20px caps tracked about 0.2em, in grey. They work as wayfinding, not content.
- **Leading.** Headlines are tight (≈0.9) and body is generous (≈1.3).
- **Alignment.** Everything is flush-left on one hard edge at about 8% margin. Only the CTA and cover break it.

**Colour split in titles.** In every skill title the first word is orange and the rest is ink ("**UX** Designer", "**App Store** Screenshots", "**Transitions**.dev"). Repeating one rule eight times makes the colour an index, not decoration.

**Layout and grid.**
- **Vertical bands.** Running head, then eyebrow, title, one-line description, a proof image (about 40% of the height), the command pill, and the progress bar.
- **Fixed positions.** Every inner slide uses the same band positions, so a swipe changes the content and nothing else. That's why it feels "designed".
- **Density.** About 12–20 words per slide. The screenshot does the explaining.

**Background.** Off-white with two blurred light blobs (periwinkle and peach) placed behind the proof image. They act as a soft lightbox that lifts the screenshot off the page, not as decoration. Small dot-matrix patches near the corners add a printed, technical texture.

**Colour.**
- **Palette.** Near-monochrome cool neutrals plus one high-chroma orange.
- **Bookends.** The cover and CTA are inverted to near-black with an orange glow, so the post opens and closes in a different light from its body.
- **Contrast.** Contrast is very high on titles and deliberately low on running heads.

**Shapes and cards.** Large-radius dark cards hold the screenshots with a long, soft drop shadow. The command lives in a black pill with an orange `$`. The cover uses iOS-style toggle cards wired to a central orange orb.

**Images.** Real outputs from each tool, not icons. The screenshot is the proof that the skill works.

**Human layer.** Caveat-style handwritten notes and arrows ("Design Smarter Faster", "most people start at #5") add a designer's voice on top of the clean system.

**Rhythm.** Dark cover → six identical light frames → dark CTA. Variety comes only from the screenshot, so the eye learns where everything is by slide 3 and swiping costs nothing.

**Hook.** The cover headline sits in the top 35%, and a diagram below shows the whole list at once. It promises completeness before the first swipe.

**CTA.** Keyword comment ("PRETTY"), a giant headline, an orange orb, and a small outlined pill repeating the keyword.

**Why it reads as premium.** It has one accent, one typeface, fixed positions and real proof images. Nothing is there just to fill space. The handwritten notes stop it feeling robotic.

## 2. Competitor carousel structure

| # | Role | Mechanic |
|---|------|----------|
| 1 | Hook + map | Headline + diagram showing all 6 skills |
| 2–7 | Proof ×6 | Name → one-line benefit → screenshot → install command |
| 8 | CTA | Keyword comment for "the full list" |

It has no problem slide and no pattern interrupt. Curiosity comes from the list itself, and the payoff is withheld until the comment. Its weakness is that six identical frames make slides 5–7 feel skippable, and the CTA withholds something the slides already gave away.

## 3. Design rules (extracted)
1. One accent colour, used for exactly three jobs: the indexed word in titles, numbers, and the command prompt.
2. One typeface family for everything, with handwriting as the only exception.
3. Fixed vertical bands, and the command pill sits at the same y on every inner slide.
4. Every inner slide gets one proof visual showing output, not an icon.
5. Dark bookends and a light body.
6. Light blobs only sit behind the proof visual, never as backgrounds of their own.
7. At most one handwritten note per slide, and only where it adds information.
8. Running head and page count on every slide, so you always know where you are.

## 4. Creative direction (how mine differs)
- **Story spine.** Theirs is a list. Mine is an *install order* (Direction → Structure → Build → Motion → Polish → Launch). Every eyebrow carries the step name, so the series has a beginning and an end.
- **Hook with tension.** "Claude designs like a ~~junior~~." The strike-through is a visual argument, not decoration.
- **Proof I build myself.** No borrowed screenshots. Each visual is drawn in code and shows the *change* the skill makes: before/after, review notes, an easing curve with frames, an audit panel.
- **A pattern interrupt they don't have.** Slide 8 floods the canvas orange and turns the list into an editorial index ("Order matters."), which adds new information.
- **An honest CTA.** It offers new value (the prompt to run after each install) instead of withholding commands the slides already show.
- **Brand mark.** The pixel bot from your earlier posts replaces their orange asterisk, which is Anthropic's mark and shouldn't be reused.
- **Type.** Geist 800/450 plus Geist Mono, and Caveat for notes.

## 5. Final carousel: slide specs

Constants for every slide: 88px side margins. Running head at y=80 (19px caps, 0.22em tracking, grey) with the page count `NN/09` in mono on the right. A dot patch beside the page count. A progress bar of nine segments at y≈1273 with the handle on the right. Inner slides use a fixed band: eyebrow y=196, title y=238 (118px), body y=384 (33px, 800px wide), proof y=520–1080, command pill y=1100.

**SLIDE 1: Cover** (dark)
- **Purpose:** Stop the scroll with a provocation, then show the whole list.
- **Copy:**
  - Eyebrow: "THE DESIGN STACK"
  - Headline: "Claude designs like a ~~junior~~."
  - Subline: "6 skills fix that. In the order you install them."
  - Note: "flip all six on ↓"
  - Chips: 01–06 skill names
- **Hierarchy:** Headline (128px) > orb > chips (24px) > subline (38px, but grey with only the second sentence in white) > eyebrow.
- **Layout:** Headline top-left in two lines. Orb at the centre (540, 930). Six chips staggered three left and three right, with dashed curves to the orb.
- **Colour:** Near-black (#0B0C10). Orange glow under the orb and a faint blue glow top-left for depth. "junior" at 34% white with an orange strike.
- **Composition:** Heavy type above and a radial diagram below. The staggered chips keep it from looking like a symmetric template.
- **Interrupt:** It's the opener, so it sets the dark bookend.
- **Instruction:** Dark editorial cover with a struck-through word, and a radial switchboard of six toggles wired to a glowing orange orb holding a pixel mascot.

**SLIDE 2: 01 Direction · Design Taste**
- **Purpose:** Show the biggest visible change first.
- **Copy:**
  - Title: "Design Taste"
  - Body: "Kills the purple-gradient default. Claude commits to one direction before it writes a line of CSS."
  - Notes: "default", "same prompt. ↗"
- **Hierarchy:** Title > "after" window > "before" window > body.
- **Layout:** The "before" window is small, desaturated, tilted −4° and sits behind on the left. The "after" window is large and in front on the right, with an editorial magazine site (giant "Slow places." in Geist, an image block on a strong left edge, an underlined CTA).
- **Colour:** The orange is reused inside the mockup's sun so the accent ties the proof back to the system.
- **Instruction:** Before/after browser pair with the generic one behind, tilted and drained of colour, and the directed one in front, crisp and asymmetric.

**SLIDE 3: 02 Structure · UX Designer**
- **Purpose:** Prove it's a review, not decoration.
- **Copy:**
  - Body: "Reviews your screens like a senior would: contrast, tap targets, error states, WCAG 2.2."
  - Notes: "Subtitle contrast 2.9:1 → 4.6:1" · "Error says how to fix" · "Tap target height 36px → 56px"
- **Layout:** A sign-up form card on the left with three orange numbered pins on its right edge. Review notes on the right, separated by hairlines and numbered to match.
- **Interrupt:** Annotation replaces illustration. The slide reads like a design-review document.
- **Instruction:** Form mockup with numbered pins linked to a hairline review list showing struck "before" values and the "after" values.

**SLIDE 4: 03 Build · Web Artifacts**
- **Purpose:** Make "single shareable file" concrete.
- **Copy:**
  - Body: "Real React, Tailwind and shadcn/ui, bundled into a single HTML file you can send to anyone."
  - Note: "one file. no deploy."
- **Layout:** A dark dashboard window with tab title `bundle.html`, cropped off the right edge for tension. KPI row, a bar chart with the final bar in orange, and the note in the chart's empty corner.
- **Interrupt:** The first dark proof after two light ones.
- **Instruction:** Dark dashboard bleeding off the right edge, with one orange data point as the only accent.

**SLIDE 5: 04 Motion · Transitions.dev**
- **Purpose:** Show motion in a still image.
- **Copy:**
  - Title: "Transitions.dev" with "Transitions" in orange
  - Body: "Production motion for modals, toasts and tabs. One timing scale, so nothing feels off."
  - Note: "ease-out, 240ms"
- **Layout:** An ease-out curve spanning the full width with four plotted points, and four film frames below at 0/80/160/240ms showing a modal scaling in. The last timestamp is orange.
- **Instruction:** Easing curve over a four-frame film strip, with the final frame and timestamp in orange.

**SLIDE 6: 05 Polish · Redesign**
- **Purpose:** Name the AI tells the audience recognises from their own work.
- **Copy:**
  - Title: "Redesign" with "Re" in orange
  - Body: "Point it at a site you already shipped. It finds the AI tells and fixes them without breaking anything."
  - Audit panel:
    1. ~~Gradient headline~~ → solid ink, set larger
    2. ~~Three equal cards~~ → one lead, two support
    3. ~~Everything centered~~ → left edge, real grid
- **Layout:** A generic SaaS page with three pins, overlapped by a dark audit panel bleeding off the right edge.
- **Instruction:** Generic landing page with three orange pins, and a dark audit card overlapping it and running off-canvas.

**SLIDE 7: 06 Launch · App Store Shots**
- **Purpose:** End the tool list on a launch moment.
- **Copy:**
  - Body: "Store screenshots that sell, not just show. Framed, captioned, exported at every required size."
  - Phone captions: "Every habit, one tap." / "See your streak grow." / "Built for bad days too."
- **Layout:** Three phones fanned at −7°, 0° and 7°, each on a different system colour (orange, ink, cream).
- **Instruction:** Three phone screenshots fanned like a hand of cards, each led by a big caption.

**SLIDE 8: The rule** (orange flood, the pattern interrupt)
- **Purpose:** Reward people who reach the end, give a reason to save, and reframe the list as a system.
- **Copy:**
  - Headline: "Order matters."
  - Note: "direction before decoration."
  - Index: six rows with number, name and role ("sets the direction", "makes it usable", "builds it for real", "makes it move", "cleans what's live", "sells the launch")
- **Hierarchy:** Headline (132px) > skill names (54px) > roles (26px) > numbers (mono 24px).
- **Colour:** The whole canvas turns orange and the ink inverts. It's the only orange slide.
- **Instruction:** Full orange canvas with a giant two-line headline and an editorial index of six ruled rows. No cards.

**SLIDE 9: CTA** (dark)
- **Copy:**
  - Eyebrow: "YOUR MOVE"
  - Headline: "Comment “TASTE”"
  - Body: "I'll DM you the exact prompt I run after each install."
  - Outlined pill: "SAVE FOR YOUR NEXT BUILD"
- **Layout:** Type stacked top-left. A huge orange orb with the mascot is cropped off the bottom-right corner.
- **Instruction:** Dark close with a giant keyword in orange and the mascot orb cropped into the corner.

## 6. Final design QA: the five biggest weaknesses, and the fixes

1. **The cover had no face.** The competitor's cover sells with the creator's face; mine relies on a diagram, which stops the scroll less well. *Fix applied:* a struck-through word gives the headline tension, and the orb carries a character. *Recommended:* drop in a cut-out photo of you behind the orb. That's the strongest remaining upgrade, and I need your photo to do it.
2. **Six identical frames get tiring.** *Fix:* each proof uses a different visual type (before/after, annotated review, dark dashboard, chart + filmstrip, overlapping audit, fanned phones), and two of them bleed off the edge. Slide 8 inverts the canvas.
3. **Notes collided with copy** ("one file. no deploy." over the 3.1% figure; "all sizes, one click" over a phone). *Fix:* moved the first into empty chart space and cut the second, since it repeated the body copy.
4. **Long commands broke mid-word** ("web-/artifacts-builder"). *Fix:* the `--skill …` flag now wraps as one unit onto its own line.
5. **The CTA withheld what the slides already gave** (the commands). *Fix:* the CTA now offers new value (the follow-up prompts in `caption.md`), so commenting is worth it.

Still open, said plainly:
- The cover chips are small at phone size (24px on 1080).
- The orange slide's roles column is low-contrast at 72% ink.
- Neither stops the post from reading. Both are worth a second pass if you want to push it further.
