# Caption: "Stop shipping UI that looks AI-made"

Comment "SKILLS" and I'll DM you every install command in one message. (Follow so the DM lands.)
-
READ BELOW, here's everything that didn't fit in the carousel:

Ask Claude for a website with no direction and you get its safest defaults. Purple gradient, three cards, everything centered. That's why so much AI-built UI looks the same.

Skills fix that. They're instruction files Claude Code loads on its own, so you set the taste once instead of re-explaining it in every prompt.

The 7 I actually use:

1. Design Taste (Leonxlnx/taste-skill)
The anti-slop skill. Reads your brief, picks a real design direction, and runs a pre-flight check before it ships.

2. UX Designer (szilu/ux-designer-skill)
Turns Claude into a UX reviewer: accessibility audits (WCAG 2.2), microcopy, forms, tables, navigation.

3. Transitions (Jakubantalik/transitions.dev)
Production-ready CSS motion for modals, dropdowns, toasts, tabs and loaders, all on one motion-token scale.

4. Canvas Design (anthropics/skills)
Anthropic's own skill for posters and visual art, exported as PNG or PDF.

5. Web Artifacts Builder (anthropics/skills)
Multi-page React + Tailwind + shadcn/ui apps, bundled into one shareable HTML file.

6. App Store Screenshots (ParthJadhav/app-store-screenshots)
App Store and Google Play marketing screenshots with device mockups.

7. Redesign Existing Projects (Leonxlnx/taste-skill)
Point it at an old site. It flags the generic AI patterns and upgrades them without breaking anything.

How they stack:
Direction → Structure → Build → Motion → Launch.
Design Taste sets the look, UX Designer makes it usable, Web Artifacts builds it, Transitions makes it move, and Canvas + App Store Shots handle launch.

Not sure where to start? Install Design Taste first. You'll see the difference on your very next build.

Every command is tested. All 7 are public repos. Nothing here is paid or sponsored.

Save this for your next build session 🔖

#claudecode #claude #aitools #webdesign #uidesign #uxdesign #frontend #vibecoding #buildinpublic #aiagents

---

## DM reply for "SKILLS" comments

Here are all 7 install commands 👇 (run them inside your project folder)

1. npx skills add Leonxlnx/taste-skill
2. git clone https://github.com/szilu/ux-designer-skill.git ~/.claude/skills/ux-designer
3. npx skills add Jakubantalik/transitions.dev
4. npx skills add anthropics/skills --skill canvas-design
5. npx skills add anthropics/skills --skill web-artifacts-builder
6. npx skills add ParthJadhav/app-store-screenshots
7. npx skills add Leonxlnx/taste-skill --skill redesign-existing-projects

Tip: then just ask Claude Code to "use the design-taste-frontend skill" on your next page.
