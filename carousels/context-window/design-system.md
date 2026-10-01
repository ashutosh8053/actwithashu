# Inside the Window: design system and slide specs

Topic: why Claude "gets dumber" in long sessions.
Angle: the quality of Claude's output is set by **what's in its context window**, not by how the prompt is worded.
Format: 9 slides, 1080×1350 (4:5), rendered from `carousel.html`.

## Concept: "Inside the Window" (Precision Manual × Viewport)

**The metaphor is literal.** One electric-blue rectangle means only one thing in this carousel: *what Claude can currently see.* Text inside the blue is visible to Claude. Text outside it (fading on paper above it on slide 1, struck through above the frame on slide 2) is gone. The viewer learns the rule on slide 1 and reads it without help on every slide after that.

**Navigation is the argument.** The progress bar is a **context gauge**. It fills 12% → 96% as you swipe, so the carousel itself fills up like a long session. On the last slide `/clear` resets it to 0%. Swiping acts out the idea.

**Why it fits.** Context is invisible, and this makes it a physical object with edges, a fill level and an "outside". The precision-manual language (section marks, mono labels, registration ticks, spec tables) treats this as a skill you can measure, not a tip.

**How it differs from The Design Stack.**

| | The Design Stack | Inside the Window |
|---|---|---|
| Type | Grotesk headlines, one family | Condensed serif + mono + sans; each one has a job |
| Colour | Orange accent on neutral, dark bookends | Electric blue as meaning + lime as "your question" |
| Layout | Fixed bands, the same each slide | A different composition per slide; only the chrome is fixed |
| Proof | Mock product screenshots | Diagrams, data, spec sheets |
| Navigation | Progress bar | Context gauge that tells the story |
| Feel | Product launch | Field manual / technical paper |

**What the viewer should feel:** *"Oh, that's what's been happening."* It should be calm, precise and slightly uncomfortable around slides 2–4, with relief on the last slide.

## Typography
| Role | Face | Size / weight | Rules |
|---|---|---|---|
| Statements (headlines) | Instrument Serif | 76–178px, 400, leading 0.86–0.98, tracking −0.02 to −0.04em | Sentence case. The second clause is *italic* and coloured, as the turn of the sentence |
| Explanation (body) | Instrument Sans | 23–28px, 400–500, leading 1.3–1.45, ≤ 440px measure | Sentence case, flush left |
| Measurement (labels, data, commands) | IBM Plex Mono | 17–40px, 500–600, labels tracked 0.12–0.2em | Labels in CAPS, commands in their real case |
| Numbers | Instrument Serif for display % (64–140px); mono for indices (01, 09:02) | | |

- **Ratios.** Headline to body is about 3.5:1, and body to label about 1.5:1.
- **Weights.** The serif is only ever 400. Emphasis comes from italic plus colour, never bold.
- **Alignment.** Flush left everywhere. Right alignment is reserved for numbers attached to data.

## Colour
| Token | Hex | Meaning |
|---|---|---|
| Paper | `#F1EEE7` | Outside the window |
| Ink | `#121212` | Primary text, rules |
| Ink-2 | `#5E5B55` | Secondary text, labels |
| Rule | `#CFCAC0` | Hairlines |
| **Window** | `#2433FF` | What Claude can see. Never decoration |
| **Lime** | `#D6FF3D` | Your question / what matters. Used on four elements in the whole post |
| Text on blue | `#F1EEE7` (62% for secondary) | |

## Grid
- **Canvas.** 1080×1350. Outer margins 72px, giving a live width of 936px.
- **Columns.** 12 columns. Common splits are 5/7 (slide 2), 6/6 (slide 5) and 4/4/4 (slide 4).
- **Spacing scale.** 8 · 14 · 22 · 28 · 44 · 72 px.
- **Fixed chrome.**
  - Section label top-left (y=72).
  - Handle top-right.
  - Gauge bottom (64px from the bottom edge).
- **Composition.** Everything between the chrome changes per slide.
- **Measure.** Body copy never exceeds 440px.

## Components
- **Section mark.** `§0N  NAME` in mono, top-left. It reads like a manual's section index.
- **Window.** A blue field or 2px blue outline, with ink corner registration ticks on hero use.
- **Context gauge.** A 14px track with 8 tick divisions and a blue fill, labelled `CONTEXT · IN USE · NN% · 0N/09`.
- **Leader line.** A 2–3px ink rule tying data to its label.
- **Spec row.** Index | command in blue mono | what + when, separated by hairlines.
- **Prompt line.** `> command` in mono with a lime block cursor.
- **Margin definition.** A rule over a small caps term with a definition below it (slide 6).

