/* ============================================================
   NEUROS — backend "cortex"
   A tiny Express server that:
     1. serves the static site (index.html, styles.css, app.js)
     2. exposes POST /api/cortex, which streams a real Claude
        response back to the browser token-by-token.

   Your API key lives ONLY here (in the .env file) — never in the
   browser — so it can't be stolen by visitors.
   ============================================================ */

require("dotenv").config();
const path = require("path");
const express = require("express");
const { Anthropic } = require("@anthropic-ai/sdk");

const PORT = process.env.PORT || 3000;

// Reads ANTHROPIC_API_KEY from the environment (.env file).
const client = new Anthropic();

// The persona for the NEUROS "cortex".
const SYSTEM = `You are the Cortex — the reasoning core of NEUROS, an AI operating
system modeled on the human brain (memory = hippocampus, reasoning = cortex,
attention = amygdala, reflex = cerebellum). You are speaking through a terminal
console, so keep replies tight and useful: usually 1–4 short sentences unless the
user explicitly asks for depth. Be sharp, helpful, and a little futuristic — you
may lightly reference the brain-region metaphor, but never let it get in the way
of actually answering. Respond directly with your final answer; no preamble.`;

const app = express();
app.use(express.json({ limit: "32kb" }));

// Serve the website itself from this folder.
app.use(express.static(__dirname));

// --- The real AI endpoint -------------------------------------------------
app.post("/api/cortex", async (req, res) => {
  const message = (req.body && req.body.message ? String(req.body.message) : "").slice(0, 4000);
  if (!message.trim()) {
    res.status(400).send("empty message");
    return;
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");

  try {
    const stream = client.messages.stream({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content: message }],
    });

    // Push each token to the browser as it arrives.
    stream.on("text", (delta) => res.write(delta));

    await stream.finalMessage();
    res.end();
  } catch (err) {
    console.error("[cortex error]", err && err.message ? err.message : err);
    const note = "\n[cortex error: " + (err && err.message ? err.message : "unknown") + "]";
    if (!res.headersSent) res.status(500);
    res.end(note);
  }
});

app.listen(PORT, () => {
  console.log("\n  🧠  NEUROS is online.");
  console.log("      Open  http://localhost:" + PORT + "  in your browser.\n");
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("  ⚠  No ANTHROPIC_API_KEY found. Copy .env.example to .env and add your key,");
    console.log("     otherwise the console's `ask`/`think` commands will return an error.\n");
  }
});
