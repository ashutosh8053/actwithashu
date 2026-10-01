# Caption

Comment "EYES" and I'll DM you all 4 install commands, plus the first prompt to try with each. (Follow so the DM lands.)
-
Claude writes your code, then tells you "it should work now".
It can't know. It never saw it run.

These 4 free MCPs fix that:

01 Playwright MCP: opens your app in a real browser, clicks through it, checks what broke
02 Chrome DevTools MCP: reads console errors, failed requests and slow pages
03 Context7 MCP: pulls current, version-specific docs into the prompt
04 shadcn MCP: installs real components instead of inventing its own

Start with Playwright. It changes the loop from "should work" to "I checked".

All open source. Nothing here is paid or sponsored.

Save this for your next build 🔖

#claudecode #claude #mcp #vibecoding #webdev #aitools #buildinpublic #frontend

---

# DM reply for "EYES"

Here are all 4 👇 (run them in your project folder)

01 Playwright MCP
claude mcp add playwright npx @playwright/mcp@latest
Try: "Open localhost:3000, sign up with a test email, and tell me exactly where it breaks."

02 Chrome DevTools MCP
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
Try: "Load the dashboard, read the console and network errors, and fix the first one."

03 Context7 MCP
claude mcp add --transport http context7 https://mcp.context7.com/mcp
Try: "Add auth middleware for my Next.js version. use context7"
(Free without a key; add a free API key for higher limits.)

04 shadcn MCP
npx shadcn@latest mcp init --client claude
Try: "Find a command menu in the shadcn registry and add it to the navbar."
