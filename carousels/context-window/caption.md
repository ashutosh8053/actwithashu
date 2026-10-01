# Caption

Comment "CONTEXT" and I'll DM you the CLAUDE.md template I start every project with.
-
If Claude feels sharp in hour one and careless in hour three, it isn't getting dumber. Its context window is full.

Everything competes for one fixed window: the system prompt, files it read, tool output, the whole chat. Your actual question is usually the smallest thing in there. When it fills up, older history gets summarised, and the rules you set at 9am become "user has some rules".

So stop polishing prompts. Curate the window:

01 /context: see what's filling it before you blame the model
02 CLAUDE.md: rules that load into every session
03 /clear: new task, new window
04 /compact: summarise on your terms ("/compact keep the API decisions")
05 Subagents: side quests get their own window

Manage the window, not the wording.

Save this for your next session 🔖

#claudecode #claude #aitools #promptengineering #contextengineering #vibecoding #softwareengineering #buildinpublic

---

# DM reply for "CONTEXT"

Here's my CLAUDE.md starter. Put it in your project root, fill in the brackets, and keep it under a page. Claude loads it at the start of every session.

```md
# Project: [name]
[One line: what this is and who it's for.]

## Commands
- Install: [pnpm install]
- Dev: [pnpm dev]
- Test: [pnpm test]  ← run before saying a task is done
- Lint: [pnpm lint]

## Rules
- Naming: [camelCase for variables, PascalCase for components]
- Never edit [/payments, /migrations] without asking first.
- Use [pnpm], not npm.
- Prefer editing existing files over creating new ones.

## Architecture
- [src/api]: [what lives here]
- [src/ui]: [what lives here]

## Working style
- For big changes, propose a plan before writing code.
- Keep answers short. Show diffs, not whole files.
```

Rule of thumb: if you've typed the same instruction twice in chat, it belongs in this file.
