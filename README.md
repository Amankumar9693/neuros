# 🧠 NEUROS — The Cognitive Operating System

A concept website for an AI operating system modeled on the architecture of the human
brain. Instead of files and folders, NEUROS is organized around **memory, reasoning,
attention, and reflex** — each mapped to a real brain region. It's pitched as the
interface layer between a human mind and AI.

> **The angle:** every OS organizes *data*. NEUROS organizes *cognition*. That's the
> "multi-dollar" story — a fresh, fundable narrative at the intersection of neurology,
> the mind, machines, and AI.

## ✨ What's inside

- **Animated neural-network background** — a live canvas of synapses that reacts to your mouse.
- **OS boot sequence** — the four cognitive regions "mount" on load (press `Esc` to skip).
- **Live cognitive console** — a working terminal. Type real commands:
  - `help`, `regions`, `status`, `sync`, `whoami`, `clear`
  - `remember <thing>` → hippocampus
  - `think <goal>` → cortex
  - `focus` → amygdala
  - `automate` → cerebellum
  - ↑ / ↓ cycle command history (and there's a hidden `sudo` easter egg)
- **Architecture section** — the four brain-region "features" with scroll reveals.
- **Waitlist** — validates email and saves it to `localStorage` (concept build, no server needed).
- Fully **responsive** and respects `prefers-reduced-motion`.

## 🚀 Run it

### Option A — instant demo (no setup)

Just open the file. The `ask`/`think` commands fall back to scripted replies.

```
Double-click  index.html
```

### Option B — with a REAL AI cortex 🤖

Connect the console to a live Claude model so `ask` and `think` actually think.
One-time setup:

```bash
# 1. install dependencies (already done if you cloned with them)
npm install

# 2. add your Anthropic API key
#    - copy .env.example  →  .env
#    - paste your key from https://console.anthropic.com/

# 3. start the server
npm start
```

Then open **http://localhost:3000** and try:

```
ask how do I get my first 100 users?
think launch a neurotech startup
```

The reply streams in live, token-by-token, from `claude-opus-4-8`.

> 🔒 Your API key lives only in `.env` (which is git-ignored) and is used only by
> the local server — it is never sent to the browser.

## 📁 Files

| File           | Purpose                                          |
|----------------|--------------------------------------------------|
| `index.html`   | Page structure & content                         |
| `styles.css`   | Theme, layout, animations                        |
| `app.js`       | Canvas, boot sequence, console, waitlist logic   |
| `server.js`    | Node/Express backend — streams the real AI cortex |
| `package.json` | Dependencies & the `npm start` script            |
| `.env.example` | Template for your private API key                |

## 🔮 Where to take it next

- Wire the **console** to a real LLM (the "cortex") via the Claude API.
- Make the **waitlist** post to a real backend / email service.
- Turn each **region** into an actual feature page.
- Add a **/manifesto** long-form page to deepen the brand story.

---

*Concept build — mind · machine · meaning.*
