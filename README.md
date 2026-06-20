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

No build step, no install, no internet required. Just open the file:

```
Double-click  index.html
```

Or from a terminal in this folder:

```bash
# optional: serve it (nicer for some browsers)
python -m http.server 8000
# then visit http://localhost:8000
```

## 📁 Files

| File          | Purpose                                        |
|---------------|------------------------------------------------|
| `index.html`  | Page structure & content                       |
| `styles.css`  | Theme, layout, animations                      |
| `app.js`      | Canvas, boot sequence, console, waitlist logic |

## 🔮 Where to take it next

- Wire the **console** to a real LLM (the "cortex") via the Claude API.
- Make the **waitlist** post to a real backend / email service.
- Turn each **region** into an actual feature page.
- Add a **/manifesto** long-form page to deepen the brand story.

---

*Concept build — mind · machine · meaning.*