## Slide specs

**01 · Hook. Typography dominates.**
- **Focal order:** 1) "Claude didn't get dumber." 2) "It ran out of room." in lime italic 3) the faded rules above the window.
- **Layout:**
  - **Above the window:** four mono lines at 24px (y 136–260, fading 16% → 46% opacity) and the note "Your rules. Out of view ↑" top-right.
  - **The window:** blue, x72–1008, y330–1160, with ink corner ticks.
  - **Inside the window:** serif 178px/0.86 at y480; italic 120px at y850; at the bottom, a prompt line "> why did you edit /payments?" with a lime cursor above a hairline.
- **Transition:** sets the rule *blue = visible*, and the gauge starts at 12%.

**02 · Tension. The metaphor dominates.**
- **Left (5 cols):** serif 76px "Hour one, it follows every rule." (ink) and, below it, the italic blue "Hour three, it's forgotten them."; a 25px sans explanation at y900.
- **Right (7 cols):** an 11-row session log (mono timestamps 20px, sans messages 24px). The blue window starts at row 5 and bleeds off the right edge and down. The rules from 09:02 and 09:03 sit above it, struck through in blue. In lime inside the window: "↑ edits /payments. the rule is gone."
- **Transition:** the window moves from container (slide 1) to viewport (slide 2).

**03 · Insight. Data dominates.**
- **Headline:** serif 104px, "smallest" in italic.
- **Bar:** a full-width stacked bar (936×250) framed by a blue outline offset 12px and labelled "Context window · 100%".
- **Segments:** greys with labels and serif % inside the large ones; CLAUDE.md 4% gets a leader line. Your question is a 3% lime sliver with a leader to a 140px italic "3%".
- **Footnote** in mono: "Illustrative breakdown… Proportions vary." It's honest, not invented data.

**04 · Mechanism. Diagram dominates.**
- Three 250px-wide windows (Filling → Full → Compacted), each with a serif state name and a mono index, joined by serif arrows.
- **In Compacted:** the RULES block becomes a hatched "SUMMARY: 'has some rules'", with the blue note "↓ the detail is gone" and the new question in lime.

**05 · Example. Comparison dominates.**
- **The split:** the right half (x540+) is a blue field to y1170.
- **Session A (paper):** a crowded window of grey lines, and output `const UsrData` struck through: "Naming rule ignored."
- **Session B (blue):** a CLAUDE.md bar, three lines, a lime question, and output `const userData`: "Rule followed."
- **Headline split:** "Same task." in ink on paper and "Two sessions." in lime italic on blue, so the headline itself crosses the divide.

**06 · Reframe. Editorial composition.**
- Two lines of 150px serif: "Stop polishing the prompt." (ink) and "Curate the window." (blue italic), with 260px of air between them.
- A margin definition bottom-right (x540, 468px wide): "CONTEXT ENGINEERING, n." No graphics.

**07 · Application. Framework dominates.**
- A spec sheet of five rows between 2px ink rules.
- **Commands in blue mono 38px:** `/context`, `CLAUDE.md`, `/clear`, `/compact`, `Subagents`.
- **Each row:** what it does in sans 28px, and when to use it in mono 21px.

**08 · Takeaway. Minimal.**
- **Top-right:** a small outlined window (368×460) holding only "CLAUDE.md" (ink) and "your question" (lime), with dashed lines and "ROOM TO THINK" between them. It's the healthy version of slide 1's window.
- **Line:** 118px serif at y760, "Manage the window, *not the wording.*"
- **Gauge:** 96%.

**09 · Close. The reset.**
- **Canvas:** the whole slide is blue: the viewer is now inside a fresh window.
- **Prompt:** `> /clear` with a lime cursor (40px mono).
- **Line:** 170px serif "Fresh window. *Sharper Claude.*" (italic in lime).
- **CTA:** below a rule, a two-column row: "COMMENT / 'CONTEXT'" and the DM offer.
- **Gauge:** "CONTEXT CLEARED · 0%".

## Facts used (all Claude Code behaviour)
- **CLAUDE.md:** loads into every session.
- **`/clear`:** resets the conversation.
- **`/compact [instructions]`:** summarises the history, with optional focus instructions.
- **Auto-compact:** runs when the window nears full.
- **Subagents:** each runs in its own context window.
- **`/context`:** shows what's using the window.
- **Slide 3:** the percentages are labelled illustrative on the slide.
